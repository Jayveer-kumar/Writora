export const addNewCommentService = async (userId , blogId , comment)=>{
    console.log(`New Comment Added : ${comment}`);
    return comment;
}

export const deleteCommentService = async (userId , blogId  , commentId)=>{
    console.log(`Comment Was Deleted : ${commentId} `);
    return commentId;
}