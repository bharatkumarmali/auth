import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGOOSE_URI}/${DB_NAME}`)
        console.log(`MongoDB connected successfully to host ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to MongoDB : ${error}`)
    }
}

export default connectDB;