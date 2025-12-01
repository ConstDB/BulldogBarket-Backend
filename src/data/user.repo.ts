import { UserModel } from "../models/user.model";
import { UserDoc } from "../types/userDoc";
import { UserSignup } from "../validations/user";

export const UserRepository = {
  create: async (data: UserSignup): Promise<UserDoc> => {
    const { name, studentNumber, course, campus, yearLevel, password } = data;
    const user = await UserModel.create({ name, studentNumber, course, campus, yearLevel, password });

    return user;
  },
};
