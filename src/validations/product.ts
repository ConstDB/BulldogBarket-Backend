import {z} from "zod";


export const createProductSchema = z.object({
    sellerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid sellerId"),
    name: z.string().min(1, "Name is required."),
    stocks: z.number().int().min(0, "Stocks must be 0 or greater."),
    category: z.string(),
    type: z.enum(["single","bulk"]),
    price: z.number().min(0, "Price must be 0 or greater."),
    condition: z.string().min(1, "Condition is required."),
    description: z.string().min(1, "Description is required."),
    images: z.array(z.url("Each image must be a valid URL.")).min(1, "At least one image is required.").max(5, "Photo limit exceeded. Maximum allowed is 5 photos.")
});

export type CreateProductDto = z.infer<typeof createProductSchema>;