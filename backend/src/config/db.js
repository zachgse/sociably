import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
    } catch(error){
        console.error("Error connecting to MONGO DB");
        process.exit(1);
    }
}