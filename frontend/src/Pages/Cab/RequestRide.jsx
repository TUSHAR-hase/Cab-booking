import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, MapPin, CalendarDays, Clock, User, PhoneCall } from "lucide-react";

const RequestRide = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const driverName = searchParams.get("driver") || "John Doe";
  const pickup = searchParams.get("pickup") || "Connaught Place, Delhi";
  const dropoff = searchParams.get("dropoff") || "Indira Gandhi International Airport";
  const date = searchParams.get("date") || "2025-02-20";
  const time = searchParams.get("time") || "10:00 AM";
  const price = searchParams.get("price") || "₹1200";
  const contact = searchParams.get("contact") || "+91 9876543210";

  const handleConfirmRide = () => {
    setLoading(true);
    setTimeout(() => {
      alert(`Ride request sent to ${driverName}!`);
      navigate("/my-rides"); // Navigate to My Rides page after confirmation
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-[#1a1a1a] p-8 md:p-12 rounded-2xl shadow-xl border border-gray-800"
      >
        <h1 className="text-4xl font-extrabold text-red-500 text-center">
          Confirm Your Ride
        </h1>

        {/* Driver Details */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User size={28} className="text-red-500" /> {driverName}
          </h2>
          <p className="text-gray-400 flex items-center gap-2">
            <PhoneCall size={20} className="text-red-500" /> {contact}
          </p>
        </div>

        {/* Ride Details */}
        <div className="mt-6 space-y-4 text-lg">
          <p className="flex items-center gap-3">
            <MapPin size={24} className="text-red-500" /> <strong>Pickup:</strong> {pickup}
          </p>
          <p className="flex items-center gap-3">
            <MapPin size={24} className="text-red-500" /> <strong>Dropoff:</strong> {dropoff}
          </p>
          <p className="flex items-center gap-3">
            <CalendarDays size={24} className="text-red-500" /> <strong>Date:</strong> {date}
          </p>
          <p className="flex items-center gap-3">
            <Clock size={24} className="text-red-500" /> <strong>Time:</strong> {time}
          </p>
          <p className="flex items-center gap-3 text-2xl font-extrabold text-red-500">
            <Car size={28} /> {price}
          </p>
        </div>

        {/* Confirm Ride Button */}
        <button
          onClick={handleConfirmRide}
          disabled={loading}
          className="mt-6 w-full py-3 text-lg font-semibold rounded-xl bg-red-500 text-black shadow-md transition-all hover:bg-red-600 hover:shadow-lg active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? "Sending Request..." : "Confirm Ride"}
        </button>
      </motion.div>
    </div>
  );
};

export default RequestRide;



