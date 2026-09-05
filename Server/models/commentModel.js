import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        blogId: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Blog",
            required : true,
            index : true,
        },
        authorId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        text : {
            type : String,
            required : true,
            trim : true,
            maxlength : 1000,
        },
        edited : {
            type : Boolean,
            default : false
        }
    },
    { timestamps : true }
);

const Comment = mongoose.model("Comment",commentSchema);
export default Comment;