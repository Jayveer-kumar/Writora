import api from "./api";

export const LoginUser = (data)=>{
    return api.post("/user/auth/login",data);
}

export const SignupUser = (data)=>{
    return api.post("/user/auth/signup",data);  
}