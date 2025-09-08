"use client";

import { BeatLoader } from "react-spinners";
import { Paragraph } from "@/components/ui/typography";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-teal-900/70 flex justify-center items-center relative">
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
      <Paragraph size='xxl' className=" font-semibold">
        <BeatLoader color="#14b8a6" size={40} />
      </Paragraph>
    </div>
  );
}
