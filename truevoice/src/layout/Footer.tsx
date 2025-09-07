import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <>
            {/* Footer */}
            <footer className="py-8 bg-gradient-to-b from-gray-900 to-teal-800 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Hear Your Truth?</h2>
                <div className="space-x-4 mb-4">
                    <Button asChild>
                        <Link href="/sign-up" className="bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                            Sign Up
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/sign-in" className="text-teal-200 border-teal-300/50 hover:bg-teal-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg">
                            Log In
                        </Link>
                    </Button>
                </div>
                <div className="text-sm">
                    <Link href="/privacy" className="text-gray-300 hover:text-white mx-2">Privacy Policy</Link>
                    <Link href="/terms" className="text-gray-300 hover:text-white mx-2">Terms</Link>
                    <Link href="/contact" className="text-gray-300 hover:text-white mx-2">Contact</Link>
                </div>
                <p className="mt-4 text-gray-400">© 2025 True Voice. All rights reserved.</p>
            </footer></>
    )
}

