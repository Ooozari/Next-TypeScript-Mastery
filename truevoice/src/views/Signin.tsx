'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect } from 'react';
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
import { Loader2 } from 'lucide-react'
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
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Join True Voice
                        </h1>
                        <p className="mb-4">Sign in to start your anonymous adventure</p>
                    </div>

                    <Form {...signInForm}>
                        <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={signInForm.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={signInForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full'>
                                {
                                    isSubmitting ? (
                                        <>

                                            <Loader2 className='animate-spin mr-2' /> <span>Signing in...</span>
                                        </>
                                    ) : ('Sign in')
                                }

                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <p>
                            Don't have acount?{' '}
                            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                                create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
