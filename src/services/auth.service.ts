import { UserRepository } from "../data/user.repo";
import { signToken } from "../utils/jwt";
import { UserSignup } from "../validations/user";

export const signupUser = async (data: UserSignup) => {
  const user = await UserRepository.create(data);
  const token = signToken(user._id.toString());

  return { user, token };
};
