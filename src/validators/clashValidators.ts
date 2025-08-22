import { z } from "zod";

export const clashSchema = z.object({
  title: z
    .string()
    .nonempty({ message: "Title is required." })
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Title must be at most 100 characters." })
    .trim(),

  description: z
    .string()
    .max(500, { message: "Description must be at most 200 characters." })
    .optional(),

  expire_at: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date({message: "Invalid date."}).refine( d => d > new Date(), { message: "Expire date must be in the future." } )
  ),
});
