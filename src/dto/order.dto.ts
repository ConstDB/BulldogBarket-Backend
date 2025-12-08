import { OrderDoc } from "../types/orderDoc";

export const toOrderResponse = (order: OrderDoc | Partial<OrderDoc>) => {
  const { listing, buyer, quantity, totalPrice, meetupLocation, paymentMethod, status, sellerConfirmed, buyerConfirmed } = order;
  return { listing, buyer, quantity, totalPrice, meetupLocation, paymentMethod, status, sellerConfirmed, buyerConfirmed };
};
