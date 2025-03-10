import mongoose from "mongoose";


const vehicleSchema=new mongoose.Schema({
    vehicle_number: { type: String, required: true},
      Rider_id:{type:mongoose.Schema.Types.ObjectId,ref:"Rider",require:true},
    vehicle_type: { type: String, required: true }, // Sedan, SUV, etc.
    seating_capacity: { type: String,require:true  },
    perKm_price:{type:String,require:true},
    vehicle_image: { type: String, }, // Store image URL
    vehicle_model:{type:String},
    is_booked: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})
 export const Vehicle =mongoose.models.Vehicles|| mongoose.model('Vehicles', vehicleSchema);
 