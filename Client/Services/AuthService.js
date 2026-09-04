import api from "./api";

export const LoginUser = (data)=>{
    return api.post("/user/auth/login",data);
}

export const SignupUser = (data)=>{
    console.log("Signup Api is hited : with data ",data);
    return api.post("/user/auth/signup",data);  
}

export const followUser = (userId) => {
    return api.post(`/user/follow/${userId}`);
}

export const unfollowUser = (userId) => {
    return api.post(`/user/unfollow/${userId}`);
}

export const toggleFollowNotification = (userId) => {
    return api.patch(`/user/follow/${userId}/notify`);
}