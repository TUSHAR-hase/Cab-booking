import mongoose from "mongoose";

const FlightBookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    flight_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassDetails' },
    schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' },
    date: Date,
    booking_status: String, // Confirmed, Pending, Canceled
    luggage_details: String,
    passenger_detail: String,
    seat_number: String,
    remaining_seat: Number,
});

export const FlightBooking = mongoose.model("FlightBooking", FlightBookingSchema);