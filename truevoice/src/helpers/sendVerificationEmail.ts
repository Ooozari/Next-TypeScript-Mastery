// RESEND API URL
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { error } from "console";

// Email Template + Send email


export async function sendverificationEmail(
    email: string,
    username: string,
    verifyCode: string,

): Promise<ApiResponse> {



    try {
        // Sending email
            await resend.emails.send({
            from: 'True Voice <onboarding@resend.dev>',
            to: email,
            subject: "TRUE VOICE | Verification Code",
            react: VerificationEmail({username, otp: verifyCode}),
        });
        return {
            success: true,
            message: "Verification email sent successfully"
        }
    } catch (emailError) {
        console.error("Error sending verfication email", emailError)
        return {
            success: false,
            message: "Failed to send verification email"
        }

    }
}