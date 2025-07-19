import {mongoose,Schema} from "mongoose";

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
        ]``
    },
    { timestamps:true }
);

const Comment = mongoose.model("Comment",commentSchema);

export default Comment;