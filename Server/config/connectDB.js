import mongoose from "mongoose";

export const connectDB = async () =>{
    console.log("Connecting to:", process.env.MONGO_URL);
    let res = await mongoose.connect(`${process.env.MONGO_URL}`);    
}