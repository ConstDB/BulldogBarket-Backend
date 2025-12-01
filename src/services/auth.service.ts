import { UserRepository } from "../data/user.repo";
import { UserSignup } from "../validations/user";

export const signupUser = async (data: UserSignup) => {
  return UserRepository.create(data);
};
