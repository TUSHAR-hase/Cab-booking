import mongoose from "mongoose";
const ScheduleSchema = new mongoose.Schema({
    flight_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    departure_station: String,
    destination_station: String,
    departure_time: Date,
    arrival_time: Date,
    duration: String,
    gate_number: String,
});

export const Schedule = mongoose.model("Schedule", ScheduleSchema);