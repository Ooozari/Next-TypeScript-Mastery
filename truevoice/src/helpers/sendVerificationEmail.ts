import { transporter } from "@/lib/mailer";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import { render } from "@react-email/render";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Convert React component → HTML
    const emailHtml = await render(
      VerificationEmail({ username, otp: verifyCode })
    );

    // Send the email
    await transporter.sendMail({
      from: `"True Voice" <${process.env.GMAIL_USER}>`,
      to: email.trim(),
      subject: "TRUE VOICE | Verification Code",
      html: emailHtml,
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Nodemailer Error:", error.message);
      return { success: false, message: error.message };
    }
    console.error("Nodemailer Error:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
