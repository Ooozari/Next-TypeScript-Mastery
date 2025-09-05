"use client";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowRight, ArrowLeft, HatGlasses, Search, EyeOff,Loader2 } from "lucide-react";
import Messages from "../messages.json";
import type { Swiper as SwiperType } from "swiper";
import { searchUserProfileSchema } from '@/schemas/searchUserProfile'
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";



export default function LandingPage() {
    const swiperRef = useRef<SwiperType | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()




    const searchProfileForm = useForm<z.infer<typeof searchUserProfileSchema>>({
        resolver: zodResolver(searchUserProfileSchema),
        defaultValues: {
            params: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof searchUserProfileSchema>) => {
        const searchProfile = data.params
        let username = searchProfile;
        if (searchProfile.includes("/")) {
            // Search param is url like https://domainname.vercel.app/u/username
            // so we have to extract the username form the url to hit it 
            const url = new URL(searchProfile);
            const parts = url.pathname.split("/");
            username = parts[parts.length - 1];
        }
        try {
            setIsSubmitting(true);
            const res = await axios.post('/api/check-user-exist', { username })
            if (res.data.success) {
                router.replace(`/u/${username}`)
            } else {
                toast.error(res.data.message)
            }
            

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMsg = axiosError.response?.data.message || "Unable to check if the user exists.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero */}
            <section className="min-h-[100vh] bg-gradient-to-b from-gray-800 to-teal-900 text-white flex items-center justify-center">
                <div className="text-center space-y-6 px-6 md:px-0">
                    <h1 className="text-3xl md:text-4xl xl:text-6xl font-extrabold">
                        Speak Freely, Grow Together
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto">
                        True Voice lets you send and receive anonymous feedback from friends, colleagues, or anyone—no judgments, just insights.
                    </p>
                    <div className="space-x-4 flex justify-center">
                        <Link href="/sign-up">
                            <Button variant="default" className="bg-teal-500 hover:bg-teal-600">Sign Up Free</Button>
                        </Link>
                        <Link href="#quick-send">
                            <Button
                                variant="outline"
                                className="text-teal-500 border-teal-500 hover:bg-teal-500 hover:text-white group flex gap-1 items-center"
                            >
                                <span>Start Sending Now</span>
                                <ArrowRight
                                    className="w-5 h-5 flex items-center"
                                />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto text-center px-6">
                    <h2 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">
                        See What Anonymous Feedback Looks Like
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Browse sample messages to get inspired. Real feedback, zero filters.
                    </p>
                    <div className="flex justify-end items-center mb-8">
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                className="swiper-button-prev !text-gray-700 hover:!text-teal-600"
                            >
                                <ArrowLeft />
                            </Button>
                            <Button
                                variant="ghost"
                                className="swiper-button-next !text-gray-700 hover:!text-teal-600"
                            >
                                <ArrowRight />
                            </Button>
                        </div>
                    </div>
                    <div className="relative w-full">
                        <Swiper
                            modules={[Navigation, Keyboard, Autoplay]}
                            spaceBetween={30}
                            centeredSlides={true}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            loop={true}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            onSlideChange={(swiper) => setCurrentSlideIndex(swiper.realIndex)}
                            navigation={{
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                            }}
                            keyboard={{ enabled: true, onlyInViewport: true }}
                        >
                            {Messages.map((message, index) => (
                                <SwiperSlide
                                    key={index}
                                    className={`flex justify-center items-center py-5 transition-transform duration-300 
                                ${currentSlideIndex === index ? "scale-100 z-10" : "scale-95 opacity-80"}`}
                                >
                                    <div
                                        className={`${currentSlideIndex === index
                                            ? "bg-white/10 backdrop-blur-md border-2 border-teal-300/50 shadow-sm"
                                            : "bg-white/5 backdrop-blur-sm border border-teal-900/30 shadow-sm"
                                            } rounded-xl p-6 w-full max-w-sm relative overflow-hidden transition-all duration-300  hover:scale-105 animate-fade-in`}
                                    >
                                        {/* Username */}
                                        <div className="flex justify-end font-semibold text-sm text-teal-200 mb-2">
                                            {message.username}
                                        </div>

                                        {/* Message Content */}
                                        <div className={`text-start line-clamp-3  ${currentSlideIndex === index ? 'text-black' : 'text-gray-600'} font-medium italic leading-relaxed`}>
                                            "{message.content}"
                                        </div>

                                        {/* Timestamp */}
                                        <div className="flex justify-start mt-3 text-xs text-teal-300/60">
                                            {message.received}
                                        </div>

                                        {/* Subtle Gradient Overlay for Depth */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent pointer-events-none"></div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <Button asChild className="mt-8 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg">
                        <Link href="/sign-up">Ready to Receive Yours? Sign Up</Link>
                    </Button>
                </div>
            </section>

            {/* Quick Send */}
            <section id="quick-send" className="py-20 bg-gradient-to-r from-teal-900 to-teal-700 text-white overflow-hidden relative">
                {/* Overlay for premium subtle texture */}
                <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <div className="space-y-6">
                            <h2 className="text-5xl font-extrabold tracking-tight leading-tight">
                                Send Anonymous Feedback Now
                            </h2>
                            <p className="text-lg opacity-90 max-w-md">
                                Effortlessly share honest insights by entering a username or profile URL. Stay disguised, speak freely, and foster meaningful growth.
                            </p>
                            <p className="text-sm opacity-80">
                                Want your own feedback page?{' '}
                                <Link href="/sign-up" className="text-teal-300 font-medium hover:text-white transition-colors">
                                    Create a Profile
                                </Link>
                            </p>
                        </div>

                        {/* Right: Form */}
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
                            <div className="flex justify-center">
                                {/* Thematic Icon */}
                                <HatGlasses className="h-20 w-20 text-teal-300 mb-4 animate-fade-in" />
                            </div>
                            <Form {...searchProfileForm}>
                                <form onSubmit={searchProfileForm.handleSubmit(onSubmit)} className="space-y-6">

                                    <FormField
                                        control={searchProfileForm.control}
                                        name="params"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-300" />
                                                        <Input
                                                            {...field}
                                                            placeholder="Enter username or URL"
                                                            className="pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/30 text-white placeholder-teal-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 shadow-sm transition-all duration-300 hover:shadow-md"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className='animate-spin mr-2' /> <span>Verifying...</span>
                                            </>
                                        ) : "Go to Profile"}

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
