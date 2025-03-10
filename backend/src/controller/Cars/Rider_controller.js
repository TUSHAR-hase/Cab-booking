import bcrypt from "bcryptjs";
import { Rider } from "../../models/Cabs/cab_rider_model.js";





import {ApiResponse} from "../../utils/apiResponse.js"




import jwt from "jsonwebtoken";
const genarate_token =user=>{ 
  return jwt.sign({ id:user._id,role:user.role}, process.env.SECRET_KEY, {
  expiresIn: "5d",
})}

export const add_rider = async (req, resp) => {
  try {
      console.log('Register endpoint hit');
      const { email, password, name, conformpassword,licence_number, phone,address} = req.body;
      console.log('Request data:', req.body);

      let existingUser = await Rider.findOne({ email }) 

      if (existingUser) {
          return resp.status(400).json({ message: "User already exists" });
      }
      console.log("Plain Password:", password);
      // const hashedPassword = await bcrypt.hash(password.trim(), 10);
      // console.log("Hashed Password Before Storing:", hashedPassword);
     

       
       let user = new Rider(req.body)
      

      await user.save();
      return resp.status(201).json({ message: "User created successfully", user });

  } catch (error) {
      console.error(error);
      return resp.status(500).json({ message: "Error creating user", error });
  }
};
export const getRider = async (req, res) => {
    try {
        const Riders = await Rider.find();
        if (Riders) {
            res.status(200).json(Riders)
        }
    } catch (error) {
        res.status(500).json(error)

    }
}
export const getRidersByid = async (req, res) => {
    try {
        const rider = await Rider.findById(res.params.id)
        if (!rider) {
            res.status(500).json({ message: "Rider not found" })
        } else {
            res.status(200).json(rider)
        }
    } catch (error) {
        res.status(500).json(error)

    }
}
export const update_Rider = async (req, res) => {
    try {
        const updateRider = await Rider.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updateRider) return res.status(404).json({ message: "rider not found" });
        res.status(200).json(updateRider);
    } catch (error) {
        res.status(500).json(error)
    }
}
export const delate_Rider = async (req, res) => {
    try {
        const delateRider = await Rider.findByIdAndDelete(req.params.id)
        if (!delateRider) return res.status(404).json({ message: "Rider not found" });
        res.status(200).json({ message: "rider deleted successfully" });
    } catch (error) {
        res.status(500).json(error)
    }
}

const verifyOtp = async (req, res) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  const { email, otp } = req.body;

  const user = await Rider.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  if (user.isVerifiedOtp) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User already verified"));
  }

  if (user.otp !== otp) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid OTP"));
  }

  user.isVerifiedOtp = true;
  await Rider.save();

  const token = jwt.sign({ user }, SECRET_KEY);

  res
    .status(200)
    .json(new ApiResponse(200, token, "User verified successfully"));
};

export const loginrider = async (req, res) => {
  try {
      const { email, password } = req.body;
      console.log("Login attempt:", email); 

      let user = await Rider.findOne({ email }) 
               
        console.log(user)
      console.log("Stored Hashed Password:", user.password);
      console.log("Entered Password:", password);        
      if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
      }

      console.log("Stored Hashed Password:", user.password);
  console.log("Entered Password:", password);
     console.log(user.password)
      const isValidPassword = await bcrypt.compare(password, user.password);

      console.log("Password match:", isValidPassword);
      console.log(password.trim())
      // if(password!=user.password){
      //     return res.status(500).json({ message: "password not match" });
      // }
   

      const token = genarate_token(user);
      return res.status(200).json({ message: "Login successful", user, token });

  } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
  }
};
export {  verifyOtp};
