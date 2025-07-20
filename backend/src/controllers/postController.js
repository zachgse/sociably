import Post from "../models/Post.js";
import dotenv from "dotenv";
import { getUserFromToken } from "../utils/utils.js";

dotenv.config();

export async function createPost(req,res){
    const user = getUserFromToken(req);

    if (!user) return res.status(401).json({message:"Unauthorized"});

    const {description} = req.body;
    const post = new Post({
        user_id: user._id,
        description
    })
    
    await post.save();

    return res.status(200).json({message:"New post has been posted!"});
}