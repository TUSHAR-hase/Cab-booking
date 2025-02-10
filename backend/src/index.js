import dotenv from 'dotenv'
dotenv.config();
import connectDB from "./db/index.js"
import { app } from "./app.js";
import mongoose from "mongoose"

console.log(process.env.MONGODB_URl)
// Connect to MongoDB
connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running at ${process.env.PORT}`);
    })
})
