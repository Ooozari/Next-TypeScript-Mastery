"use client";
import { useEffect, useState } from "react";
import { Heading, Paragraph } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { HatGlasses, Send, Loader2, XCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSchema } from "@/schemas/messageSchema";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function SendMessage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { username } = useParams(); // Extract username from URL (e.g., /u/username)
  const [remaining, setRemaining] = useState(5);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState<
    boolean | null
  >(null); // null while loading
  const sendMessageForm = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  });

  // checking the message acceptance status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.post<ApiResponse>("/api/msg-accept-status", {
          username,
        });
        if (res.data.success) {
          const status = res.data.isAcceptingMessages;
          setIsAcceptingMessages(status as boolean);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMsg =
          axiosError.response?.data.message ||
          "Failed to check accept message status";
        toast.error(errorMsg);
        setIsAcceptingMessages(false);
      }
    };
    checkStatus();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
      if (response.data.success) {
        toast.success("Message sent anonymously!");
        sendMessageForm.reset();
        // Optionally redirect or stay on page
        // router.push(`/u/${username}/success`);
      } else {
        toast.error(response.data.message || "Failed to send message.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg =
        axiosError.response?.data.message || "Unable to send message.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100vh] bg-gradient-to-r from-teal-900 to-teal-700 relative ">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
      {/* Send Message Section */}
      <section className="py-[100px] md:py-[120px] text-white relative min-h-[100vh] container mx-auto">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: User Info */}
            <div className="space-y-6">
              <Heading
                level="sectionheadingmd"
                className="font-extrabold tracking-tight leading-tight"
              >
                Send Feedback to @{username}
              </Heading>
              {/* Status Indicator */}
              {isAcceptingMessages === null ? (
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 w-fit">
                  <Loader2 className="h-5 w-5 text-teal-300 animate-spin" />
                  <Paragraph size="normal" className="font-medium">
                    Checking status...
                  </Paragraph>
                </div>
              ) : isAcceptingMessages ? (
                <div className="flex items-center space-x-2 bg-teal-500/20 border border-teal-300/50 rounded-lg px-4 py-2 w-fit animate-fade-in">
                  <CheckCircle className="h-5 w-5 text-teal-300" />
                  <Paragraph size="normal" className="font-medium">
                    Accepting Messages
                  </Paragraph>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-red-500/20 border border-red-300/50 rounded-lg px-4 py-2 w-fit animate-fade-in">
                  <XCircle className="h-5 w-5 text-red-300" />
                  <Paragraph size="normal" className="font-medium">
                    Not Accepting Messages
                  </Paragraph>
                </div>
              )}
              <Paragraph size="xl" className="opacity-90 max-w-md">
                Share honest, anonymous feedback to help @{username} grow. Your
                identity stays hidden—focus on the message.
              </Paragraph>
              <Paragraph size="normal" className="opacity-80">
                Want to receive feedback too?{" "}
                <Link
                  href="/sign-up"
                  className="text-teal-300 font-medium hover:text-white transition-colors"
                >
                  Create Your Profile
                </Link>
              </Paragraph>
            </div>

            {/* Right: Message Form */}
            <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-2xl border border-white/20">
              <Form {...sendMessageForm}>
                <form
                  onSubmit={sendMessageForm.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={sendMessageForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-200">
                          Your Anonymous Message
                        </FormLabel>
                        <FormControl>
                          <ScrollArea className="max-h-[180px]">
                            <Textarea
                              disabled={isSubmitting || !isAcceptingMessages}
                              {...field}
                              placeholder="Type your feedback here "
                              className="min-h-[150px]"
                            />
                          </ScrollArea>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isAcceptingMessages}
                    className="w-full font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />{" "}
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Anonymously ({remaining} remaining)
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
