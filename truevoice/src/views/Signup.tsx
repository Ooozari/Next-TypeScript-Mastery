'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Heading, Paragraph } from "@/components/ui/typography";
import axios, { AxiosError } from 'axios'
import { useState, useEffect } from 'react';
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpValidation } from "@/schemas/signUpSchema";
import { ApiResponse } from '@/types/ApiResponse';
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
import { HatGlasses, Loader2 } from 'lucide-react'




export default function Signup() {
    // this state is only required because we have to validate the unique username
    const [username, setUsername] = useState('');
    const [usernameMsg, setUsernameMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 400)
    const router = useRouter()

    // Zod validation
    const signupForm = useForm<z.infer<typeof SignUpValidation>>({
        resolver: zodResolver(SignUpValidation),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    // Sending api request to validate the username
    useEffect(() => {
        const checkUsernameUnique = async () => {
            // IF there is some value in debounce then we want to run the 
            if (username) {
                setUsernameMsg('')

                try {
                    //TODO: LOG THIS RESPONSE
                    const response = await axios.get<ApiResponse>(`/api/unique-username?username=${username}`)

                    // setting the username message according to the reponse from the api
                    setUsernameMsg(response.data.message)

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMsg(axiosError.response?.data.message ?? "Error checking username")
                }
            }

        }
        checkUsernameUnique()
    }, [username])

    // Sign-up submit
    const onSubmit = async (data: z.infer<typeof SignUpValidation>) => {
        setIsSubmitting(true)

        try {
            //STEP 1: Sending api request to register user
            const res = await axios.post<ApiResponse>('/api/sign-up', data)

            //STEP 2: sending toast on succes
            toast.success(res.data.message)

            //STEP 3: redirecting user to verify account page after success
            router.replace(`/verify/${username}`)
            //STEP 2: Setting the loader to false
            setIsSubmitting(false)

        } catch (error) {
            console.error("Error is signing in user", error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMsg = axiosError.response?.data.message || "Something went wrong";
            toast.error(errorMsg);
            setIsSubmitting(false)
        }

    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-teal-900/70 flex justify-center items-center relative py-10 px-4">
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
            <div className="w-full max-w-md p-6 md:p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-teal-300/50 animate-fade-in">
                <div className="text-center space-y-4">
                    <div className='flex justify-center items-center gap-4'>
                        <HatGlasses className="h-10 w-10 md:h-12 md:w-12 text-teal-300  animate-pulse" />
                        <Heading level="sectionheadinglarge" className="font-extrabold tracking-tight text-white">Join True Voice</Heading>
                    </div>
                    <Paragraph size="xl" className="text-teal-100 opacity-90 max-w-sm mx-auto">Sign up to start your anonymous adventure</Paragraph>
                </div>

                <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={signupForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-teal-200">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                                setUsernameMsg(e.target.value ? "Username is unique" : "");
                                            }}

                                        />
                                    </FormControl>
                                    {usernameMsg && (
                                        <p
                                            className={`text-sm ${usernameMsg === "Username is unique"
                                                ? "text-teal-300"
                                                : "text-red-300"
                                                }`}
                                        >
                                            {usernameMsg}
                                        </p>
                                    )}
                                    <FormMessage className="text-red-300" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signupForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-teal-200">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="email"
                                            className=""
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-300" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signupForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-teal-200">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="password"
                                            type="password"
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
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center">
                    <Paragraph size="large" className="text-teal-100"> Already a member?{" "}
                        <Link
                            href="/sign-in"
                            className="text-teal-300 font-medium hover:text-white transition-colors"
                        >
                            Sign In
                        </Link></Paragraph>
                </div>
            </div>
        </div>
    );
}
