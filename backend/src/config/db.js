import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO DB CONNECTED SUCCESSFULLY NGA NI");
    } catch(error){
        console.error("Error connecting to MONGO DB");
        process.exit(1);
    }
}