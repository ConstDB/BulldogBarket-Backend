import { OrderDoc } from "../types/orderDoc";

export const toOrderResponse = (order: OrderDoc | Partial<OrderDoc>) => {
  return {
    id: order._id,
    listing: order.listing?._id,
    buyer: order.buyer?._id,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    meetupLocation: order.meetupLocation,
    paymentMethod: order.paymentMethod,
    status: order.status,
    sellerConfirmed: order.sellerConfirmed,
    buyerConfirmed: order.buyerConfirmed,
    cancelReason: order.cancelReason ?? null,
    settledAt: order.settledAt ?? null,
  };
};

export const toSellerPendingOrdersResponse = (orders: any[]) => {
  return orders.map((order) => ({
    id: order._id,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    paymentMethod: order.paymentMethod,
    listing: {
      id: order.listing._id,
      name: order.listing.name,
    },
    buyer: {
      id: order.buyer._id,
      name: order.buyer.name,
      avatarUrl: order.buyer.avatarUrl,
    },
  }));
};
