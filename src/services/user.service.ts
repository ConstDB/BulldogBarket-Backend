import { Types } from "mongoose"
import { UserRepository } from "../data/user.repo"

export const getUserProfileService = async (id: Types.ObjectId) =>{
    const user = await UserRepository.findById(id);
    return user;
}