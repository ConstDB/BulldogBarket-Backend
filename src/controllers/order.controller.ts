import { Request, Response } from "express";
import { toOrderResponse } from "../dto/order.dto";
import { OrderService } from "../services/order.service";
import { asyncHandler } from "../utils/asyncHandlers";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const buyerId = req.user._id;
  const { listingId, quantity, meetupLocation, paymentMethod } = req.body;

  const order = await OrderService.createOrder({
    buyerId: buyerId.toString(),
    listingId,
    quantity,
    meetupLocation,
    paymentMethod,
  });

  res.status(201).json(toOrderResponse(order));
});

export const buyerCancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.validatedParams;
  const buyerId = req.user._id.toString();

  const order = await OrderService.buyerCancelOrder(orderId, buyerId);
  res.status(200).json(toOrderResponse(order));
});

export const sellerCancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.validatedParams;
  const { cancelReason } = req.body;
  const sellerId = req.user._id.toString();

  const order = await OrderService.sellerCancelOrder(orderId, sellerId, cancelReason);
  res.status(200).json(toOrderResponse(order));
});

export const buyerConfirm = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.validatedParams;
  const buyerId = req.user._id.toString();

  const order = await OrderService.buyerConfirm(orderId, buyerId);
  res.status(200).json(toOrderResponse(order));
});
