import mongoose from "mongoose";
const ScheduleSchema = new mongoose.Schema({
    flight_admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FlightAdmin' },
    flight_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    departure_station: String,
    destination_station: String,
    departure_time: String,
    arrival_time: String,
    duration: String,
    gate_number: String,
    economy_price: { type: Number, required: true },
    business_price: { type: Number, required: true },
    first_class_price: { type: Number, required: true },
    status: { type: String, required: true, enum: ['On-Time', 'Delayed', 'Canceled'] },
});

export const Schedule = mongoose.model("Schedule", ScheduleSchema);