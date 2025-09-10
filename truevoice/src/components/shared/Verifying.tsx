"use client";
import { GridLoader } from "react-spinners";


export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-teal-900/70 flex justify-center items-center relative">
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
      <GridLoader color="#14b8a6" size={24} />
    </div>
  );
}
