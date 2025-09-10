"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading, Paragraph } from "@/components/ui/typography";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HatGlasses } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";
import { ForgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { PropagateLoader } from "react-spinners";

export default function ForgetPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const forgotPasswordForm = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post<ApiResponse>("/api/auth/forgot-password", {
        email: data.email,
      });
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg =
        axiosError.response?.data.message || "Failed to send reset email";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-teal-900/70 flex justify-center items-center relative py-10 px-4">
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
      <div className="w-full max-w-md p-6 md:p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-teal-300/50 animate-fade-in container mx-auto">
        <div className="text-center space-y-4">
          <HatGlasses className="h-12 w-12 text-teal-300 mx-auto animate-pulse" />
          <Heading
            level="sectionheadinglarge"
            className="font-extrabold tracking-tight text-white"
          >
            Forgot Password
          </Heading>
          <Paragraph
            size="xl"
            className="text-teal-100 opacity-90 max-w-sm mx-auto"
          >
            Enter your email address to receive a password reset link
          </Paragraph>
        </div>
        <Form {...forgotPasswordForm}>
          <form
            onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={forgotPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-200">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email"
                      className="bg-white/5 border-teal-300/50 text-white placeholder-teal-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200/50 transition-all duration-300"
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
                  <div className="flex items-center">
                    <PropagateLoader color="#ffffff" size={10} />
                  </div>
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
