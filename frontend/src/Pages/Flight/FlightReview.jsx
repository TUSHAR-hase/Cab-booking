import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, CheckCircle, Clock, PlaneTakeoff, Ticket, User, Mail, Calendar, CreditCard 
} from "lucide-react";

export default function FlightReviewPage() {
  const [passengers, setPassengers] = useState([{ id: 1, name: "", email: "", age: "" }]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const addPassenger = () => {
    setPassengers([...passengers, { id: passengers.length + 1, name: "", email: "", age: "" }]);
  };

  const removePassenger = (id) => {
    setPassengers(passengers.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white font-[Poppins] p-6">
      <div className="w-full max-w-4xl bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-xl p-6">
        
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-6 text-red-500 tracking-wide">Flight Review</h1>

        {/* Flight Details */}
        <div className="border border-[#222] bg-[#111] p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-400 flex items-center gap-2">
            <PlaneTakeoff size={22} /> Flight Details
          </h2>
          <div className="grid grid-cols-2 gap-6 text-lg">
            {[
              ["Flight Name", "AI-202", Ticket],
              ["Airline", "Air India", PlaneTakeoff],
              ["Departure", "New Delhi (DEL)", Calendar],
              ["Destination", "Mumbai (BOM)", Calendar],
              ["Departure Time", "10:30 AM", Clock],
              ["Arrival Time", "12:45 PM", Clock],
              ["Gate", "A12", Ticket],
              ["Seat", "15A", User],
              ["Class", "Economy", User],
              [
                "Status",
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle size={18} /> On Time
                </span>,
                CheckCircle,
              ],
              ["Amount", "₹5,200", Ticket],
            ].map(([label, value, Icon], index) => (
              <div key={index} className="flex items-center gap-3">
                <Icon size={20} className="text-red-500" />
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passenger Details */}
        <h2 className="text-2xl font-semibold mb-4 text-red-400 flex items-center gap-2">
          <User size={22} /> Passenger Details
        </h2>

        {passengers.map((passenger, index) => (
          <div key={passenger.id} className="border border-[#222] bg-[#111] p-4 rounded-lg shadow-sm mb-4">
            <div className="flex gap-3">
              {/* Name Field */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 border border-[#333] bg-[#000] text-white rounded-md placeholder-gray-500 
                  focus:border-red-500 outline-none"
                />
                <User className="absolute top-3 right-3 text-gray-400" size={18} />
              </div>

              {/* Email Field */}
              <div className="relative w-full">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border border-[#333] bg-[#000] text-white rounded-md placeholder-gray-500 
                  focus:border-red-500 outline-none"
                />
                <Mail className="absolute top-3 right-3 text-gray-400" size={18} />
              </div>

              {/* Age Field (Now a Text Field) */}
              <div className="relative w-50">
                <input
                  type="text"
                  placeholder="Age"
                  className="w-full p-3 border border-[#333] bg-[#000] text-white rounded-md placeholder-gray-500 
                  focus:border-red-500 outline-none"
                />
                <Calendar className="absolute top-3 right-3 text-gray-400" size={18} />
              </div>

              {/* Remove Passenger Button */}
              {passengers.length > 1 && (
                <button
                  className="bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition"
                  onClick={() => removePassenger(passenger.id)}
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add Passenger Button */}
        <button
          className="w-44 bg-red-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 
          hover:bg-red-600 transition-all duration-300 text-lg font-semibold mt-4"
          onClick={addPassenger}
        >
          <Plus size={22} />
          Add Passenger
        </button>

        {/* Pay Now Button */}
        <button
          className="w-52 h-14 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg flex items-center justify-center gap-3 
          hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 
          active:scale-95 active:bg-green-600 text-lg font-semibold mt-6 mx-auto"
        >
          <CreditCard size={24} />
          Pay Now
        </button>
      </div>
    </div>
  );
}
