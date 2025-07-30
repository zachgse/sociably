import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import User from './User.js';
import Comment from "./Comment.js"

const postSchema = new mongoose.Schema(
    {
        user_id:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        description: {
            type: String,
            required: true
        },
        likes: [
            {
                user_id: { 
                    type : Schema.Types.ObjectId, 
                    ref: 'User'
                },
                timestamp : { 
                    type: Date, 
                    default: Date.now 
                }
            }
        ]
    },
    { timestamps:true }
);

postSchema.methods.toResource = async function() {
    const user = await User.findById(this.user_id);
    const comments = await Comment.find({post_id:this._id});
    return {
        id: this._id,
        posted_by: user?.name,
        profile_picture: user?.picture,
        description: this.description,
        likes: this.likes,
        number_of_likes: this.likes.length,
        number_of_comments: comments.length,
        posted_at: this.createdAt
    }
}

const Post = mongoose.model("Post",postSchema);
export default Post;