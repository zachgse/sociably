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

export async function likeComment(req,res,id){
    const user = getUserFromToken(req);
    const comment_id = req.params.id;

    const comment = await Comment.findById({_id:comment_id});

    if (!comment){
        return res.status(404).json({msg:"Comment not found"});
    }

    try {
        const isExist = await Comment.findOne({
            _id : comment_id,
            'likes.user_id' : user?.id
        });
        const action = isExist ? 'unliked' : 'liked';

        if (isExist){
            comment.likes = comment.likes.filter(like => !like.user_id.equals(user.id));
        } else {
            comment.likes.push({
                user_id:user?.id
            });
        }

        await comment.save();

        const commentResource = await comment.toResource();
        res.status(200).json({msg:`Comment has been ${action}.`,data:commentResource});
    } catch (error){
        console.log(error);
    }
}