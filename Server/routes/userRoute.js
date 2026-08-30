import express from "express";
const router = express.Router();
import * as userController from "../controller/authController.js"
import { validate , signupValidationRules , loginValidationRules } from "../middleware/authValidator.js";
import asyncWrap from "../utils/asyncWrap.js";


// Auth Routes

router.post("/auth/signup",signupValidationRules , validate , asyncWrap(userController.signupUser));
router.post("/auth/login", loginValidationRules , validate, asyncWrap(userController.loginUser));

// User Routes
router.get("/:id",asyncWrap( userController.getUser))
// update profile
router.put("/profile", asyncWrap(userController.updateProfile)); 
// delete user
router.delete("/:id", asyncWrap(userController.deleteUser));


export default router;