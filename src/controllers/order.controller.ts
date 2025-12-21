import { Request, Response } from "express";
import {
  toBuyerOrdersResponse,
  toOrderResponse,
  toSellerPendingOrdersResponse,
} from "../dto/order.dto";
import { OrderService } from "../services/order.service";
import { asyncHandler } from "../utils/asyncHandlers";
import { BuyerOrdersQuery } from "../validations/order";

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

export const sellerConfirm = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.validatedParams;
  const sellerId = req.user._id.toString();

  const order = await OrderService.sellerConfirm(orderId, sellerId);
  res.status(200).json(toOrderResponse(order));
});

export const getSellerPendingOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const sellerId = req.user._id.toString();
    const pendingOrders = await OrderService.getSellerPendingOrders(sellerId);

    res.status(200).json(toSellerPendingOrdersResponse(pendingOrders));
  }
);

export const getBuyerOrders = asyncHandler(async (req: Request, res: Response) => {
  const buyerId = req.user._id.toString();
  const { status } = req.validatedQuery as BuyerOrdersQuery;

  const orders = await OrderService.getBuyerOrders(buyerId, status);
  res.status(200).json(toBuyerOrdersResponse(orders));
});
