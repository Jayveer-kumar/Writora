import api from "./api";

export const publishBlog = async (title , content , category ) => {
    return api.post("/blogs/publish",{title , content , category , status : "published"});
}

export const getAllBlog = async () => {
    return api.get("/blogs");
}

export const getBlogBySlug = async (slug) =>{
    return api.get(`/blogs/${slug}`);
}

export const saveDraftBlog = async (title, content) => {
    const response = await api.post("/blogs/publish", { title, content, status: "draft" });
    return response.data;
};