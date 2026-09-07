import Blog from "../models/blogModel.js";
import User from "../models/userSchema.js";
import BlogView from "../models/blogViewModel.js";
import Comment from "../models/commentModel.js";
import { generateUniqueSlug } from "../utils/generateSlug.js";
import { validateContentImages , extractFirstImageUrl } from "../utils/validateContent.js";
import { generateExcerpt , countWords } from "../utils/extractExcerpt.js";
import { calculateReadTime } from "../utils/readTime.js";
// import BlogView from "../models/blogViewModel.js";

// Shared validation + field prep , used by both create and update
async function prepareBlogFields({title , content , excludeId = null  }) {
    if(!title?.trim()) {
        const err = new Error("Title is required.");
        err.statusCode = 400;
        throw err;
    }

    if(!content){
        const err = new Error("Content is required.");
        err.statusCode = 400;
        throw err;
    }

    const { valid , invalidUrls } = validateContentImages(content);
    if(!valid) {
        const err = new Error("Content contains invalid image URLs.");
        err.statusCode = 400;
        err.details = { invalidUrls };
        throw err;
    }

    const slug = await generateUniqueSlug(title,excludeId);
    const excerpt = generateExcerpt(content);
    const wordCount = countWords(content);
    const readTime = calculateReadTime(wordCount); 
    const coverImage = extractFirstImageUrl(content);

    return { title : title.trim() , content , slug , excerpt , wordCount , readTime , coverImage };
}





export const createBlogService = async ({ title , content , status , authorId , category })=>{
   
   const fields = await prepareBlogFields({ title , content });

   const blog = await Blog.create({
    ...fields,
    authorId,
    status : status === "published" ? "published" : "draft",
    category ,
    publishedAt : status === "published" ? new Date() : null,
   });
   console.log(blog);
   return blog;
}


export const updateBlogService = async (blogId, userId, { title, content, status, category }) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    const err = new Error("Blog not found.");
    err.statusCode = 404;
    throw err;
  }
  if (blog.authorId.toString() !== userId) {
    const err = new Error("You can only edit your own blog.");
    err.statusCode = 403;
    throw err;
  }

  const fields = await prepareBlogFields({ title, content, excludeId: blogId }); // excludeId zaroori hai taaki slug uniqueness check khud se conflict na kare

  blog.title = fields.title;
  blog.content = fields.content;
  blog.slug = fields.slug;
  blog.excerpt = fields.excerpt;
  blog.wordCount = fields.wordCount;
  blog.readTime = calculateReadTime(fields.wordCount);
  blog.coverImage = fields.coverImage;
  if (category) blog.category = category;

  if (status && status !== blog.status) {
    blog.status = status;
    if (status === "published" && !blog.publishedAt) blog.publishedAt = new Date();
  }

  await blog.save();
  return blog;
};

export const getBlogBySlugService = async (slug , currentUserId)=>{
    const blog = await Blog.findOne({ slug , status : "published" }).populate("authorId","name avatar pronouns")
    if(!blog) {
        const err = new Error("Blog not found.");
        err.statusCode = 404;
        throw err;
    }

    let followState = { isFollowing : false , notifyByEmail : false };
    let isLiked = false;

    // Only run the query if the user is Logged-in otherwise this request is for guest
    if(currentUserId) {
        const currentUser = await User.findOne(
            { _id: currentUserId, "following.user": blog.authorId._id },
            { "following.$": 1}
        );

        if(currentUser?.following?.length){
            followState = {
                isFollowing : true,
                notifyByEmail: currentUser.following[0].notifyByEmail,
            };
        }

        isLiked = blog.likes.some((id) => id.toString() === currentUserId);
    }

    const comments = await getCommentsByBlogService(blog._id);

    return {blog , followState , isLiked , likeCount : blog.likes.length , comments,};
}



export const getBlogsByAuthorService = async (authorId, status) => {
  const query = { authorId };
  if (status) query.status = status;
  return Blog.find(query).sort({ updatedAt: -1 });
};

export const getBlogForEditService = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    const err = new Error("Blog not found.");
    err.statusCode = 404;
    throw err;
  }
  if (blog.authorId.toString() !== userId) {
    const err = new Error("You can only edit your own blog.");
    err.statusCode = 403;
    throw err;
  }
  return blog; // raw content JSON, editor isko load karega
};

export const deleteBlogService = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    const err = new Error("Blog not found.");
    err.statusCode = 404;
    throw err;
  }

  if (blog.authorId.toString() !== userId) {
    const err = new Error("You can only delete your own blog.");
    err.statusCode = 403;
    throw err;
  }

  await blog.deleteOne();
  // cleanup — related data bhi hata do, warna orphan documents reh jayenge
  await Comment.deleteMany({ blogId });
  await BlogView.deleteMany({blogId});

  return { blogId };
};

