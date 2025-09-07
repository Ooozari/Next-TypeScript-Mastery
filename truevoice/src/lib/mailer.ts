
import nodemailer, { Transporter } from "nodemailer";

export const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

