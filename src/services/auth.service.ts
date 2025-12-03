import { UserRepository } from "../data/user.repo";
import { toUserReponse } from "../dto/user.dto";
import { signToken } from "../utils/jwt";
import { UserLogin, UserSignup } from "../validations/user";
import bcrypt from "bcryptjs";

export const signupUser = async (data: UserSignup) => {
  const user = await UserRepository.create(data);
  const token = signToken(user._id.toString());

  return { user, token };
};

export const loginUser = async (data: UserLogin) => {
  const { studentNumber, password } = data;

  const user = await UserRepository.findOne(studentNumber);

  if (!user || !user.password) {
    // TODO: Change this to the global UnauthorizedError adter merge
    throw new Error("Invalid student number or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid student number or password.");
  }

  const token = signToken(user._id.toString());

  return { token, user: toUserReponse(user) };
};
