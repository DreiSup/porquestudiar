import express from "express";
import cors from "cors";
import morgan from "morgan"
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express()

//middlewares
app.use(cors({ origin: "http//:locahost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET)) 


app.use(morgan("dev"))

app.use("/api", appRouter)



export default app; 