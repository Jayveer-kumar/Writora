import express from "express";
const router = express.Router();
import * as blogController from "../controller/blogController.js"
import { protectRoute } from "../middleware/authMiddleware.js";

// Blog CRUD Operation
router.post("/", protectRoute , blogController.createBlog); // Create Blog
router.get("/",blogController.getAllBlog); // Get All Blog
router.get("/:blogId",blogController.getBlogById); // Get Single Blog
router.put("/:blogId",blogController.updateBlog); // Update Blog
router.delete("/:blogId",blogController.deleteBlog); // Delete Blog

// Comments Operation

router.post("/:blogId/comments",blogController.commentBlog); // Add Comment
router.delete("/:blogId/comments/:commentId",blogController.deleteCommentBlog); // Delete Comment


// Like Operation

router.post("/:blogId/like",blogController.likeBlog); // Like Blog
router.delete("/:blogId/like",blogController.dislikeBlog); // Dislike Blog

export default router;