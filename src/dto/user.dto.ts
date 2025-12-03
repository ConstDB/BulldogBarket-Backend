import { UserDoc } from "../types/userDoc";

export const toUserReponse = (user: UserDoc | Partial<UserDoc>) => {
  return {
    id: user._id?.toString(),
    name: user.name,
    studentNumber: user.studentNumber,
    course: user.course,
    yearLevel: user.yearLevel,
    campus: user.campus,
    avatarUrl: user.avatarUrl,
    socials: user.socials,
    itemsSold: user.itemsSold,
  };
};
