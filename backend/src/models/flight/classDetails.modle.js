import mongoose from "mongoose";

const ClassDetailsSchema = new mongoose.Schema({
    class_name: String,
    flight_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    amount: Number,
    discount: Number,
    max_seat: Number,
});

export const ClassDetails = mongoose.model("ClassDetails", ClassDetailsSchema);