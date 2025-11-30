import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT || 3000;
const DB = env.DATABASE_URI!.replace("<db_password>", env.DB_PASSWORD!);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
