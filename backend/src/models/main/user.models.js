import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: Number,
    },
    type: {
        type: String,
        enum: ["customer", "admin", "hotelOwner", "cabOwner", "flightOwner"],
        default: "customer"
    },

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)