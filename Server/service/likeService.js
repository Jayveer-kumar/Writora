export const addNewLikeService = async (userId , blogId )=>{
    console.log(`New Like Added : ${userId}`);
    return userId;
}

export const dislikeService = async (userId , blogId)=>{
    console.log(`Like Was Disliked: ${userId} `);
    return userId;
}