import { z } from "zod";

export const createOrderSchema = z.object({
  listingId: z.string().min(1),
  quantity: z.int().min(1),
  meetupLocation: z.string().min(1),
  paymentMethod: z.enum(["GCash", "Cash on Meetup"]),
});

export const orderIdParamsSchema = z.object({
  orderId: z.string().min(1, "Order ID is required."),
});

export const cancelReasonBodySchema = z.object({
  cancelReason: z
    .string()
    .min(1, "Cancel reason is required.")
    .max(100, "Cancel reason cannot exceed 100 characters."),
});

export const buyerOrdersQuerySchema = z.object({
  status: z.enum(["pending", "completed", "cancelled"]),
});

export type BuyerOrdersQuery = z.infer<typeof buyerOrdersQuerySchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
