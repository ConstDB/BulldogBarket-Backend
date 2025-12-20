import { Types } from "mongoose";
import { UserRepository } from "../data/user.repo";
import { updateUserProfile } from "../validations/user";
import { toUserProfileResponse } from "../dto/user.dto";
import { NotFoundError } from "../utils/appError";
import { OrderRepository } from "../data/order.repo";

export const UserService = {
  getProfile: async (id: Types.ObjectId) => {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError();
    }
    return toUserProfileResponse(user);
  },

  updateProfile: async (id: Types.ObjectId, data: updateUserProfile) => {
    const user = await UserRepository.update(id, data);
    if (!user) {
      throw new NotFoundError();
    }
    return toUserProfileResponse(user);
  },

  getSellerDashboardSummary: async (userId: string) => {
    const user = await UserRepository.findById(new Types.ObjectId(userId));

    if (!user) {
      throw new NotFoundError("User not Found");
    }

    const totalPendingOrders = await OrderRepository.getTotalPendingOrders(userId);

    return {
      totalEarnings: user.totalEarnings,
      itemsSold: user.itemsSold,
      toMeetup: totalPendingOrders,
      rating: user.rating,
    };
  },
};