export const getAllBlogService = async ( { page = 1 , limit = 10 } = {} )=>{
    try {
        console.log("Fetching All Blogs: ");
        const blogs  = await Blog.find().populate("authorId", "name avatar pronouns").sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit);
        return blogs;
    } catch (err) {
        console.error("Error Fetching Blogs...",err);
        throw err;
    }
}

export const recordBlogViewService = async (blogId , userId) => {
    if(!userId) return;

    const blog = await Blog.findById(blogId).select("viewedBy");

    if(!blog) return;

    const alreadyViewed  = blog.viewedBy.some((id) => id.toString() === userId);
    if(alreadyViewed) return ; // user already viwed this blog , don't increase views

    await Blog.findByIdAndUpdate(blogId, {
        $inc : { views: 1},
        $addToSet : { viewedBy: userId },
    })
    await BlogView.create({ blogId, userId });
};

export const toggleBlogLikeService = async (blogId , userId) => {
    const blog  = await Blog.findById(blogId).select("likes");
    if(!blog) {
        const err = new Error("Blog not found.");
        err.statusCode = 404;
        throw err;
    }

    const alreadyLiked = blog.likes.some((id) => id.toString() === userId);

    const updated = await Blog.findByIdAndUpdate(blogId , 
        alreadyLiked
        ? { $pull : { likes: userId }} 
        : { $addToSet : { likes : userId }},
        { new : true }
    ).select("likes");

    return {
        isLiked : !alreadyLiked,
        likeCount : updated.likes.length,
    };
}

export const addCommentService = async (blogId , userId, text) =>{
    if(!text?.trim()) {
        const err = new Error("Comment text is required.");
        err.statusCode = 400;
        throw err;
    }

    const comment = await Comment.create( {
        blogId,
        authorId : userId,
        text : text.trim(),
    });

    await Blog.findByIdAndUpdate(blogId, { $inc: { commentCount: 1 } });

    return comment.populate("authorId", "name avatar");
}

export const getCommentsByBlogService = async (blogId) => {
    return Comment.find({blogId}).populate("authorId","name avatar").sort({ createdAt: -1 });
}


export const updateCommentService = async (commentId , userId , text) => {
    if(!text?.trim()) {
        const err = new Error("Comment text is required.");
        err.statusCode = 400;
        throw err;
    }

    const comment = await Comment.findById(commentId);
    if(!comment) {
        const err = new Error("Comment not found.");
        err.statusCode = 404;
        throw err;
    }

    if(comment.authorId.toString() !== userId) {
        const err = new Error("You can only edit your own comment.");
        err.statusCode = 403;
        throw err;
    }

    comment.text = text.trim();
    comment.edited = true;
    await comment.save();

    return comment.populate("authorId","name avatar");
}

export const deleteCommentService = async(commentId , userId) => {
    const comment = await Comment.findById(commentId);
    if(!comment){
        const err = new Error("Comment not found.");
        err.statusCode = 404;
        throw err;
    }

    if(comment.authorId.toString() !== userId) {
        const err = new Error("You can only delete your own comment.");
        err.statusCode = 403;
        throw err;
    }

    await comment.deleteOne();
    await Blog.findByIdAndUpdate(comment.blogId , { $inc : { commentCount : -1 }});
    return { commentId };
}



// NEw 
export const getTrendingBlogsService = async (limit = 4) => {
  const blogs = await Blog.aggregate([
    { $match: { status: "published" } },
    {
      $addFields: {
        engagementScore: {
          $add: [
            { $ifNull: ["$views", 0] },
            { $multiply: [{ $size: { $ifNull: ["$likes", []] } }, 3] },
            { $multiply: [{ $ifNull: ["$commentCount", 0] }, 5] },
          ],
        },
      },
    },
    { $sort: { engagementScore: -1, publishedAt: -1 } },
    { $limit: limit },
    { $project: { title: 1, slug: 1, authorId: 1, views: 1, publishedAt: 1 } },
    {
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "_id",
        as: "authorId",
      },
    },
    { $unwind: "$authorId" },
  ]);
  return blogs;
};


// blogService.js
export const searchBlogsService = async (query, limit = 10) => {
  if (!query?.trim()) return [];
  const regex = new RegExp(query.trim(), "i"); // case-insensitive partial match

  return Blog.find({
    status: "published",
    $or: [{ title: regex }, { excerpt: regex }, { tags: regex }],
  })
    .populate("authorId", "name avatar")
    .select("-content")
    .sort({ publishedAt: -1 })
    .limit(limit);
};