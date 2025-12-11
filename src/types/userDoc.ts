import { Document, SchemaTimestampsConfig } from "mongoose";
import { NU_COURSES } from "../constants/courses";
import { NU_YEAR_LEVELS } from "../constants/yearLevel";
import { NU_CAMPUSES } from "../constants/campuses";

export interface UserDoc extends Document, SchemaTimestampsConfig {
  name: string;
  studentNumber: string;
  course: (typeof NU_COURSES)[number];
  yearLevel: (typeof NU_YEAR_LEVELS)[number];
  campus: (typeof NU_CAMPUSES)[number];
  password: string;
  avatarUrl: string;
  socials: {
    messengerLink: string;
  };
  itemsSold: number;
  totalEarnings: number;
}
