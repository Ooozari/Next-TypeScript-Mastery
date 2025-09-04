'use client';
import { VerifySchema } from '@/schemas/verifySchema'
import { useParams, useRouter } from 'next/navigation'
import React from 'react';
import { Message, useForm } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios'
import { useState } from 'react';
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react'


export default function Verify() {
    const [isVerifying, setIsVerifying] = useState(false)
    const params = useParams<{ username: string }>()
    const router = useRouter()

    const verifyForm = useForm<z.infer<typeof VerifySchema>>({
        resolver: zodResolver(VerifySchema),
        defaultValues: {
            code: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof VerifySchema>) => {

        try {
            setIsVerifying(true)
            const res = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code,
            })

            toast.success(res.data.message)
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMsg = axiosError.response?.data.message || "Verification failed";
            toast.error(errorMsg);

        } finally {
            setIsVerifying(false)
        }
    }
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Verify Your Account
                        </h1>
                        <p className="mb-4">Enter the verification code sent to your email</p>
                    </div>
                    <Form {...verifyForm}>
                        <form onSubmit={verifyForm.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={verifyForm.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="verify-code"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full'>
                                {
                                    isVerifying ? (
                                        <>
                                            <Loader2 className='animate-spin mr-2' /> <span>Verifying...</span>
                                        </>
                                    ) : ('Verify code')
                                }

                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}