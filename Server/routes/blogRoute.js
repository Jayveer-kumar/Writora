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

// View Count Route
router.post("/:id/view" , protectRoute , asyncWrap(blogController.recordBlogView));

// like Comments Operation
router.post("/:id/like" , protectRoute , asyncWrap(blogController.toggleBlogLike))
router.post("/:id/comments",protectRoute , asyncWrap(blogController.addComment)); // Add Comment
router.patch("/:id/comments/:id" , protectRoute , asyncWrap(blogController.updateComment));
router.delete("/:id/comments/:id", protectRoute , asyncWrap(blogController.deleteComment));


// Like Operation

router.post("/:blogId/like",blogController.likeBlog); // Like Blog
router.delete("/:blogId/like",blogController.dislikeBlog); // Dislike Blog

export default router;