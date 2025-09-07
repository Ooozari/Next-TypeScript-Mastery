
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
    // Convert React component → HTML (await required)
    const emailHtml = await render(
      VerificationEmail({ username, otp: verifyCode })
    );

    const mailOptions = {
      from: `"True Voice" <${process.env.GMAIL_USER}>`,
      to: String(email).trim(),
      subject: "TRUE VOICE | Verification Code",
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);

  
    return { success: true, message: "Verification email sent successfully" };
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}

