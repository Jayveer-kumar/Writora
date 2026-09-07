import * as blogService from "../service/blogService.js"
import * as commentService from "../service/commentService.js";
import * as likeService from "../service/likeService.js";

export const createBlog = async ( req , res ) => {
    console.log("create Blog route hited: "); 
    console.log(req.body);
    try {
        const {title , content , status , category } = req.body;
        const authorId = req.user?.id; // assumes auth middleware sets req.user
        if(!authorId){
            return res.status(401).json({error : "Unauthorized"})
        }

        const blog = await blogService.createBlogService({title , content , status , authorId , category});
        return res.status(201).json({message : "Blog Published successfully",blog});
    } catch (err) {
        return res.status(err.status || 500).json({
            error : err.message || "Something went wrong",
            detail : err.details
        })
    }
}

export const getAllBlog = async (req,res)=>{
    try {
      const blogs = await blogService.getAllBlogService();
      return res.status(200).json({
        success: true,
        blogs,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "No Blogs. Please Try Some time later...",
      });
    }
}

export const getBlogBySlug = async  (req,res)=>{
    const { slug } = req.params;
    if(!slug){
        return res.status(401).json({ error : "invalid slug"});
    }
    const result = await blogService.getBlogBySlugService(slug , req.user?.id);

    // console.log("user : ",req.user.id);

    return res.status(200).json({ success: true , ...result });
}

export const recordBlogView = async (req,res) => {
    await blogService.recordBlogViewService(req.params.id , req.user?.id);
    res.status(200).json({ success : true });
}

export const toggleBlogLike = async ( req , res ) => {
    const result = await blogService.toggleBlogLikeService(req.params.id , req.user.id);
    res.status(200).json({ success : true , data : result });
}

export const addComment = async ( req , res ) => {
    const comment = await blogService.addCommentService(req.params.id , req.user.id , req.body.text);
    res.status(201).json({ success : true , data : comment });
}

export const getBlogForEdit = async (req, res) => {
  const blog = await blogService.getBlogForEditService(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: blog });
};

export const updateBlog = async (req, res) => {
  const blog = await blogService.updateBlogService(req.params.id, req.user.id, req.body);
  res.status(200).json({ success: true, data: blog });
};



export const deleteBlog = async (req, res) => {
  const result = await blogService.deleteBlogService(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: result });
};




export const updateComment = async (req,res) => {
    const comment = await blogService.updateCommentService(req.params.id , req.user.id , req.body.text);
    res.status(200).json({ success : true , data : comment });
}

export const deleteComment = async (req,res) => {
    const result = await blogService.deleteCommentService(req.params.id, req.user.id);
    res.status(200).json({success : true , data : result });
}

export const getTrendingBlogs = async (req,res)=>{
    console.log("Request Recieved for Trending Blogs.");
    const blogs = await blogService.getTrendingBlogsService();
    res.status(200).json({ success : true , data : blogs });
}

export const searchBlogs = async (req, res) => {
  const blogs = await blogService.searchBlogsService(req.query.q);
  res.status(200).json({ success: true, data: blogs });
};