import Blog from "../models/blogModel.js";
import User from "../models/userSchema.js";
import { generateUniqueSlug } from "../utils/generateSlug.js";
import { validateContentImages , extractFirstImageUrl } from "../utils/validateContent.js";
import { generateExcerpt , countWords } from "../utils/extractExcerpt.js";
import { calculateReadTime } from "../utils/readTime.js";

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



export const updateBlogService = async ( blogId , {title , content , status } , authorId ) =>{
    const existing = await Blog.findOne({_id : blogId , authorId });
    if(!existing) {
        const err = new Error("Blog Not Found");
        err.statusCode = 404;
        throw err;
    }

    const fields = await prepareBlogFields({ title , content , excludeId : blogId });

    const wasPublished = existing.status === "published";
    const willBePublished = status === "published";

    existing.set({
        ...fields,
        status : willBePublished ? "published" : "draft",
        publishedAt : !wasPublished && willBePublished ? new Date() : existing.publishedAt,
    });

    await existing.save();
    return existing;
}

export const getBlogBySlugService = async (slug , currentUserId)=>{
    const blog = await Blog.findOne({ slug , status : "published" }).populate("authorId","name avatar pronouns")
    if(!blog) {
        const err = new Error("Blog not found.");
        err.statusCode = 404;
        throw err;
    }

    let followState = { isFollowing : false , notifyByEmail : false };

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
    }

    return {blog , followState};
}



export const getBlogsByAuthorService = async (authorId, status) => {
  const query = { authorId };
  if (status) query.status = status;
  return Blog.find(query).sort({ updatedAt: -1 });
};
 
export const deleteBlogService = async (blogId, authorId) => {
  const deleted = await Blog.findOneAndDelete({ _id: blogId, authorId });
  if (!deleted) {
    const err = new Error("Blog not found");
    err.statusCode = 404;
    throw err;
  }
  return deleted;
};


export const getAllBlogService = async ()=>{
    try {
        console.log("Fetching All Blogs: ");
        const blogs  = await Blog.find().populate("authorId", "name avatar pronouns");;
        return blogs;
    } catch (err) {
        console.error("Error Fetching Blogs...",err);
        throw err;
    }
}
