import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express from "express";
const app = express();
const port  = process.env.PORT || 8080;
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/userRoute.js"
import blogRouter from "./routes/blogRoute.js";
import asyncWrap from "./utils/asyncWrap.js";
import ExpressError from "./utils/expressError.js";

try {
   
   await connectDB();
   console.log("Database Connected Successfully  :");
} catch (err) {
   console.log("Database  connection failed ",err); 
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/blogs",blogRouter);
app.use("/api/user",userRouter);

app.use((req,res,next)=>{
   next(new ExpressError(`can't find ${req.originalUrl} on this server `,404));
})

app.use((err,req,res,next)=>{
   const  { status = 500 , message = "Something is not right?" } = err;
   console.log(err);
   res.status(status).json({success : false , message});
})

app.listen(port,()=>{
   console.log(`Server is running at ${port}`);
})

