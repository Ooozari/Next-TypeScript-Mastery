import { z } from "zod";

export const SignInSchema = z.object({
  identifier: z.string().min(1, "Email/Username is required"),
  password: z.string().min(6, "Password is required"),
});
