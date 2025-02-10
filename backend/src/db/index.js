import mongoose from "mongoose"

const connectDB = async () => {
    try {
        console.log(`${process.env.MONGODB_URL}/${process.env.DB}`)
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB}`)
        console.log(`MongoDB connected ${connection.connection.host}`);

    } catch (error) {
        console.log(`MongoDB connection error ${error}`)
        process.exit(1)
    }
}

export default connectDB;
