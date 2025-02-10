import mongoose from "mongoose";

const hotelBookingSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HotelRoom",
    },
    bookingStartDate: {
        type: Date,
        required: true
    },
    bookingEndDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
}, { timestamps: true });