import mongoose from "mongoose";

// User Schema
const FlightAdminSchema = new mongoose.Schema({
    full_name: String,
    email: String,
    password: String,
    mobile: Number,
    gender: String,
    airline_name: String,
    isApproved: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number
    },
    isVerifiedOtp: {
        type: Boolean,
        default: false
    }
});

export const FlightAdmin = mongoose.model("FlightAdmin", FlightAdminSchema);