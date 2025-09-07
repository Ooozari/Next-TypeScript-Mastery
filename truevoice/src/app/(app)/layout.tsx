'use client';
import { Footer, Navbar } from '@/layout'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Navbar />}
      {children}
      <Footer />
    </div>
  )
}
