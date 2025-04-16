import mongoose from "mongoose";

const FlightBookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    flight_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    class: String,
    schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
    date: Date,
    booking_status: String, // Confirmed, Pending, Canceled
    luggage_details: String,
    passenger_detail: [],
    booked_seat: Number,
    price: Number,
    payment_id: String,
});

export const FlightBooking = mongoose.model("FlightBooking", FlightBookingSchema);