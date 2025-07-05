"use client";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { useCartStore } from "@/stores/cart-store";
import { Loader2, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { useShallow } from "zustand/shallow";

type AddToCartButtonProps = {
    product: Product;
};

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
    const { cartId, addItem, open } = useCartStore(
        useShallow((state) => ({
            cartId: state.cartId,
            addItem: state.addItem,
            open: state.open,
        }))
    );

    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        if (!product.title || product.price === undefined || !product.image) {
            return;
        }
        setIsLoading(true);
        // Add item to the cart
        await new Promise((resolve) => setTimeout(resolve, 600));

        addItem({
            id: product._id,
            title: product.title,
            price: product.price,
            image: urlFor(product.image).url(),
            quantity: 1,
        });

        setIsLoading(false);
        open();
    };

    if (!product.price) return null;

    return (
        <button
            type="button"
            disabled={isLoading}
            onClick={handleAddToCart}
            className={`
                    from-red-500 to-red-600 w-full mt-6 bg-gradient-to-r 
                    text-white py-4 rounded-full font-bold text-xl
                    hover:from-red-600 hover:to-red-700
                    transition-all transform
                    hover:scale-[1.02] active:scale-[1.02] cursor-pointer
                    shadow-xl flex items-center justify-center gap-3
                    disabled:opacity-80 disabled:cursor-not-allowed
                    disabled:hover:scale-100 disabled:active:scale-100
                    disabled:hover:from-red-500 disabled:hover:to-red-600
                `}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding to cart...
                </>
            ) : (
                // icon cart
                <>
                    <ShoppingCart className="w-6 h-6" />
                    Add to Cart - {formatPrice(product.price)}
                </>
            )}
        </button>
    );
};

export default AddToCartButton;
