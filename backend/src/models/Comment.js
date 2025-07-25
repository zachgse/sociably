import {mongoose,Schema} from "mongoose";
import User from "./User.js";

const commentSchema = new mongoose.Schema(
    {
        post_id: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        user_id: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        content: {
            type: String,
            required: true
        },
        likes: [
            {
                user_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                timestamps: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    { timestamps:true }
);

const Comment = mongoose.model("Comment",commentSchema);

commentSchema.methods.toResource = async function() {
    const user = await User.findById(this.user_id);
    return {
        id: this._id,
        posted_by: user?.name,
        comment: this.content,
        number_of_likes: this.likes.length,
        posted_at: this.createdAt
    }
}

export default Comment;