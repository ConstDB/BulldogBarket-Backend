import { z } from "zod";
import { NU_CAMPUSES } from "../constants/campuses";
import { NU_COURSES } from "../constants/courses";
import { NU_YEAR_LEVELS } from "../constants/yearLevel";

export const signupSchema = z.object({
  name: z.string().min(1),
  studentNumber: z.string().regex(/^\d{4}-\d{5,7}$/, "Student number must be in the format YYYY-NNNNN (5-7 digits after dash)"),
  course: z.enum(NU_COURSES),
  yearLevel: z.enum(NU_YEAR_LEVELS),
  campus: z.enum(NU_CAMPUSES),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  studentNumber: z.string().regex(/^\d{4}-\d{5,7}$/, "Student number must be in the format YYYY-NNNNN (5-7 digits after dash)"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(1).optional(),
  course: z.enum(NU_COURSES).optional(),
  avatarUrl: z.url("Invalid image URL.").optional(),
  yearLevel: z.enum(NU_YEAR_LEVELS).optional(),
  campus: z.enum(NU_CAMPUSES).optional(),
  socials: z.object({
    messengerLink: z.url("Invalid Messenger Link").or(z.literal("")).optional()
  }).optional()
});

export type updateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type UserSignup = z.infer<typeof signupSchema>;
export type UserLogin = z.infer<typeof loginSchema>;
