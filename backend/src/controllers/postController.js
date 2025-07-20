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
    console.log("user: ", user);

    if (!user) return res.status(401).json({message:"Unauthorized"});

    const {description} = req.body;
    console.log("request: ", req.body);
    const post = new Post({
        user_id: user.id,
        description
    })
    
    await post.save();

    return res.status(200).json({message:"New post has been posted!"});
}