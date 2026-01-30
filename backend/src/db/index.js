import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


export const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MONGODB CONNECTION SUCCESSFULL :: CONNECTION HOST ::", connectionInstance.connection[0].host);
    } catch (error) {
        console.log("MONGODB_CONNECTION_FAILED ::", error)
        process.exit(1)
    }
}