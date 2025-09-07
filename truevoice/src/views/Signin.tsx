'use client';
import { Heading, Paragraph } from "@/components/ui/typography";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Lock, Eye, HatGlasses } from 'lucide-react'
import { SignInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';




export default function Signin() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()

    // Zod validation
    const signInForm = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    })



    const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
        setIsSubmitting(true);

        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            toast.error(result.error);
            setIsSubmitting(false);
        }

        if (result?.url) {
            toast.success("Signed in successfully!");
            router.replace("/dashboard");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-teal-900/70 flex justify-center items-center relative  py-10 px-4">
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
            <div className="w-full max-w-md p-6 md:p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-teal-300/50 animate-fade-in">
                <div className="text-center space-y-4">
                    <Heading level="sectionheadinglarge"  className="font-extrabold tracking-tight text-white">Unlock Anonymous Insights</Heading>
                     <Paragraph size="xl" className=" text-teal-100 opacity-90 max-w-sm mx-auto"> Share honest feedback without revealing your identity</Paragraph>
                </div>

                <Form {...signInForm}>
                    <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={signInForm.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-teal-200">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-300" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signInForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-teal-200">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="password"
                                            type="password"
                                            className=""
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-300" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center">
                     <Paragraph size="large" className="text-teal-100"> Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="text-teal-300 font-medium hover:text-white transition-colors"
                        >
                            Create Account
                        </Link></Paragraph>
                </div>
            </div>
        </div>
    );
}
