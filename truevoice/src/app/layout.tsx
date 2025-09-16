import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";

// Poppins setup
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], 
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Add all SEO + verification here
export const metadata: Metadata = {
  title: "True Voice - Anonymous Feedback Platform",
  description:
    "Send and receive honest, anonymous feedback with True Voice. Unlock insights from friends and colleagues in a premium, secure environment.",
  icons: {
    icon: "/favicon.svg",
  },
  verification: {
    google: "f178e0132eb12869", // ✅ Google Search Console
  },
  openGraph: {
    title: "True Voice - Anonymous Feedback Platform",
    description:
      "Send and receive honest, anonymous feedback with True Voice. Unlock insights from friends and colleagues in a premium, secure environment.",
    url: "https://truevoicehub.vercel.app/",
    siteName: "True Voice",
    images: [
      {
        url: "https://truevoicehub.vercel.app/preview.png", // put preview image in /public
        width: 1200,
        height: 630,
        alt: "True Voice Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "True Voice - Anonymous Feedback Platform",
    description:
      "Send and receive honest, anonymous feedback with True Voice. Unlock insights from friends and colleagues in a premium, secure environment.",
    images: ["https://truevoicehub.vercel.app/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${poppins.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </body>
      </AuthProvider>
    </html>
  );
}
