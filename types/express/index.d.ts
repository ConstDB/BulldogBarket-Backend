import { UserDoc } from "../../src/types/userDoc";
import { ListingQuery } from "../../src/validations/listing";

declare global {
  namespace Express {
    interface Request {
      user: UserDoc;
      validatedQuery: unknown;
      validatedParams: any;
    }
  }
}

export {};
