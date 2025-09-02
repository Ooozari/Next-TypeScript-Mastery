import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendverificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
    console.log("Failed to send verification email to:", email);
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',  // keep this domain for testing
      to: String(email).trim(),
      subject: "TRUE VOICE | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, message: "Failed to send verification email" };
    }
            

    console.log("Resend Success:", data);
    return { success: true, message: "Verification email sent successfully" };
  } catch (err) {
    console.error("Unexpected Error:", err);
    return { success: false, message: "Server error sending verification email" };
  }
}
