import { UserDoc } from "../../src/types/userDoc";

declare global {
  namespace Express {
    interface Request {
      user: UserDoc;
    }
  }
}

export {};
