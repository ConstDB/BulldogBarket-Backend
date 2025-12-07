import { Types } from "mongoose";
import { UserModel } from "../models/user.model";
import { UserDoc } from "../types/userDoc";
import { updateUserProfile, UserSignup } from "../validations/user";

export const UserRepository = {
  create: async (data: UserSignup): Promise<UserDoc> => {
    const { name, studentNumber, course, campus, yearLevel, password } = data;
    const user = await UserModel.create({ name, studentNumber, course, campus, yearLevel, password });

    return user;
  },

  findById: async (_id: Types.ObjectId): Promise<UserDoc | null> =>{
    return UserModel.findOne({_id});
  }, 

  update: async (id: Types.ObjectId, data: updateUserProfile): Promise<UserDoc | null> => {
    return UserModel.findByIdAndUpdate(id, data, {new: true, runValidators: true})
  },

  findOne: async (studentNumber: string): Promise<UserDoc | null> => {
    return UserModel.findOne({ studentNumber }).select("+password").lean();
  },
};
