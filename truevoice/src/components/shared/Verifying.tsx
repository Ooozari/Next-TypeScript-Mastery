"use client";
import {  PropagateLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-teal-900/70 flex justify-center items-center relative">
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none"></div>
      <div className="flex items-center">
        <PropagateLoader color="#ffffff" size={30} />
      </div>
    </div>
  );
}
