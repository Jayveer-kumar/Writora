import jwt from "jsonwebtoken"
import User from "../models/userSchema.js"
import bcrypt from "bcrypt"
import ExpressError from "../utils/expressError.js"

export const signupUserService = async(data)=>{
   console.log(` Signup Recieved Data : ${data}`);
   const { name , email , password  } = data;
   console.table(data);
   const existingUser = await User.findOne({email : email.toLowerCase() });
   console.log("Existing User Phase Passed : ");
   if(existingUser) {
      throw new Error("User already exists.");
   } 

   const profileImage = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
   console.log("ProfileImage User Phase Passed : ");

   const user = await User.create({ 
      name,
      email,
      password ,
      avatar : profileImage
   })

   console.log("User Created User Phase Passed : ");

   const token = jwt.sign(
      {id : user._id},
      process.env.JWT_SECRET,
      {expiresIn : "7d"}
   );
   console.log("Token Generated  Phase Passed : ");

   return { success : true, user , token , message : "Signin Successfully" };
}

export const loginUserService = async(data)=>{
   console.log(` Login Recieved Data : ${data}`);
   console.table(data);
   const {email , password} = data;
   const user = await User.findOne({email});
   console.log("User Is Exists : ");
   console.log(user);
   if(!user){
      throw new ExpressError("User Not Found",400);
   }

   const isMatch = await bcrypt.compare(password,user.password);
   if(!isMatch){
      throw new ExpressError("Invalid Password",400);
   }

   const token = jwt.sign(
      {id : user._id},
      process.env.JWT_SECRET,
      {expiresIn : "7d"}
   );

   return { success : true , user , token , message : "Login Successfully"};
}

export const getUserService = async(userId)=>{
   console.log(` Getuser Recieved Data : ${userId}`);

   const user = await User.findById(userId).select("-password");
   if(!user){
      throw new Error("User Not Found.")
   }
   return user; 
}

export const updateProfileService = async(userId,data)=>{
   console.log(` update user Profiel Recieved Data : ${userId} ${data} `);

   const user = await User.findByIdAndUpdate(userId,data,{new : true}).select("-password");

   return {success : true , user} ;
}

export const deleteUserService = async(userId)=>{
   console.log(` Delete user Recieved Data : ${userId}`);
   const user = await User.findByIdAndDelete(userId);

   if(!user){
      throw new ExpressError("User Not Found",404);
   }

   return { success : true , message : "User Deleted Successfully" }
}