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

commentSchema.methods.toResource = async function() {
    const user = await User.findById(this.user_id);
    return {
        id: this._id,
        user: user?.name,
        user_picture: user?.picture,
        comment: this.content,
        number_of_likes: this.likes.length,
        posted_at: this.createdAt
    }
}

const Comment = mongoose.model("Comment",commentSchema);
export default Comment;