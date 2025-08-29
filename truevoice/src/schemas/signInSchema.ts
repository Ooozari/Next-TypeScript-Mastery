import { z } from "zod";

export const SignInSchema = z.object({
// identifier refers to email
  indentifier: z.string(),
  passoword: z.string(),
});
