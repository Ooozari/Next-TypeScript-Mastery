"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import toast from "react-hot-toast";
import { HatGlasses, Menu, X } from "lucide-react";

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    const [openMobileMenu, setOpenMobileMenu] = useState(false);

    const handleOpenMobileMenu = () => {
        setOpenMobileMenu(!openMobileMenu);
    };

    return (
        <>
            <div className="fixed top-2 flex justify-center items-center mx-2 w-full z-50">
                <div className="relative flex justify-center items-center md:max-w-xl w-full flex-col">
                    <nav
                        className={`flex md:max-w-xl w-full justify-between bg-gradient-to-b from-teal-900 to-teal-700 text-white py-3 px-5 md:py-5 md:px-10 ${
                            openMobileMenu ? "rounded-t-4xl" : "rounded-4xl"
                        } items-center shadow-lg`}
                    >
                        <div className="text-2xl font-bold">
                            <Link href="/" className="flex gap-2 items-center">
                                <HatGlasses className="h-8 w-8 text-teal-300 animate-pulse" />
                                <h1 className="text-2xl font-bold">True Voice</h1>
                            </Link>
                        </div>

                        <div className="md:flex hidden items-center gap-4">
                            <Link href="/" className="text-teal-200 font-medium hover:text-white transition-colors">
                                Home
                            </Link>
                            {session && (
                                <Link href="/dashboard" className="text-teal-200 font-medium hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                            )}
                            
                            <div>
                                {session ? (
                                    <Button
                                        onClick={() => {
                                            signOut();
                                            toast.loading("Logging out");
                                        }}
                                        className="bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        Logout
                                    </Button>
                                ) : (
                                    <Link href="/sign-in">
                                        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            Login
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="flex md:hidden">
                            <button onClick={handleOpenMobileMenu}>
                                {openMobileMenu ? (
                                    <X className="h-6 w-6 text-teal-200" />
                                ) : (
                                    <Menu className="h-6 w-6 text-teal-200" />
                                )}
                            </button>
                        </div>
                    </nav>
                    <div
                        className={`bg-gradient-to-t from-gray-900 to-teal-800 text-white px-5 py-5 absolute top-full left-0 rounded-b-4xl w-full shadow-lg border-b border-teal-300/20
                        overflow-hidden transform transition-all duration-500 ease-in-out
                        ${openMobileMenu ? "opacity-100 scale-y-100 max-h-60" : "opacity-0 scale-y-0 max-h-0 origin-top"}`}
                    >
                        <div className="flex flex-col gap-5 items-center">
                            <Link href="/" className="text-teal-200 font-medium hover:text-white transition-colors">
                                Home
                            </Link>
                            {session && (
                                <Link href="/dashboard" className="text-teal-200 font-medium hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                            )}
                            <div>
                                {session ? (
                                    <span className="text-teal-200 font-medium">Hello, @{user?.username}</span>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div>
                                {session ? (
                                    <Button
                                        onClick={() => {
                                            signOut();
                                            toast.loading("Logging out");
                                        }}
                                        className="bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        Logout
                                    </Button>
                                ) : (
                                    <Link href="/sign-in">
                                        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                                            Login
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;