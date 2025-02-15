import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar } from "lucide-react";

const FlightSearch = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleSearch = () => {
    if (from && to && date) {
      navigate(`/flights?from=${from}&to=${to}&date=${date}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white font-[Poppins] p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-red-500"
      >
        <h1 className="text-4xl font-bold text-red-500 mb-6 text-center uppercase tracking-wider">
          Search Flights
        </h1>
        <div className="space-y-6">
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-red-500 hover:shadow-lg hover:shadow-red-500 transition duration-300">
            <MapPin size={24} className="text-red-500 mr-3" />
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none text-lg"
            />
          </div>
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-red-500 hover:shadow-lg hover:shadow-red-500 transition duration-300">
            <MapPin size={24} className="text-red-500 mr-3" />
            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none text-lg"
            />
          </div>
          <div className="flex items-center bg-black border border-red-500 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-red-500 hover:shadow-lg hover:shadow-red-500 transition duration-300">
            <Calendar size={24} className="text-red-500 mr-3" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center bg-red-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg  text-lg"
          >
            <Search size={24} className="mr-2" /> Search
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FlightSearch;