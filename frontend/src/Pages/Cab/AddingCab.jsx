import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Tag, FileText, DollarSign, CreditCard, Calendar } from "lucide-react";

const InputField = ({ icon: Icon, type, name, placeholder, value, onChange, required }) => (
  <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
    <Icon size={24} className="text-red-500" />
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full bg-transparent text-white outline-none placeholder-gray-400"
      value={value}
      onChange={onChange}
      required={required}
      aria-label={placeholder}
      aria-required={required}
    />
  </div>
);

const AddVehicle = () => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    carType: "",
    model: "",
    registrationNumber: "",
    pricePerKm: "",
    insuranceExpiry: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setVehicle((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateInputs = () => {
    const { carType, model, registrationNumber, pricePerKm } = vehicle;
    if (!carType || !model || !registrationNumber || !pricePerKm) {
      alert("Please fill all required fields!");
      return false;
    }

    // Validate registration number format (basic example)
    const regNumPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    if (!regNumPattern.test(registrationNumber)) {
      alert("Invalid registration number format!");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    setTimeout(() => {
      alert("Vehicle added successfully!");
      navigate("/my-vehicles");
    }, 2000);
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
          <InputField icon={Car} type="text" name="carType" placeholder="Car Type (e.g., Sedan, SUV)" value={vehicle.carType} onChange={handleChange} required />
          <InputField icon={Tag} type="text" name="model" placeholder="Model (e.g., Toyota Innova)" value={vehicle.model} onChange={handleChange} required />
          <InputField icon={CreditCard} type="text" name="registrationNumber" placeholder="Registration Number" value={vehicle.registrationNumber} onChange={handleChange} required />
          <InputField icon={DollarSign} type="number" name="pricePerKm" placeholder="Price per km" value={vehicle.pricePerKm} onChange={handleChange} required />

          {/* Insurance Expiry */}
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
            <Calendar size={24} className="text-red-500" />
            <input
              type="date"
              name="insuranceExpiry"
              className="w-full bg-transparent text-white outline-none placeholder-gray-400"
              value={vehicle.insuranceExpiry}
              onChange={handleChange}
              aria-label="Insurance Expiry Date"
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
              aria-label="Additional details"
            />
          </div>

          {/* Submit Button */}
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
