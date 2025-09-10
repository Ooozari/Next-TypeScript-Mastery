import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendResetLink } from "@/helpers/SendResetLink";
import crypto from "crypto";
import { ResetToken } from "@/models/ResetToken";

// Send email + store the reset token in the DB
export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email } = await req.json();
    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No account found with this email",
        },
        {
          status: 404,
        }
      );
    }

    const userId = user._id;

    // ** Step 1: creating the token and reset Url
    const token = crypto.randomBytes(32).toString("hex"); // return like "9f6c7b3d91c2e0d7f...4a8c3f"

    // prevent multiple active token
    const existingToken = await ResetToken.findOne({ userId });
    if (existingToken) {
      return Response.json(
        {
          success: false,
          message: "Password reset link has already been sent to your email.",
        },
        {
          status: 409,
        }
      );
    }

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&id=${userId}`;
    // we have to pass "https://yourdomain.com/reset-password?token=XYZ"
    await sendResetLink(email, resetUrl);

    // ** Step 2: Storing Hashedtoken in the DB collection
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const newToken = {
      userId: userId,
      token: hashedToken,
      expiry: new Date(Date.now() + 30 * 60 * 1000),
    };
    await ResetToken.create(newToken);

    return Response.json(
      {
        success: true,
        message: "Password reset link has been sent to your email.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to send password reset link", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send password reset link",
      },
      { status: 500 }
    );
  }
}
