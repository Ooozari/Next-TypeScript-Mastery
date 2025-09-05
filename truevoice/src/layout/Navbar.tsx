'use client';
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '../components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth'
import toast from "react-hot-toast";
import { Menu, X } from 'lucide-react';
function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user as User
    const [openMobileMenu, setOpenMobileMenu] = useState(false)

    const handleOpenMobileMenu = () => {
        setOpenMobileMenu(!openMobileMenu)
    }

    return (
        <>
            <div className='fixed top-2 flex justify-center items-center mx-2 w-full z-90'>
                <div className='relative flex justify-center items-center md:max-w-xl w-full  flex-col'>
                    <nav className={`flex md:max-w-xl w-full justify-between bg-gray-100 py-3 px-5 md:py-5 md:px-10  ${openMobileMenu ? 'rounded-t-4xl ' : 'rounded-4xl '} items-center`}>
                        <div className='text-2xl font-bold text-teal-500'>
                            <Link href='/'>True Voice</Link>
                        </div>

                        <div className='md:flex hidden items-center gap-2 '>
                            <div className=''>
                                {
                                    session ?
                                        (<span>{user?.username}</span>) : ""
                                }
                            </div>
                            <div>
                                {session ? (<Button onClick={() => {
                                    signOut()
                                    toast.loading('Logging out');
                                }}>
                                    Logout
                                </Button>) : (
                                    <Link href='/sign-in'>
                                        <Button>
                                            Login
                                        </Button>
                                    </Link>
                                )}

                            </div>
                        </div>

                        <div className='flex md:hidden '>
                            <button onClick={handleOpenMobileMenu}>
                                {openMobileMenu ? <X /> : <Menu />}
                            </button>
                        </div>
                    </nav >
                    <div
                        className={`bg-gray-100 px-5 py-5 absolute top-full left-0 rounded-b-4xl w-full shadow-lg border-b
                        overflow-hidden transform transition-all duration-500 ease-in-out
                        ${openMobileMenu ? 'opacity-100 scale-y-100 max-h-40' : 'opacity-0 scale-y-0 max-h-0 origin-top'}`}
                    >
                        <div className='flex flex-col gap-5 items-center'>
                            <div>{session ? (<span>Hello, {user?.username}</span>) : ""}</div>
                            <div>
                                {session ? (
                                    <Button onClick={() => { signOut(); toast.loading('Logging out'); }}>
                                        Logout
                                    </Button>
                                ) : (
                                    <Link href='/sign-in'>
                                        <Button>Login</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>



                </div>
            </div>


        </>
    )
}

export default Navbar
