import express from "express";
const router = express.Router();
import * as userController from "../controller/authController.js"
import { validate , signupValidationRules , loginValidationRules } from "../middleware/authValidator.js";
import asyncWrap from "../utils/asyncWrap.js";
import {protectRoute} from "../middleware/authMiddleware.js";
import { getAuthorStats } from "../controller/statsController.js";


// Auth Routes

router.post("/auth/signup",signupValidationRules , validate , asyncWrap(userController.signupUser));
router.post("/auth/login", loginValidationRules , validate, asyncWrap(userController.loginUser));

router.get("/search/users", asyncWrap(userController.searchUsers)); 

// user suggested to follow
router.get("/suggested" , protectRoute , asyncWrap(userController.getSuggestedAuthors));
router.get("/stats", protectRoute , asyncWrap(getAuthorStats));

// User Follow Unfollow routes
router.post("/follow/:id", protectRoute, asyncWrap(userController.followUser));
router.post("/unfollow/:id", protectRoute ,  asyncWrap(userController.unfollowUser));
router.patch("/follow/:id/notify" , protectRoute ,  asyncWrap(userController.toggleFollowNotification));

// User Routes
router.get("/:id/profile", protectRoute ,   asyncWrap( userController.getUser))

// delete user
router.delete("/:id", asyncWrap(userController.deleteUser));


export default router;