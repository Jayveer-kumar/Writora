import express from "express";
const router = express.Router();
import * as blogController from "../controller/blogController.js"
import { protectRoute } from "../middleware/authMiddleware.js";
import asyncWrap from "../utils/asyncWrap.js";

// Blog CRUD Operation

router.get("/",asyncWrap(blogController.getAllBlog)); // Get All Blog
router.post("/publish", protectRoute , asyncWrap(blogController.createBlog)); // Create Blog
router.get("/:slug",protectRoute , asyncWrap(blogController.getBlogBySlug)); // Get Single Blog
router.put("/:blogId", protectRoute , asyncWrap(blogController.updateBlog)); // Update Blog
router.delete("/:blogId", protectRoute , asyncWrap(blogController.deleteBlog)); // Delete Blog

// Comments Operation

router.post("/:blogId/comments",blogController.commentBlog); // Add Comment
router.delete("/:blogId/comments/:commentId",blogController.deleteCommentBlog); // Delete Comment


// Like Operation

router.post("/:blogId/like",blogController.likeBlog); // Like Blog
router.delete("/:blogId/like",blogController.dislikeBlog); // Dislike Blog

export default router;