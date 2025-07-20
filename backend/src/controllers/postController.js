import Post from "../models/Post.js";
import dotenv from "dotenv";
import { getUserFromToken } from "../utils/utils.js";

dotenv.config();

export async function getAllPost(req,res){
    try {
        const posts = await Post.find();
        const postResource = await Promise.all(
            posts.map(post => post.toResource())
        );

        return res.status(200).json({data:postResource});
    } catch (error){
        return res.status(500).json({msg:error});
    }
}

export async function createPost(req,res){
    const user = getUserFromToken(req);

    if (!user) return res.status(401).json({message:"Unauthorized"});

    const {description} = req.body;

    const post = new Post({
        user_id: user.id,
        description
    })
    
    await post.save();

    return res.status(200).json({message:"New post has been posted!"});
}

export async function viewPost(req,res){
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({msg:"Post not found"});

    return res.status(200).json({data:post});
}

export async function likePost(req,res){
    const user = getUserFromToken(req);
    var message = null;
    console.log("user: ", user);

    if (!user) return res.status(401).json({message:"Unauthorized"});

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({msg:"Post not found"});

    const isPostLiked = await Post.findOne({
        _id: req.params.id,
        'likes.user_id': user.id
    });

    if (isPostLiked){
        post.likes = post.likes.filter(like => !like.user_id.equals(user.id));
        console.log("post has been unliked");
        message = "Post has been unliked";
    } else {
        post.likes.push({
            user_id: user.id
        });
        console.log("post has been liked");
        message = "Post has been liked";
    }

    // add websocket

    await post.save();

    return res.status(200).json({msg:message});
}