import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 chars" })
    .max(300, { message: "Content cannot be longer than 300 chars" }),
});
