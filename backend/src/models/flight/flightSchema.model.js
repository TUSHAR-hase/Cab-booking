import mongoose from 'mongoose';

const FlightSchema = new mongoose.Schema({
    flight_name: String,
    number_of_seats: Number,
    status: String, // e.g., On-Time, Delayed, Canceled
});

export const Flight = mongoose.model("Flight", FlightSchema)