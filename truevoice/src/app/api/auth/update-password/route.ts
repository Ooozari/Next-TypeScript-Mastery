import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { ResetToken } from "@/models/ResetToken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function PUT(request: Request) {
  await dbConnect();
  try {
    const { token, userId, newPassword } = await request.json();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await ResetToken.findOne({ userId, token: hashedToken });

    // Step1: Does the token with user id exist?
    if (!resetToken) {
      return Response.json(
        {
          success: false,
          message:
            "Your reset link has expired. Please request a new one to continue.",
        },
        {
          status: 410,
        }
      );
    }

    // Somehow the token has been expired
    if (resetToken.expiry < new Date()) {
      return Response.json(
        { success: false, message: "Reset link has expired" },
        { status: 410 }
      );
    }

    // Step2: If token is Validated then
    // hashed the user newPassword
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update it in the DB
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    // validate if user was actually updated
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found or update failed" },
        { status: 404 }
      );
    }

    // Delete the token after use
    await ResetToken.deleteOne({ _id: resetToken._id });
    // return the succcess status
    return Response.json(
      {
        success: true,
        message: "Your password has been reset successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to reset password", error);
    return Response.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
