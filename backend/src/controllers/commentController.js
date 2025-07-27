import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { getUserFromToken } from "../utils/utils.js";

export async function showCommentsFromPost(req,res){
    const post_id = req.params.id;
    
    const post = await Post.findById({_id:post_id});

    if (!post){
        return res.status(404).json({msg:"Post not found"});
    }

    const comments = await Comment.find({post_id:post_id});
    
    const commentsResource = await Promise.all(
        comments.map(comment => comment.toResource())
    );

    return res.status(200).json({data:commentsResource});    
}

export async function createComment(req,res,id){
    const user = getUserFromToken(req);

    if (!user){
        return res.status(401).json({msg:"Unauthorized"});
    }

    const postId = req.params.id;

    const post = await Post.findById({_id:postId});

    if (!post){
        return res.status(404).json({msg:"Post not found"});
    }

    const { content } = req.body;

    const comment = new Comment({
        post_id: postId,
        user_id: user?.id,
        content
    });

    await comment.save();

    const commentResource = await comment.toResource();

    return res.status(200).json({msg:"Comment created",data:commentResource});
}