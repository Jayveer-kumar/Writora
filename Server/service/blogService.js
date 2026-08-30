import Blog from "../models/blogModel.js";
import { generateUniqueSlug } from "../utils/generateSlug.js";
import { validateContentImage , extractFirstImageUrl } from "../utils/validateContent.js";
import { generateExcerpt , countWords } from "../utils/extractExcerpt.js";


// Shared validation + field prep , used by both create and update
async function prepareBlogFields({title , content , excludeId = null}) {
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

    const { valid , invalidUrls } = validateContentImage(content);
    if(!valid) {
        const err = new Error("Content contains invalid image URLs.");
        err.statusCode = 400;
        err.details = { invalidUrls };
        throw err;
    }

    const slug = await generateUniqueSlug(title,excludeId);
    const excerpt = generateExcerpt(content);
    const wordCount = countWords(content);
    const coverImage = extractFirstImageUrl(content);

    return { title : title.trim() , content , slug , excerpt , wordCount , coverImage };
}





export const createBlogService = async ({ title , content , status , authorId })=>{
   const fields = await prepareBlogFields({ title , content });

   const blog = await Blog.create({
    ...fields,
    authorId,
    status : status === "published" ? "published" : "draft",
    publishedAt : status === "published" ? new Date() : null,
   })
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

export const getBlogBySlugService = async (slug)=>{
    const blog = await Blog.findOne({ slug , status : "published" });
    if(!blog) {
        const err = new Error("Blog not found.");
        err.statusCode = 404;
        throw err;
    }
    return blog;
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
    console.log("All Blog is Returned : ");
    return;
}

// export const deleteBlogService = async ( blogId , userId ) =>{
//     console.log(`Blog is Deleted : ${userId} `);
//     return blogId;
// }