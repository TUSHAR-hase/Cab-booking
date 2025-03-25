import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const RiderSchema=new mongoose.Schema({
    name:{type:String,require:true},
    licence_number:{type:String,require:true,unique:true},
   email:{type:String,unique:true,require:true},
   address:{type:String,require:true},
   phone:{type:String,unique:true,require:true},
   password:{type:String,require:true},
   conformpassword:{type:String,require:true},
 

   
    is_approved: { type: Boolean, default: false },
    is_available: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})
RiderSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
export const Rider=mongoose.model('Riders',RiderSchema)||mongoose.models.Riders;