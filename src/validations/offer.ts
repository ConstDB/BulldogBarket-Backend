import { z } from "zod";

export const createOfferSchema = z.object({
  listingId: z.string().min(1),
  meetupLocation: z.string().min(1),
  buyerNote: z.string().min(1),
});

export type CreateOffer = z.infer<typeof createOfferSchema>;
