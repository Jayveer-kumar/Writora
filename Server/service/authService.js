import jwt from "jsonwebtoken"
import User from "../models/userSchema.js"
import bcrypt from "bcrypt"
import ExpressError from "../utils/expressError.js"
import Blog from "../models/blogModel.js"

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


export const getUserProfileService = async (profileUserId, currentUserId) => {
  const user = await User.findById(profileUserId).select(
    "-password -resetPasswordToken -resetPasswordExpire -googleId"
  );

  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  const isOwnProfile = currentUserId === profileUserId;

  let followState = { isFollowing: false, notifyByEmail: false };
  if (currentUserId && !isOwnProfile) {
    const currentUser = await User.findOne(
      { _id: currentUserId, "following.user": profileUserId },
      { "following.$": 1 }
    );
    if (currentUser?.following?.length) {
      followState = {
        isFollowing: true,
        notifyByEmail: currentUser.following[0].notifyByEmail,
      };
    }
  }

  const blogs = await Blog.find({ authorId: profileUserId, status: "published" })
    .select("-content")
    .sort({ publishedAt: -1 });

  return {
    user: {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      pronouns: user.pronouns,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      createdAt: user.createdAt,
    },
    isOwnProfile,
    followState,
    blogs,
  };
};

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

export const followUserService = async (currentUserId , targetUserId) => {
   if(currentUserId === targetUserId){
      const err = new Error("You can't follow yourself.");
      err.statusCode = 400;
      throw err;
   }

   const targetUser = await User.findById(targetUserId);
   if(!targetUser){
      const err = new Error("User Not Found.");
      err.statusCode = 404;
      throw err;
   }

   const alreadyFollowing = await User.exists({
      _id : currentUserId,
      "following.user" : targetUserId
   });
   
   if(alreadyFollowing){
      return { isFollowing : true , notifyByEmail : true };
   }

   await User.findByIdAndUpdate(currentUserId , {
      $push : { following : { user : targetUserId , notifyByEmail : true }},
   });

   await User.findByIdAndUpdate(targetUserId , {
      $addToSet : { followers: { user: currentUserId, followedAt: new Date() } },
   });

   return { isFollowing : true , notifyByEmail : true };
}


export const unfollowUserService = async (currentUserId , targetUserId) => {
   await User.findByIdAndUpdate(currentUserId , {
      $pull : { following : { user : targetUserId }},
   });

   await User.findByIdAndUpdate(targetUserId , {
      $pull : { followers : currentUserId },
   });

   return { isFollowing : false };
}

export const toggleFollowNotificationService = async(currentUserId , targetUserId ) => {
   const user = await User.findOne(
      { _id : currentUserId , "following.user" : targetUserId },
      { "following.$": 1}
   );

   if(!user || !user.following?.length) {
      const err = new Error("You are not following this user.");
      err.statusCode = 400;
      throw err;
   }

   const newValue = !user.following[0].notifyByEmail;

   await User.updateOne(
      { _id : currentUserId , "following.user": targetUserId },
      { $set: { "following.$notifyByEmail": newValue }}
   );

   return { notifyByEmail : newValue };
}


export const getSuggestedAuthorsService = async (currentUserId, limit = 3) => {
  const currentUser = currentUserId
    ? await User.findById(currentUserId).select("following")
    : null;

  const excludeIds = [
    ...(currentUser?.following.map((f) => f.user) || []),
    ...(currentUserId ? [currentUserId] : []),
  ];

  return User.aggregate([
    { $match: { _id: { $nin: excludeIds } } },
    { $addFields: { followerCount: { $size: "$followers" } } },
    { $sort: { followerCount: -1 } },
    { $limit: limit },
    { $project: { name: 1, avatar: 1, followerCount: 1 } },
  ]);
};


export const searchUsersService = async (query, limit = 10) => {
  if (!query?.trim()) return [];
  const regex = new RegExp(query.trim(), "i");

  return User.find({ $or: [{ name: regex }, { bio: regex }] })
    .select("name avatar bio followers")
    .limit(limit);
};