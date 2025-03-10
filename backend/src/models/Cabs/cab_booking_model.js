import mongoose from "mongoose";


const cab_booking_model = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", require: true },
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: "vehicle", require: true },
    Rider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", require: true },
    sourece_location: {
        address: { type: String, require: true }
    },
    destination_location: {
        address: { type: String, require: true }
    },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    pickup_time: { type: Date, required: true },
    drop_time: { type: Date, required: true }, payment_status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})
export const booking=mongoose.models.CabBookings||mongoose.model("CabBookings",cab_booking_model)