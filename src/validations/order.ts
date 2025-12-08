import { z } from "zod";

export const createOrderSchema = z.object({
  listingId: z.string().min(1),
  quantity: z.int().min(1),
  meetupLocation: z.string().min(1),
  paymentMethod: z.enum(["GCash", "Cash on Meetup"]),
});

export type CreateOrder = z.infer<typeof createOrderSchema>;
