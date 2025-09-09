// helpers/getClientIP.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";

export  function getClientIp(req: Request): string {
  // Check X-Forwarded-For header (proxies / CDNs)
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    if (ip) return ip;
  }

  // Check X-Real-IP header
  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) return realIp.trim();

  // If no IP found, throw an API error
  const error: ApiResponse = {
    success: false,
    message: "Unable to determine client IP.",
  };
  throw error;
}
