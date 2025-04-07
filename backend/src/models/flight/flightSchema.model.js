
import mongoose from "mongoose";
const FlightSchema = new mongoose.Schema({
    flight_name: { type: String, required: true },
    number_of_seats: { type: Number, required: true },
    flightNo: { type: String, required: true, unique: true },
    economy_seats: { type: Number, required: true },
    business_seats: { type: Number, required: true },
    first_class_seats: { type: Number, required: true },
});

export const Flight = mongoose.model("Flight", FlightSchema);
