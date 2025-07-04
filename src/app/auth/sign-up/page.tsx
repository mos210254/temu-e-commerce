import { getCurrentSession, registerUser, loginUser } from "@/actions/auth";
import SignUp from "@/components/auth/SignUp";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
});

const SignUpPage = async () => {
    const { user } = await getCurrentSession();

    if (user) {
        return redirect("/");
    }

    const action = async (prevState: any, formData: FormData) => {
        "use server";
        const pared = signUpSchema.safeParse(Object.fromEntries(formData));

        if (!pared.success) {
            return {
                message: "Invalid form data",
            };
        }

        const { email, password } = pared.data;
        const { user, error } = await registerUser(email, password);

        if (error) {
            return {
                message: error,
            };
        } else if (user) {
            await loginUser(email, password);
            return redirect("/");
        }
    };

    return <SignUp action={action} />;
};

export default SignUpPage;
