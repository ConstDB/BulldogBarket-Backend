import { Types } from "mongoose";
import { OrderRepository } from "../data/order.repo";
import { UserRepository } from "../data/user.repo";
import { NotFoundError } from "../utils/appError";
import { updateUserProfile } from "../validations/user";

export const UserService = {
  getProfile: async (id: Types.ObjectId) => {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError();
    }
    return user;
  },

  updateProfile: async (id: Types.ObjectId, data: updateUserProfile) => {
    const user = await UserRepository.update(id, data);
    if (!user) {
      throw new NotFoundError();
    }

    return user;
  },

  getSellerDashboardSummary: async (sellerId: string) => {
    const seller = await UserRepository.findById(new Types.ObjectId(sellerId));

    if (!seller) {
      throw new NotFoundError("Seller not found.");
    }

    const totalPendingOrders = await OrderRepository.getTotalPendingOrders(sellerId);

    return {
      totalEarnings: seller.totalEarnings,
      itemsSold: seller.itemsSold,
      toMeetup: totalPendingOrders,
      rating: seller.rating,
    };
  },
};
