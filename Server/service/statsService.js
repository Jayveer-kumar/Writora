import Blog from "../models/blogModel.js";
import BlogView from "../models/blogViewModel.js";
import User from "../models/userSchema.js";

export const getAuthorStatsService = async (authorId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1); // exclusive

  const myBlogs = await Blog.find({ authorId }).select("likes commentCount");
  const myBlogIds = myBlogs.map((b) => b._id);

  const viewLogs = await BlogView.find({
    blogId: { $in: myBlogIds },
    viewedAt: { $gte: startDate, $lt: endDate },
  }).select("viewedAt");

  // day-wise breakdown (chart ke liye)
  const dailyMap = {};
  viewLogs.forEach((v) => {
    const day = v.viewedAt.toISOString().slice(0, 10);
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });

  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyViews = Array.from({ length: daysInMonth }, (_, i) => {
    const dateStr = new Date(year, month - 1, i + 1).toISOString().slice(0, 10);
    return { date: dateStr, count: dailyMap[dateStr] || 0 };
  });

  const totalLikes = myBlogs.reduce((sum, b) => sum + b.likes.length, 0);
  const totalComments = myBlogs.reduce((sum, b) => sum + b.commentCount, 0);

  const author = await User.findById(authorId).select("followers");
  const followersGained = author.followers.filter(
    (f) => f.followedAt >= startDate && f.followedAt < endDate
  ).length;

  return {
    totalViewsThisMonth: viewLogs.length,
    totalLikes,
    totalComments,
    followersGained,
    totalStories: myBlogs.length,
    dailyViews,
  };
};