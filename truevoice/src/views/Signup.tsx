'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios'
import { useState, useEffect } from 'react';
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpValidation } from '@/schemas/signUpSchema';
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
import { Loader2 } from 'lucide-react'




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
                    const response = await axios.get(`/api/unique-username?username=${username}`)

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
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Join True Feedback
                        </h1>
                        <p className="mb-4">Sign up to start your anonymous adventure</p>
                    </div>

                    <Form {...signupForm}>
                        <form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={signupForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="username"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    setUsername(e.target.value)
                                                }} />
                                        </FormControl>
                                        {usernameMsg && (
                                            <p
                                                className={`text-sm ${usernameMsg === 'Username is unique'
                                                        ? 'text-green-500'
                                                        : 'text-red-500'
                                                    }`}
                                            >
                                                {usernameMsg}
                                            </p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={signupForm.control}
                                name="email"
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
                                control={signupForm.control}
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

                                            <Loader2 className='animate-spin mr-2' /> <span>Submiting...</span>
                                        </>
                                    ) : ('Sign up')
                                }

                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <p>
                            Already a member?{' '}
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
