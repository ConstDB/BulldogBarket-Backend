import { Types } from "mongoose"
import { UserRepository } from "../data/user.repo"
import { updateUserProfile } from "../validations/user";
import { toUserProfileResponse } from "../dto/user.dto";

export const getUserProfileService = async (id: Types.ObjectId) =>{
    const user = await UserRepository.findById(id);
    return toUserProfileResponse(user!);
}

export const updateUserProfileService = async (id: Types.ObjectId, data: updateUserProfile) => {
    const user = await UserRepository.update(id, data);
    return toUserProfileResponse(user!);
}