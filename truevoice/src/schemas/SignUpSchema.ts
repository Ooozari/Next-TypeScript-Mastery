import { z } from "zod";

// Username validation
export const UsernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username can contain a maximum of 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username cannot contain special characters");

// Sign-up form validation schema
export const SignUpValidation = z.object({
  username: UsernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});
