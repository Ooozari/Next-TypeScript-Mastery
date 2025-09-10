"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading, Paragraph } from "@/components/ui/typography";
import { Verifying } from "@/components/shared";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HatGlasses, Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";
import { ResetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { PageNotFound } from "@/components/shared";
import { PropagateLoader } from "react-spinners";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const userToken = searchParams.get("token");
  const id = searchParams.get("id");
  // but we will make an api endpoint to validate the token
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const resetPasswordForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // update-password api
  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    try {
      setIsSubmitting(true);
      const res = await axios.put<ApiResponse>("/api/auth/update-password", {
        token: userToken,
        userId: id,
        newPassword: data.password,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        router.replace("/sign-in");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg =
        axiosError.response?.data.message || "Failed to reset password";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!userToken || !id) {
      setIsValidToken(false);
      return;
    }

    const validate = async () => {
      try {
        const res = await axios.post("/api/auth/validate-reset-link", {
          token: userToken,
          userId: id,
        });

        if (res.data.success) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        setIsValidToken(false);
      }
    };

    validate();
  }, [userToken, id]);

  if (isValidToken === null) {
    return <Verifying />;
  }

  //  No token in URL
  if (!userToken || !id || isValidToken === false) {
    return <PageNotFound />;
  }

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-teal-900/70 flex justify-center items-center relative py-10 px-4">
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
        <div className="w-full max-w-md p-6 md:p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-teal-300/50 animate-fade-in container mx-auto">
          <div className="text-center space-y-4">
            <HatGlasses className="h-12 w-12 text-teal-300 mx-auto animate-pulse" />
            <Heading
              level="sectionheadinglarge"
              className="font-extrabold tracking-tight text-white"
            >
              Reset Your Password
            </Heading>
          </div>
          <Form {...resetPasswordForm}>
            <form
              onSubmit={resetPasswordForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={resetPasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-200">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New password"
                        className="bg-white/5 border-teal-300/50 text-white placeholder-teal-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200/50 transition-all duration-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
              <FormField
                control={resetPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-200">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
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
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
