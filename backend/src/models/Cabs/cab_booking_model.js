import mongoose from "mongoose";

const cab_booking_model = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicles", required: true },
    Rider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Riders", required: true },
    source_location: {
        address: { type: String, required: true }
    },
    destination_location: {
        address: { type: String, required: true }
    },

    status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" },
    pickup_time: { type: Date, required: true },
   
    payment_status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});
export const booking =mongoose.model('Booking', cab_booking_model)||mongoose.models.Booking;
