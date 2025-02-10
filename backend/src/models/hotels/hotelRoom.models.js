import mongoose from "mongoose";

const hotelRoomSchema = new mongoose.Schema({
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
    },
    roomType: {
        type: String,
        required: true
    },
    roomPricePerDay: {
        type: Number,
        required: true
    },
    roomImages: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        enum: ["available", "booked", "maintenance"],
        default: "available"
    },
    facilities: [
        {
            type: String
        }
    ]
}, { timestamps: true });

export const HotelRoom = mongoose.model("HotelRoom", hotelRoomSchema);