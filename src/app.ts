import express, {Request, Response} from "express";
import morgan from "morgan";

const app = express();

if (process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

app.use(express.json())

app.get("/", (req:Request, res: Response) => {
    res.send("Hello World!");
})
export default app;