import { z } from "zod";

const baseListingSchema = {
  name: z.string({ error: "Name is required." }).min(1, "Name can't be empty.").max(100, "Name is too long."),
  images: z.array(z.url("Invalid image URL.")).min(1, "You need at least one image.").max(5, "Maximum of 5 images allowed."),
  price: z.number({ error: "Price is required." }).min(0, "Price can't be negative."),
  category: z.string({ error: "Category is required." }).min(1, "Category can't be empty.").max(50, "Category is too long."),
  description: z
    .string({ error: "Description is required." })
    .min(1, "Description can't be empty.")
    .max(1000, "Description is too long."),
};

export const singleListingSchema = z
  .object({
    type: z.literal("single"),
    condition: z.string().min(1),
    ...baseListingSchema,
  })
  .strict();

export const bulkListingSchema = z
  .object({
    type: z.literal("bulk"),
    stocks: z.number({ error: "Stocks are required." }).int("Stocks must be an integer.").min(0, "Stocks can't be negative."),
    ...baseListingSchema,
  })
  .strict();

export const createListingSchema = z.discriminatedUnion("type", [singleListingSchema, bulkListingSchema]);

export type SingleListing = z.infer<typeof singleListingSchema>;
export type BulkListing = z.infer<typeof bulkListingSchema>;
export type CreateListing = z.infer<typeof createListingSchema>;
