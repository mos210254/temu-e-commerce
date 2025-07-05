"use server";

import { getCurrentSession } from "@/actions/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ca } from "zod/v4/locales";

export const createCart = async () => {
    const { user } = await getCurrentSession();

    const cart = await prisma.cart.create({
        data: {
            id: crypto.randomUUID(),
            user: user ? { connect: { id: user.id } } : undefined,
            items: {
                create: [],
            },
        },
        include: {
            items: true,
        },
    });

    return cart;
};

export const getOrCreateCart = async (cartId?: string | null) => {
    const { user } = await getCurrentSession();

    if (user) {
        const userCart = await prisma.cart.findUnique({
            where: {
                userId: user.id,
            },
            include: {
                items: true,
            },
        });

        if (userCart) {
            return userCart;
        }
    }

    if (!cartId) {
        return createCart();
    }

    const cart = await prisma.cart.findUnique({
        where: {
            id: cartId
        },
        include: {
            items: true,
        }
    });

    if (!cart) {
        return createCart();
    }

    return cart;
};

export const updateCartItem = async (
    cartId: string,
    sanityProductId: string,
    data: {
        title?: string;
        price?: number;
        image?: string;
        quantity?: number;
    }
) => {
    const cart = await getOrCreateCart(cartId);

    const existingItem = cart.items.find((item) => item.sanityProductId === sanityProductId);

    if (existingItem) {
        if (data.quantity === 0) {
            await prisma.cartLineItem.delete({
                where: {
                    id: existingItem.id,
                },
            });
        } else if (data.quantity && data.quantity > 0) {
            await prisma.cartLineItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: data.quantity,
                },
            });
        }
    } else if (data.quantity && data.quantity > 0) {
        await prisma.cartLineItem.create({
            data: {
                id: crypto.randomUUID(),
                cartId: cart.id,
                sanityProductId: sanityProductId,
                quantity: data.quantity || 1,
                title: data.title || "",
                price: data.price || 0,
                image: data.image || "",
            },
        });
    }

    revalidatePath("/");
    return getOrCreateCart(cartId);
};

export const syncCartWithUser = async (cartId: string | null) => {
    const { user } = await getCurrentSession();

    if (!user) {
        return null;
    }

    const existingUserCart = await prisma.cart.findUnique({
        where: {
            userId: user.id,
        },
        include: {
            items: true,
        },
    });

    const existingAnonymousCart = cartId
        ? await prisma.cart.findUnique({
              where: {
                  id: cartId,
              },
              include: {
                  items: true,
              },
          })
        : null;

    if (!cartId && existingUserCart) {
        return existingUserCart;
    }

    if (!cartId) {
        return createCart();
    }

    if (!existingAnonymousCart && !existingUserCart) {
        return createCart();
    }

    if (!existingUserCart) {
        const newCart = await prisma.cart.update({
            where: {
                id: cartId,
            },
            data: {
                user: {
                    connect: {
                        id: user.id,
                    },
                },
            },
            include: {
                items: true,
            },
        });
        return newCart;
    }

    if (!existingAnonymousCart) {
        return existingUserCart;
    }

    for (const item of existingAnonymousCart.items) {
        const existingItem = existingUserCart.items.find((i) => i.sanityProductId === item.sanityProductId);

        if (existingItem) {
            // add two cart quantities together
            await prisma.cartLineItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: existingItem.quantity + item.quantity,
                },
            });
        } else {
            // add non-existing item to the user's cart
            await prisma.cartLineItem.create({
                data: {
                    id: crypto.randomUUID(),
                    cartId: existingUserCart.id,
                    sanityProductId: item.sanityProductId,
                    quantity: item.quantity,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                },
            });
        }

        await prisma.cart.delete({
            where: {
                id: cartId,
            },
        });

        revalidatePath("/");
        return getOrCreateCart(existingUserCart.id);
    }
};
