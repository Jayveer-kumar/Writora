import mongoose from "mongoose";

const blogViewSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  viewedAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.model("BlogView", blogViewSchema);