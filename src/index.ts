import dotenv from "dotenv";
dotenv.config({path: "./.env"})

import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE_URI!.replace(
    "<db_password>", process.env.DB_PASSWORD!
);

mongoose
    .connect(DB)
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((error) => {
        console.error("Database connection failed", error);
        process.exit(1);
    });

app.listen(PORT, () =>{
    console.log(`Server is running on port: ${PORT}`)
})