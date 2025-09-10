import { z } from "zod";

// Define the schema for the email field
export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});