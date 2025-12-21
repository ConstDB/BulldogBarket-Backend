import z from "zod";


export const createSavedListingSchema = z.object({
    listingId: z.string().min(1),
});

export type CreateSavedListing = z.infer<typeof createSavedListingSchema>;