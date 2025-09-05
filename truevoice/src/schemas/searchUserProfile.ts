import { z } from "zod";

export const searchUserProfileSchema = z.object({
  params: z.string().min(1, "Username/URL is required"),
});
