import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <>
            {/* Footer */}
            <footer className="py-8 bg-gradient-to-b from-gray-900 to-teal-900/70 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Hear Your Truth?</h2>
               
                <div className="text-sm">
                    <Link href="/privacy" className="text-gray-300 hover:text-white mx-2">Privacy Policy</Link>
                    <Link href="/terms" className="text-gray-300 hover:text-white mx-2">Terms</Link>
                    <Link href="/contact" className="text-gray-300 hover:text-white mx-2">Contact</Link>
                </div>
                <p className="mt-4 text-gray-400">© 2025 True Voice. All rights reserved.</p>
            </footer></>
    )
}

