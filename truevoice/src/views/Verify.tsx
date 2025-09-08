"use client";
import { VerifySchema } from "@/schemas/verifySchema";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading, Paragraph } from "@/components/ui/typography";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { HatGlasses, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";

export default function Verify() {
    const [isVerifying, setIsVerifying] = useState(false);
    const params = useParams<{ username: string }>();
    const router = useRouter();

    const verifyForm = useForm<z.infer<typeof VerifySchema>>({
        resolver: zodResolver(VerifySchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
        try {
            setIsVerifying(true);
            const res = await axios.post<ApiResponse>("/api/verify-code", {
                username: params.username,
                code: data.code,
            });
            toast.success(res.data.message);
            router.replace("/sign-in");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMsg = axiosError.response?.data.message || "Verification failed";
            toast.error(errorMsg);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-teal-900/70 flex justify-center items-center relative py-10 px-4">
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
            <div className="w-full max-w-md p-6 md:p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-teal-300/50 animate-fade-in">
                <div className="text-center space-y-4">
                    <HatGlasses className="h-12 w-12 text-teal-300 mx-auto animate-pulse" />

                    <Heading level="sectionheadinglarge"  className="font-extrabold tracking-tight text-white"> Verify Your Account</Heading>
                     <Paragraph size="xl" className="text-teal-100 opacity-90 max-w-sm mx-auto">Enter the verification code sent to your email</Paragraph>
                </div>
                <Form {...verifyForm}>
                    <form onSubmit={verifyForm.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={verifyForm.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-teal-200">Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="verify-code"
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
                            disabled={isVerifying}
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                "Verify Code"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}