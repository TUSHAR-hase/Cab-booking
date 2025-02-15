import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlaneTakeoff,
  PlaneLanding,
  Timer,
  Users,
  CheckCircle,
  CalendarDays,
  AlarmClock,
  MapPin,
  BadgePercent,
} from "lucide-react";

const FlightDetails = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "Mumbai";
  const to = searchParams.get("to") || "Delhi";
  const date = searchParams.get("date") || "2025-02-20";

  const [flights, setFlights] = useState([]);
  const [filter, setFilter] = useState("price-low");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const dummyFlights = [
      {
        id: 1,
        airline: "Air India",
        price: 5000,
        class: "Economy",
        duration: "2h 30m",
        discount: "10% OFF",
        departureStation: "Mumbai",
        departureTime: "10:00 AM",
        arrivalTime: "12:30 PM",
        totalSeats: 150,
        remainingSeats: 50,
      },
      {
        id: 2,
        airline: "IndiGo",
        price: 4000,
        class: "Business",
        duration: "1h 50m",
        discount: "15% OFF",
        departureStation: "Delhi",
        departureTime: "12:30 PM",
        arrivalTime: "2:20 PM",
        totalSeats: 180,
        remainingSeats: 80,
      },
      {
        id: 3,
        airline: "Vistara",
        price: 7000,
        class: "Economy",
        duration: "2h 10m",
        discount: "5% OFF",
        departureStation: "Bangalore",
        departureTime: "3:15 PM",
        arrivalTime: "5:25 PM",
        totalSeats: 160,
        remainingSeats: 60,
      },
    ];
  
    let sortedFlights = [...dummyFlights];
  
    if (filter === "price-low") {
      sortedFlights.sort((a, b) => a.price - b.price);
    } else if (filter === "price-high") {
      sortedFlights.sort((a, b) => b.price - a.price);
    } else if (filter === "duration-short") {
      sortedFlights.sort((a, b) => {
        const timeA = parseDuration(a.duration);
        const timeB = parseDuration(b.duration);
        return timeA - timeB;
      });
    } else if (filter === "duration-long") {
      sortedFlights.sort((a, b) => {
        const timeA = parseDuration(a.duration);
        const timeB = parseDuration(b.duration);
        return timeB - timeA;
      });
    } else if (filter === "seats-more") {
      sortedFlights.sort((a, b) => b.remainingSeats - a.remainingSeats);
    } else if (filter === "seats-less") {
      sortedFlights.sort((a, b) => a.remainingSeats - b.remainingSeats);
    }
  
    setFlights(sortedFlights);
  }, [filter]);
  
  // Helper function to convert "2h 30m" into total minutes
  const parseDuration = (duration) => {
    const parts = duration.match(/(\d+)h\s*(\d*)m?/);
    const hours = parts ? parseInt(parts[1]) : 0;
    const minutes = parts && parts[2] ? parseInt(parts[2]) : 0;
    return hours * 60 + minutes;
  };
  

  return (
    <div className="min-h-screen w-full bg-black text-white font-[Poppins]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-12 text-center"
      >
        <h1 className="text-5xl font-extrabold text-red-500">
          Flights from {from} to {to}
        </h1>
        <p className="text-gray-300 text-xl flex items-center justify-center gap-2 mt-2">
          <CalendarDays size={24} className="text-red-500" /> {date}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
  {/* Price Filters */}
  <button
    onClick={() => setFilter("price-low")}
    className={`px-6 py-3 text-lg rounded-lg transition-all duration-300 ${
      filter === "price-low"
        ? "bg-red-500 text-black shadow-md"
        : "bg-gray-800 text-white hover:bg-red-500 hover:text-black"
    }`}
  >
    Price Low to High
  </button>
  <button
    onClick={() => setFilter("price-high")}
    className={`px-6 py-3 text-lg rounded-lg transition-all duration-300 ${
      filter === "price-high"
        ? "bg-red-500 text-black shadow-md"
        : "bg-gray-800 text-white hover:bg-red-500 hover:text-black"
    }`}
  >
    Price High to Low
  </button>

  {/* Duration Filters */}
  <button
    onClick={() => setFilter("duration-short")}
    className={`px-6 py-3 text-lg rounded-lg transition-all duration-300 ${
      filter === "duration-short"
        ? "bg-red-500 text-black shadow-md"
        : "bg-gray-800 text-white hover:bg-red-500 hover:text-black"
    }`}
  >
    Shortest Duration
  </button>
  <button
    onClick={() => setFilter("duration-long")}
    className={`px-6 py-3 text-lg rounded-lg transition-all duration-300 ${
      filter === "duration-long"
        ? "bg-red-500 text-black shadow-md"
        : "bg-gray-800 text-white hover:bg-red-500 hover:text-black"
    }`}
  >
    Longest Duration
  </button>

  {/* Seat Availability Filters */}
  <button
    onClick={() => setFilter("seats-more")}
    className={`px-6 py-3 text-lg rounded-lg transition-all duration-300 ${
      filter === "seats-more"
        ? "bg-red-500 text-black shadow-md"
        : "bg-gray-800 text-white hover:bg-red-500 hover:text-black"
    }`}
  >
    More Seats First
  </button>
  <button
    onClick={() => setFilter("seats-less")}
    className={`px-6 py-3 text-lg rounded-lg transition-all duration-300 ${
      filter === "seats-less"
        ? "bg-red-500 text-black shadow-md"
        : "bg-gray-800 text-white hover:bg-red-500 hover:text-black"
    }`}
  >
    Less Seats First
  </button>
</div>


      {/* Flight Cards */}
      <div className="px-6 md:px-16 py-10">
  {flights.map((flight) => (
    <motion.div
      key={flight.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a1a] p-8 md:p-10 rounded-2xl shadow-lg mb-8 transition-all hover:scale-[1.02] hover:shadow-2xl border border-gray-800"
    >
      {/* Flight Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-bold text-white tracking-wide">{flight.airline}</h2>
        <p className="text-red-400 font-semibold flex items-center gap-2 bg-red-900 bg-opacity-30 px-4 py-2 rounded-lg text-lg">
          <BadgePercent size={24} /> {flight.discount}
        </p>
      </div>

      {/* Flight Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-gray-300 text-lg">
        <div className="flex items-center gap-4">
          <PlaneTakeoff size={30} className="text-red-500" />
          <span className="font-medium">Departure: <strong>{flight.departureTime}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <PlaneLanding size={30} className="text-red-500" />
          <span className="font-medium">Arrival: <strong>{flight.arrivalTime}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <Timer size={30} className="text-red-500" />
          <span className="font-medium">Duration: <strong>{flight.duration}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <MapPin size={30} className="text-red-500" />
          <span className="font-medium">From: <strong>{flight.departureStation}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <Users size={30} className="text-red-500" />
          <span className="font-medium">Total Seats: <strong>{flight.totalSeats}</strong></span>
        </div>
        <div className="flex items-center gap-4">
          <CheckCircle size={30} className="text-red-500" />
          <span className="font-medium">Available: <strong>{flight.remainingSeats}</strong></span>
        </div>
      </div>

      {/* Price & Booking */}
      <div className="flex justify-between items-center mt-8">
        <p className="text-3xl font-extrabold text-red-500 tracking-wide">₹{flight.price}</p>
        <button className="px-10 py-3 bg-red-500 text-black text-lg font-semibold rounded-xl hover:bg-red-600 transition-all shadow-md hover:shadow-lg active:scale-95">
          Book Now
        </button>
      </div>
    </motion.div>
  ))}
</div>


    </div>
  );
};

export default FlightDetails;
