"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { HatGlasses, Copy, LogOut, Gem, Trash2, RefreshCw } from "lucide-react";
import * as z from 'zod';
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react"
import { Imessage } from "@/models/User";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";


export default function Dashboard() {

    const { data: session } = useSession();
    const username = session?.user.username
    const [messages, setMessages] = useState<Imessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    // Form + Zod Validations
    const form = useForm<z.infer<typeof AcceptMessageSchema>>({
        resolver: zodResolver(AcceptMessageSchema)
    })
    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages')


    // Check user Accept Message status
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            //get request to check accept message status
            const res = await axios.get('/api/accept-message')
            setValue('acceptMessages', res.data.isAcceptingMsg)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to fetch message acceptance status")
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue])

    // Fetching the messages
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const res = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(res.data.messages || []);
            if (refresh) toast.success("You are up to date");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to fetch messages");
        } finally {
            setIsLoading(false);
        }
    }, [setMessages]);


    // Handle for chnage switch status
    const handleSwitchChange = async () => {
        setIsSwitchLoading(true)
        try {
            const res = await axios.post('/api/accept-message', {
                // updating the status in the Database
                acceptMessages: !acceptMessages,
            })
            // also have to update in the UI
            setValue('acceptMessages', !acceptMessages)
            toast.success(res.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to update message acceptance status")
        } finally {
            setIsSwitchLoading(false)
        }
    }


    useEffect(() => {
        if (!session || !session?.user) return
        fetchMessages(),
            fetchAcceptMessage()

    }, [session, setValue, fetchMessages])


    // Copy to clipboard Funtionalities
    const [profileLink, setProfileLink] = useState<string | null>(null);
    const generateProfileLink = () => {
        const domain = window.location.origin;
        setProfileLink(`${domain}/u/${username}`);
    };
    useEffect(() => {
        generateProfileLink();
    }, [username])

    const handleCopy = () => {
        navigator.clipboard.writeText(profileLink as string);
        toast.success("Profile link copied!")
    };

    // Delete Message End Point

    const handleDeleteConfirm = async (messageId: string) => {
        try {
            const res = await axios.delete(`/api/delete-message/${messageId}`);
            toast.success(res.data.message || "Message deleted!");
            // Optionally refresh state:
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Error deleting message");
        }
    };


    // if (!session || !session?.user) {
    //     return <div>Please login to continue</div>
    // }
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            {/* <aside className="w-64 bg-gradient-to-b from-teal-900 to-teal-700 text-white p-6 hidden md:block">
                <div className="flex items-center space-x-2 mb-8">

                </div>
                <nav className="space-y-4">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-teal-200 hover:text-white transition-colors">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                    </Link>


                </nav>
            </aside> */}

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Header */}
                <header className="bg-gradient-to-r from-gray-900 to-teal-800 text-white rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden animate-fade-in">
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <HatGlasses className="h-10 w-10 text-teal-300 animate-pulse" />
                            <h1 className="text-4xl font-extrabold tracking-tight">Welcome, @{username}</h1>
                        </div>
                        <Button
                            variant="outline"
                            onClick={()=>signOut()}
                            className="flex items-center space-x-2 bg-white/10 border-teal-300/50 text-teal-200 hover:bg-teal-500 hover:text-white transition-all duration-300 hover:shadow-lg"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Log Out</span>
                        </Button>
                    </div>
                </header>

                {/* Profile Summary & Controls */}
                <section className="bg-gradient-to-r from-teal-900 to-teal-700 text-white rounded-xl p-8 mb-8 shadow-2xl relative overflow-hidden animate-fade-in">
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left: Profile Info */}
                        <div className="space-y-6">
                            <HatGlasses className="h-16 w-16 text-teal-300 animate-pulse" />
                            <h2 className="text-4xl font-extrabold tracking-tight">Your Feedback Hub</h2>
                            <p className="text-lg opacity-90 max-w-md">
                                Manage your anonymous feedback and share your profile to get more insights.
                            </p>
                        </div>

                        {/* Right: Toggle & Copy URL */}
                        <div className="space-y-6">
                            {/* Toggle Switch */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        {...register('acceptMessages')}
                                        disabled={isSwitchLoading}
                                        checked={acceptMessages}
                                        onCheckedChange={handleSwitchChange}
                                        id="accept-messages"
                                        className="data-[state=checked]:bg-teal-500" />
                                    <label htmlFor="accept-messages" className="text-sm font-medium">
                                        Accept Anonymous Messages
                                    </label>
                                </div>
                                <span className="text-xs text-teal-300/60">Currently:     {acceptMessages ? " On" : " Off"}</span>
                            </div>

                            {/* Copy URL */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                                <label className="text-sm font-medium block mb-2">Share Your Profile</label>
                                <div className="flex space-x-2">
                                    <Input
                                        value={profileLink as string}
                                        readOnly
                                        className="bg-white/5 border-white/30 text-white placeholder-teal-200 rounded-lg"
                                    />
                                    <Button
                                        onClick={handleCopy}
                                        className="bg-teal-500 hover:bg-teal-400 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <Copy className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Received Messages */}
                <section className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Received Messages</h2>

                    <Button
                        variant='ghost'
                        onClick={(e) => {
                            e.preventDefault();
                            fetchMessages(true);
                        }}>
                        <RefreshCw

                            className={`w-5 h-5 cursor-pointer transition-transform ${isLoading ? "animate-spin" : ""
                                }`}
                        />
                    </Button>
                    {messages.length === 0 ? (
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center text-gray-600">
                            <p>No messages yet. Share your profile link to start receiving feedback!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {messages.map((message) => (
                                <div
                                    key={message._id as string}
                                    className="bg-white/10 backdrop-blur-md border border-teal-300/50 rounded-xl p-6 relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
                                >
                                    <Trash2
                                        onClick={() => handleDeleteConfirm(message._id as string)}
                                        className="absolute top-3 right-3 h-5 w-5 text-red-500 cursor-pointer" />
                                    <div className="text-start text-gray-800 font-medium italic leading-relaxed">
                                        "{message.content}"
                                    </div>
                                    <div className="flex justify-start mt-3 text-xs text-gray-400">
                                        {new Date(message.createdAt).toLocaleDateString("en-US", {
                                            weekday: "short",  // "Thu"
                                            day: "2-digit",    // "22"
                                            month: "long",     // "April"
                                            year: "numeric"    // "2025"
                                        })}

                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA: Upgrade or Settings */}
                <section className="bg-gradient-to-r from-teal-900 to-teal-700 text-white rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
                    {/* Subtle overlay for depth */}
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Gem className="w-10 h-10 text-teal-300 animate-pulse" />
                        <h2 className="text-4xl font-extrabold tracking-tight flex justify-center items-center">Premium Features</h2>
                    </div>
                    <p className="text-lg opacity-90 max-w-md mx-auto mb-6">
                        Unlock advanced analytics, custom prompts, and exclusive tools with True Voice Premium.
                    </p>
                    <div className="flex justify-center items-center gap-4">

                        <Button className=" hover:bg-white/15 transition-all duration-300 hover:scale-105 bg-white/10 backdrop-blur-md border border-teal-200/50 text-teal-200 text-sm font-semibold rounded-full shadow-sm animate-pulse px-4 py-1.5">
                            Coming Soon
                            {/* <span className="bg-white/10 backdrop-blur-md border border-teal-200/50 text-teal-200 text-sm font-semibold rounded-full px-2 py-1 shadow-sm animate-pulse">
                               
                            </span> */}
                        </Button>
                    </div>
                </section>
            </main>
        </div >
    );
}