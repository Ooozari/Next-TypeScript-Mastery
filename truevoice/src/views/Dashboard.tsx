"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { HatGlasses, Copy, LogOut, Gem, RefreshCw } from "lucide-react";
import { MessageCard } from "@/components/shared";
import { Heading, Paragraph } from "@/components/ui/typography";
import * as z from "zod";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import { Imessage } from "@/models/User";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import {
  MessageSkeleton,
  ProfileLinkSkeleton,
  ToggleSwitchSkeleton,
  HeadingSkeleton,
} from "@/components/shared";

export default function Dashboard() {
  const { data: session } = useSession();
  const username = session?.user.username;
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isDeletingMsg, setIsDeletingMsg] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Form + Zod Validations
  const form = useForm<z.infer<typeof AcceptMessageSchema>>({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // Check user Accept Message status
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      //get request to check accept message status
      const res = await axios.get("/api/accept-message");
      setValue("acceptMessages", res.data.isAcceptingMsg);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to fetch message acceptance status"
      );
    } finally {
      setIsSwitchLoading(false);
      
    }
  }, [setValue]);

  // Fetching the messages
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const res = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(res.data.messages || []);
        setHasFetched(true);
        if (refresh) toast.success("You are up to date");
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to fetch messages"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setMessages]
  );

  // Handle for chnage switch status
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.post("/api/accept-message", {
        // updating the status in the Database
        acceptMessages: !acceptMessages,
      });
      // also have to update in the UI
      setValue("acceptMessages", !acceptMessages);
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to update message acceptance status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !session?.user) return;
    (fetchMessages(), fetchAcceptMessage());
  }, [session, setValue, fetchMessages]);

  // Copy to clipboard Funtionalities
  const [profileLink, setProfileLink] = useState<string | null>(null);
  const generateProfileLink = () => {
    const domain = window.location.origin;
    setProfileLink(`${domain}/u/${username}`);
  };
  useEffect(() => {
    generateProfileLink();
  }, [username]);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileLink as string);
    toast.success("Profile link copied!");
  };

  // Delete Message End Point 
  const handleDeleteConfirm = async (messageId: string) => {
    setIsDeletingMsg(true);
    const toastId = toast.loading("Deleting message...");
    try {
      const res = await axios.delete(`/api/delete-message/${messageId}`);
      toast.success(res.data.message || "Message deleted!", { id: toastId });
      // Optionally refresh state:
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Error deleting message",
        { id: toastId }
      );
    } finally {
      setIsDeletingMsg(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4 md:p-6">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900 to-teal-800 text-white rounded-2xl p-4 md:p-8 mb-8 shadow-2xl relative animate-fade-in container mx-auto">
          <div className="absolute rounded-2xl inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <HatGlasses className="w-8 h-8 md:h-10 md:w-10 xl:h-12 xl:w-12 text-teal-300 animate-pulse" />
              </Link>
              {username ? (
                <Heading
                  level="pageheading"
                  className="font-extrabold tracking-tight md:block hidden "
                >
                  Welcome, @{username}
                </Heading>
              ) : (
                <HeadingSkeleton />
              )}
            </div>
            <Button
              variant="glassy"
              onClick={() => signOut()}
              className="flex items-center space-x-1.5 md:space-x-2 transition-all duration-300 hover:shadow-lg"
            >
              <LogOut className="w-[18px] h-[18px] md:h-5 md:w-5" />
              <span>Log Out</span>
            </Button>
          </div>
        </header>

        {/* Profile Summary & Controls */}
        <section className="bg-gradient-to-r from-teal-900 to-teal-700 text-white rounded-xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden animate-fade-in container mx-auto">
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Profile Info */}
            <div className="space-y-4 md:space-y-6">
              <Heading
                level="sectionheadinglarge"
                className="font-extrabold tracking-tight"
              >
                Your Feedback Hub
              </Heading>
              <Paragraph size="xl" className="opacity-90 max-w-md">
                Manage your anonymous feedback and share your profile to get
                more insights.
              </Paragraph>
            </div>

            {/* Right: Toggle & Copy URL */}
            <div className="space-y-6">
              {/* Toggle Switch */}
              {acceptMessages === undefined ? (
                <ToggleSwitchSkeleton />
              ) : (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      {...register("acceptMessages")}
                      disabled={isSwitchLoading}
                      checked={acceptMessages}
                      onCheckedChange={handleSwitchChange}
                      id="accept-messages"
                      className="data-[state=checked]:bg-teal-500"
                    />
                    <label
                      htmlFor="accept-messages"
                      className="text-sm font-medium"
                    >
                      Accept Anonymous Messages
                    </label>
                  </div>
                  <Paragraph size="sm" className="text-teal-300/60 md:block hidden">
                    Currently: {acceptMessages ? " On" : " Off"}
                  </Paragraph>
                </div>
              )}

              {/* Copy URL */}
              {profileLink ? (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                  <label className="text-sm font-medium block mb-2">
                    Share Your Profile
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={profileLink ?? "loading..."}
                      readOnly
                      className="bg-white/5 border-white/30 text-white rounded-lg"
                    />
                    <Button
                      onClick={handleCopy}
                      className="shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <ProfileLinkSkeleton />
              )}
            </div>
          </div>
        </section>

        {/* Received Messages */}
        <section className="mb-8 container mx-auto">
          <div className="flex justify-between md:flex-row flex-col mb-6 items-center gap-3">
            <Heading level="sectionheading" className="font-bold text-gray-900">
              Your Received Messages
            </Heading>
            <Button
              className="self-end"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
            >
              <RefreshCw
                className={`w-5 h-5 cursor-pointer transition-transform ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>

          {isLoading || !hasFetched ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {Array.from({ length: Math.min(messages.length || 3, 3) }).map(
                (_, i) => (
                  <MessageSkeleton key={i} />
                )
              )}
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center text-gray-600">
              <p>
                No messages yet. Share your profile link to start receiving
                feedback!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onDelete={handleDeleteConfirm}
                  isDeletingMsg={isDeletingMsg}
                />
              ))}
            </div>
          )}
        </section>

        {/* CTA: Upgrade or Settings */}
        <section className="bg-gradient-to-r from-teal-900 to-teal-700 text-white p-6 md:p-8 rounded-2xl text-center shadow-2xl relative container mx-auto">
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none rounded-2xl"></div>
          <div className="flex justify-center items-center gap-2 mb-4">
            <Gem className="md:w-10 md:h-10 w-7 h-7 text-teal-300 animate-pulse" />

            <Heading
              level="sectionheadinglarge"
              className=" font-extrabold tracking-tight flex justify-center items-center"
            >
              Premium Features
            </Heading>
          </div>

          <Paragraph size="xl" className="opacity-90 max-w-md mx-auto mb-6">
            {" "}
            Unlock advanced analytics, custom prompts, and exclusive tools with
            True Voice Premium.
          </Paragraph>

          <div className="flex justify-center items-center gap-4">
            <Button variant="dummy" className="">
              Coming Soon
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
