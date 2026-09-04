import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    coverImage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: [
        "Technology",
        "Programming",
        "Web Development",
        "Artificial Intelligence",
        "Education",
        "Business",
        "Lifestyle",
        "Health & Fitness",
        "Travel",
        "Entertainment",
        "News",
        "Other",
      ],
      default: "Other",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }, // createdAt , updatedAt auto handled
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
