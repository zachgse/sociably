import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
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

const Post = mongoose.model("Post",postSchema);
export default Post;