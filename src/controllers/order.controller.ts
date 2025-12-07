import { Request, Response } from "express";
import { createOrderService } from "../services/order.service";
import { asyncHandler } from "../utils/asyncHandlers";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const buyerId = req.user._id;
  const { listingId, quantity, meetupLocation, paymentMethod } = req.body;

  const order = await createOrderService({
    buyerId: buyerId.toString(),
    listingId,
    quantity,
    meetupLocation,
    paymentMethod,
  });

  res.status(201).json(order);
});
