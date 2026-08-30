import * as authService from "../service/authService.js"


export const signupUser =   async ( req , res )=>{
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
    res.status(201).json(result);
}

export const getUser = async (req,res)=>{
    const result  = await authService.getUserService(req.params.id);
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