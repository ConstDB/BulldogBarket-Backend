import mongoose from "mongoose";
import { OrderModel } from "../models/order.model";
import { CreateOrder } from "../validations/order";
import { OrderDoc } from "../types/orderDoc";

export interface CreateOrderData extends CreateOrder {
  totalPrice: number;
  buyer: string;
}

export const OrderRepository = {
  findById: async (id: string) => {
    return OrderModel.findById(id);
  },

  create: async (data: CreateOrderData, session: mongoose.ClientSession): Promise<OrderDoc> => {
    const order = new OrderModel({
      listing: data.listingId, 
      buyer: data.buyer,
      quantity: data.quantity,
      totalPrice: data.totalPrice,
      meetupLocation: data.meetupLocation,
      paymentMethod: data.paymentMethod,
    });

    await order.save({ session });
    return order;
  },
};
