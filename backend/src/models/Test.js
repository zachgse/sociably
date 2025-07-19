import mongoose from "mongoose";
import { Schema } from "mongoose";

const testSchema = new mongoose.Schema(
    {
        title: { 
            type : String, 
            required: true
        },
        content: {
            type : String,
            required: true
        },
        user : {
            type : Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {timestamps:true},  
);

const Test = mongoose.model("Test",testSchema);

export default Test;