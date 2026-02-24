import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

const connectDB = async () =>{
    try {
        await mongoose.connect(MONGODB_URL)
        console.log("MongoDb Is Connected... ✅");
    } catch (error) {
        console.log("MongoDB is Disconnected... ❌");
        process.exit(1)    
    }
}

export default connectDB;