import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import User from './User.js';

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
    // add comments model 
    return {
        id: this._id,
        posted_by: user?.name,
        profile_picture: user?.picture,
        description: this.description,
        number_of_likes: this.likes.length,
        posted_at: this.createdAt
        // add number of comments
    }
}

const Post = mongoose.model("Post",postSchema);
export default Post;