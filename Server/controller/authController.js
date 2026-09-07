import * as authService from "../service/authService.js";
import asyncWrap from "../utils/asyncWrap.js";



export const signupUser =   async ( req , res )=>{
    console.log("Signup Controller Hitted:");
    const result = await authService.signupUserService(req.body);

    res.status(201).json({
        success : true,
        message : result.message,
        data : {
            user : result.user,
            token : result.token
        }
    });
}

export const loginUser = async (req,res)=>{
    const result = await authService.loginUserService(req.body);
    res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
      token: result.token,
    },
  });
}

export const getUser = async (req,res)=>{
    console.log("Request Recived for user profile :");
    const result  = await authService.getUserProfileService(req.params.id , req.user?.id);
    res.status(201).json(result); 
}

export const updateProfile = async (req,res)=>{
    authService.updateProfileService("123","Jayveer");
    res.json("User Profile Updated : ");
}

export const deleteUser = async  (req,res)=>{
    let result = await authService.deleteUserService(req.params.id);
    res.status(201).json(result);
}

export const followUser =  async(req,res) => {
    const result = await authService.followUserService(req.user.id , req.params.id);
    res.status(200).json({ success : true , data : "result" });
}

export const unfollowUser = async(req,res)=>{
    const result  = await authService.unfollowUserService(req.user.id, req.params.id);
    res.status(200).json({ success : true , data : result });
};

export const toggleFollowNotification = async(req,res) =>{
    const result = await authService.toggleFollowNotificationService(req.user.id, req.params.id);
    res.status(200).json({ success : true , data : result });
};

export const getSuggestedAuthors = async (req,res) => {
    const authors = await authService.getSuggestedAuthorsService(req.user?.id);
    res.status(200).json({ success : true , data : authors });
}

export const searchUsers = async (req, res) => {
  const users = await authService.searchUsersService(req.query.q);
  res.status(200).json({ success: true, data: users });
};