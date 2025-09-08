import Link from 'next/link'
import { Heading, Paragraph } from "@/components/ui/typography";

export default function Footer() {
    return (
        <>
            {/* Footer */}

            <footer className="py-8 bg-gradient-to-b from-gray-900 to-teal-900/70 text-white text-center">
            <div className=" container mx-auto">
                <Heading level="sectionheading" className="font-bold mb-4 px-5">Ready to Hear Your Truth?</Heading>

               <Paragraph size="normal">
                    <Link href="/" className="text-gray-300 hover:text-white mx-2">Privacy Policy</Link>
                    <Link href="/" className="text-gray-300 hover:text-white mx-2">Terms</Link>
                    <Link href="/" className="text-gray-300 hover:text-white mx-2">Contact</Link>
              </Paragraph>

                <Paragraph size="large" className="text-gray-400 mt-4">© 2025 True Voice. All rights reserved.</Paragraph>
                 </div>
            </footer>
            </>
    )
}

