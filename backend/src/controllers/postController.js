import Post from "../models/Post.js";
import dotenv from "dotenv";

dotenv.config();

export async function createPost(req,res){
    const cookie = req.cookies.token;
}