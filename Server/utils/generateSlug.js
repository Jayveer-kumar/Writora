import Blog from "../models/blogModel.js";

// "My First Blog!!" -> "my-first-blog"

function slugify(title){
    return title
    .toLowercase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g,"-") // spaces -> hyphens
    .replace(/-+/g,"-"); // collapse multiple hyphens
}

// Ensures the slug is unique in the DB - if "my-first-blog" already
// exists , tries "my-first-blog-1" , "my-first-blog-2" , etc.

export async function generateUniqueSlug(title, excludeId = null){
    const base = slugify(title) || "post";
    let slug = base;
    let counter = 1;

    while(true) {
        const query = { slug };
        if(excludeId) query._id = { $ne : excludeId};
        
        const existing = await Blog.findOne(query);
        if(!existing) return slug;
        slug = `${base}-${counter}`;
        counter += 1;
    }
}