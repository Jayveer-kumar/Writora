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

export const recordBlogView  = (blogId) => {
    return api.post(`/blogs/${blogId}/view`);
}

export const toggleBlogLike = (blogId) => {
    return api.post(`/blogs/${blogId}/like`);
}

export const addComment = (blogId , text) => {
    return api.post(`/blogs/${blogId}/comments`, { text });
}

export const updateComment = (blogId ,commentId , text) => {
    return api.patch(`/blogs/${blogId}/comments/${commentId}` , { text });
}

export const deleteComment = (blogId , commentId) => {
    return api.delete(`/blogs/${blogId}/comments/${commentId}`);
}

export const saveDraftBlog = async (title, content) => {
    const response = await api.post("/blogs/publish", { title, content, status: "draft" });
    return response.data;
};