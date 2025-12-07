import { OrderModel } from "../models/order.model";
import { CreateOrder } from "../validations/order";

export interface CreateOrderData extends CreateOrder {
  totalPrice: number;
  buyer: string;
}

export const OrderRepository = {
  findById: async (id: string) => {
    return OrderModel.findById(id);
  },

  create: async (data: CreateOrderData, session?: any) => {
    return OrderModel.create([{ ...data, listing: data.listingId }], { session });
  },
};
