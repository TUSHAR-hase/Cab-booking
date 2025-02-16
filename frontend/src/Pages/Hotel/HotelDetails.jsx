import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, BedDouble, BadgePercent, Users, Star } from "lucide-react";

const HotelDetails = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "Mumbai";
  const checkIn = searchParams.get("checkIn") || "2025-02-20";
  const checkOut = searchParams.get("checkOut") || "2025-02-25";

  const [hotels, setHotels] = useState([]);
  const [filter, setFilter] = useState("price-low");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const dummyHotels = [
      {
        id: 1,
        name: "The Grand Mumbai",
        price: 4000,
        rating: 4.5,
        discount: "20% OFF",
        location: "Mumbai Central",
        totalRooms: 100,
        availableRooms: 30,
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      },
      {
        id: 2,
        name: "Luxury Stay Delhi",
        price: 7000,
        rating: 4.8,
        discount: "15% OFF",
        location: "Connaught Place",
        totalRooms: 80,
        availableRooms: 20,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
      },
      {
        id: 3,
        name: "Comfort Inn Bangalore",
        price: 3000,
        rating: 4.2,
        discount: "10% OFF",
        location: "Indiranagar",
        totalRooms: 120,
        availableRooms: 50,
        image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
      }
    ];

    let sortedHotels = [...dummyHotels];

    if (filter === "price-low") {
      sortedHotels.sort((a, b) => a.price - b.price);
    } else if (filter === "price-high") {
      sortedHotels.sort((a, b) => b.price - a.price);
    } else if (filter === "rating-high") {
      sortedHotels.sort((a, b) => b.rating - a.rating);
    } else if (filter === "rooms-more") {
      sortedHotels.sort((a, b) => b.availableRooms - a.availableRooms);
    }

    setHotels(sortedHotels);
  }, [filter]);

  return (
    <div className="min-h-screen w-full bg-black text-white font-[Poppins]">
      <motion.div className="p-6 md:p-12 text-center">
        <h1 className="text-5xl font-extrabold text-red-500">Hotels in {location}</h1>
        <p className="text-gray-300 text-xl flex items-center justify-center gap-2 mt-2">
          <CalendarDays size={24} className="text-red-500" /> {checkIn} - {checkOut}
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        {["price-low", "price-high", "rating-high", "rooms-more"].map((value, index) => (
          <button
            key={index}
            onClick={() => setFilter(value)}
            className={`px-6 py-3 text-lg rounded-lg transition-all duration-300 ${
              filter === value ? "bg-red-500 text-black shadow-md" : "bg-gray-800 text-white hover:bg-red-500 hover:text-black"
            }`}
          >
            {value.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div className="px-6 md:px-16 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel) => (
          <motion.div
            key={hotel.id}
            className="relative bg-[#1a1a1a] rounded-2xl shadow-lg overflow-hidden border border-gray-800 hover:scale-105 transition-all"
          >
            <div className="relative">
              <img src={hotel.image} alt={hotel.name} className="w-full h-52 object-cover" />
              <p className="absolute top-3 right-3 bg-red-500 bg-opacity-50 text-white text-sm font-semibold px-3 py-1 rounded-md">
                <BadgePercent size={14} className="inline-block mr-1" /> {hotel.discount}
              </p>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">{hotel.name}</h2>
              <p className="text-gray-400 flex items-center gap-2"><MapPin size={20} className="text-red-500" /> {hotel.location}</p>
              <p className="text-gray-400 flex items-center gap-2 mt-2"><Star size={20} className="text-yellow-400" /> {hotel.rating}</p>
              <p className="text-gray-400 flex items-center gap-2 mt-2"><BedDouble size={20} className="text-blue-400" /> {hotel.availableRooms} Available</p>
              <p className="text-xl font-bold text-red-500 mt-4">₹{hotel.price} / Night</p>
              <button className="mt-4 px-6 py-3 bg-red-500 text-black text-lg font-semibold rounded-lg hover:bg-red-600 transition-all w-full">
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HotelDetails;
