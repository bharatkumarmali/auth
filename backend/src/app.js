import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(cookieParser());

app.use(express.static("public"));


// routes import 
import { userRouter } from "./routes/user.routes.js";
import { todoRouter } from "./routes/todo.routes.js"

// routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/todos", todoRouter);



export { app }
