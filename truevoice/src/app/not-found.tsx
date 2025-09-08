import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HatGlasses } from "lucide-react";
import { Heading, Paragraph } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-teal-900/70 flex justify-center items-center relative py-10 px-4">
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
      <div className="w-full max-w-md p-6 md:p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-teal-300/50">
        <div className="text-center space-y-4">
          <HatGlasses className="h-12 w-12 text-teal-300 animate-pulse mx-auto" />
          <Heading level="sectionheadinglarge" className="font-extrabold tracking-tight text-white">
            404 - Page Not Found
          </Heading>
          <Paragraph size="xl" className="text-teal-100 opacity-90 max-w-sm mx-auto">
            Oops! The page you’re looking for doesn’t exist. Let’s get you back to True Voice.
          </Paragraph>
        </div>
        <div className="flex justify-center">
          <Button
            asChild
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}