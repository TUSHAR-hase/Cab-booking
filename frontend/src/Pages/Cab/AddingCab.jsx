import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Tag, FileText, DollarSign, CreditCard, Calendar } from "lucide-react";
import { BASE_URL } from "../../../config";
import { jwtDecode } from "jwt-decode"; 

const AddVehicle = () => {
  const navigate = useNavigate();
  const [rider_id,setriderid]=useState()

  
  console.log(rider_id)
  const [vehicle, setVehicle] = useState({
    vehicle_type: "",
    vehicle_model: "",
    vehicle_number: "",
    perKm_price: "",
    seating_capacity: "",
    description: "",
    Rider_id:null
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("ridertoken");  
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        setriderid(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (rider_id) {
      setVehicle((prev) => ({ ...prev, Rider_id: rider_id }));
    }
  }, [rider_id]); 
  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !vehicle.vehicle_type ||
      !vehicle.vehicle_model ||
      !vehicle.vehicle_number ||
      !vehicle.perKm_price ||
      !vehicle.seating_capacity
    ) {
      alert("Please fill all required fields!");
      return;
    }
    setLoading(true);
 try {
  const res = await fetch(`${BASE_URL}/api/Rv/vehicle/createvehicle`, {
    method:"POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehicle )

  });
  console.log("Full Response:", res);
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  const data = await res.json();

  console.log("Response Data:", data);
  if (data) {
    
    setTimeout(() => {
      alert("Vehicle added successfully!");
      navigate("/booking/riderdashboard/");
    }, 2000);
  }
 } catch (e) {
  console.log(e)
 }finally {
  setLoading(false); // Ensure loading is turned off after the request
}
    // console.log(data);
    

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-gray-800"
      >
        <h1 className="text-4xl font-extrabold text-red-500 text-center mb-6">
          Add Vehicle Details
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Car Type */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
            <Car size={24} className="text-red-500" />
            <input
              type="text"
              name="vehicle_type"
              placeholder="Car Type (e.g., Sedan, SUV, Hatchback)"
              className="w-full bg-transparent text-white outline-none placeholder-gray-400"
              value={vehicle.vehicle_type}
              onChange={handleChange}
              required
            />
          </div>

          {/* Model */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
            <Tag size={24} className="text-red-500" />
            <input
              type="text"
              name="vehicle_model"
              placeholder="model(2000,2005,2015...etc)"
              className="w-full bg-transparent text-white outline-none placeholder-gray-400"
              value={vehicle.vehicle_model}
              onChange={handleChange}
              required
            />
          </div>

          {/* Registration Number */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
            <CreditCard size={24} className="text-red-500" />
            <input
              type="text"
              name="vehicle_number"
              placeholder="Enter Vehicle Number"
              className="w-full bg-transparent text-white outline-none placeholder-gray-400"
              value={vehicle.vehicle_number}
              onChange={handleChange}
              required
            />
          </div>

          {/* Price per km */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
            <DollarSign size={24} className="text-red-500" />
            <input
              type="text"
              name="perKm_price"
              placeholder="Price per km"
              className="w-full bg-transparent text-white outline-none placeholder-gray-400"
              value={vehicle.perKm_price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Insurance Expiry Date */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
            <Calendar size={24} className="text-red-500" />
            <input
              type="string"
              name="seating_capacity"
              placeholder="Enter seat-capacity"
              className="w-full bg-transparent text-white outline-none placeholder-gray-400"
              value={vehicle.seating_capacity}
              onChange={handleChange}
            />
          </div>

          {/* Additional Details */}
          <div className="flex items-start gap-3 bg-gray-800 p-3 rounded-lg">
            <FileText size={24} className="text-red-500 mt-2" />
            <textarea
              name="description"
              placeholder="Additional details (optional)"
              className="w-full bg-transparent text-white outline-none placeholder-gray-400 resize-none h-20"
              value={vehicle.description}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button (Only element with hover effects) */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold rounded-xl bg-red-500 text-black shadow-md transition-all hover:bg-red-600 hover:shadow-lg active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Adding Vehicle..." : "Add Vehicle"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddVehicle;