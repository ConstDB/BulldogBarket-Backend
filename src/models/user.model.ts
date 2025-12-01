import { model, Schema } from "mongoose";
import { NU_CAMPUSES } from "../constants/campuses";
import { NU_COURSES } from "../constants/courses";
import { NU_YEAR_LEVELS } from "../constants/yearLevel";
import { UserDoc } from "../types/userDoc";
import { getRandomAdventurerAvatar } from "../utils/dicebear";
import { hashPassword } from "../utils/hash";

const userSchema = new Schema<UserDoc>({
  name: {
    type: String,
    required: [true, "A user must have a name."],
  },
  studentNumber: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  course: {
    type: String,
    enum: NU_COURSES,
    required: true,
  },
  yearLevel: {
    type: String,
    enum: NU_YEAR_LEVELS,
    required: [true, "A user must have year level."],
  },
  campus: {
    type: String,
    enum: NU_CAMPUSES,
    required: [true, "A user must have campus."],
    default: "NU-Manila",
  },
  password: {
    type: String,
    required: [true, "A user must have password."],
    minlength: 8,
    select: false,
  },
  avatarUrl: {
    type: String,
    default: getRandomAdventurerAvatar(),
  },
  socials: {
    messengerLink: { type: String, default: "" },
  },
  itemsSold: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  if (this.password) {
    this.password = await hashPassword(this.password);
  }
});

export const UserModel = model<UserDoc>("User", userSchema);
