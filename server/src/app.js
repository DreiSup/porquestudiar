import express from "express";
import cors from "cors";
import morgan from "morgan"
import appRouter from "./routes/index.js";

const app = express()

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"))

app.use("/api", appRouter)



export default app; 