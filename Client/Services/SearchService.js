import api from "./api";
export const searchBlogs = (q) => api.get(`blogs/search/blogs?q=${encodeURIComponent(q)}`);
export const searchUsers = (q) => api.get(`user/search/users?q=${encodeURIComponent(q)}`);