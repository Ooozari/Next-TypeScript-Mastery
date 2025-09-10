import dbConnect from "@/lib/dbConnect";
import { ResetToken } from "@/models/ResetToken";

import crypto from "crypto";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { token, userId } = await request.json();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await ResetToken.findOne({ userId, token: hashedToken });

    // Step1: Does the token with user id exist?
    if (!resetToken) {
      return Response.json(
        {
          success: false,
          message:
            "This password reset link is invalid or has already been used. Please request a new one to continue.",
        },
        {
          status: 410,
        }
      );
    }

    // Somehow the token has been expired
    if (resetToken.expiry < new Date()) {
      return Response.json(
        { success: false, message: "This password reset link has expired. Please request a new one to reset your password." },
        { status: 410 }
      );
    }

    // * If token is Validated then
   
    return Response.json(
      {
        success: true,
        message: "This password reset link is valid. You may now set a new password.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to validate reset link:", error);
    return Response.json(
      { success: false, message: "An unexpected error occurred while validating the reset link. Please try again later." },
      { status: 500 }
    );
  }
}
