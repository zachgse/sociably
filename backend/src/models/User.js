import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
        },
        email : {
            type : String,
            required: true
        },
        picture: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        provider: { //socmed type of oauth (right now its only google)
            type: String,
            required: true
        }
    },
    {timestamps:true}
)

const User = mongoose.model("User",userSchema);

export default User;