import { transporter } from "@/lib/mailer";
import { ApiResponse } from "@/types/ApiResponse";
import SendResetLink from "emails/SendResetLink";
import { render } from "@react-email/render";

export async function sendResetLink(
  email: string,
  resetUrl: string,
): Promise<ApiResponse> {
  try {
    // Convert React component → HTML
    const emailHtml = await render(
      SendResetLink({ email, resetUrl })
    );

    // Send the email
    await transporter.sendMail({
      from: `"True Voice" <${process.env.GMAIL_USER}>`,
      to: email.trim(),
      subject: "Reset Your TRUE VOICE Password",
      html: emailHtml,
    });

    return { success: true, message: "Password reset link sent!" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Nodemailer Error:", error.message);
      return { success: false, message: error.message };
    }
    console.error("Nodemailer Error:", error);
    return { success: false, message: "Failed to send password reset link" };
  }
}
