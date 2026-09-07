import express from "express";
const router = express.Router();
import * as blogController from "../controller/blogController.js"
import { protectRoute } from "../middleware/authMiddleware.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import asyncWrap from "../utils/asyncWrap.js";



router.get("/",asyncWrap(blogController.getAllBlog)); // Get All Blog

router.get("/search/blogs", asyncWrap(blogController.searchBlogs));
router.get("/trending" , asyncWrap(blogController.getTrendingBlogs));

// Blog CRUD Operation
router.post("/publish", protectRoute , asyncWrap(blogController.createBlog)); // Create Blog
router.get("/:slug", optionalAuth , asyncWrap(blogController.getBlogBySlug)); // Get Single Blog
router.get("/:id/edit", protectRoute , asyncWrap(blogController.getBlogForEdit)); // Update Blog
router.put("/:id", protectRoute , asyncWrap(blogController.updateBlog));
router.delete("/:id", protectRoute , asyncWrap(blogController.deleteBlog)); // Delete Blog



// View Count Route
router.post("/:id/view" , protectRoute , asyncWrap(blogController.recordBlogView));

// like Comments Operation
router.post("/:id/like" , protectRoute , asyncWrap(blogController.toggleBlogLike))
router.post("/:id/comments",protectRoute , asyncWrap(blogController.addComment)); // Add Comment
router.patch("/:id/comments/:id" , protectRoute , asyncWrap(blogController.updateComment));
router.delete("/:id/comments/:id", protectRoute , asyncWrap(blogController.deleteComment));



export default router;