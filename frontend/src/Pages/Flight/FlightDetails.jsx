import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlaneTakeoff,
  PlaneLanding,
  Timer,
  BadgePercent,
  CalendarDays,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const FlightDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "Mumbai";
  const to = searchParams.get("to") || "Delhi";
  const date = searchParams.get("date") || "2025-02-20";
  const [selectedClass, setSelectedClass] = useState(null);
  const [flights, setFlights] = useState([]);
  const [filter, setFilter] = useState("price-low");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    // Fetch initial flights data
    const fetchFlights = async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/flight/search-flight?departure_station=${from}&destination_station=${to}&departure_time=${date}`
      ); // Replace with your actual API endpoint
      setFlights(response.data.data);
    };

    fetchFlights();
  }, []);

  const parseDuration = (duration) => {
    const parts = duration.match(/(\d+)h\s*(\d*)m?/);
    const hours = parts ? parseInt(parts[1]) : 0;
    const minutes = parts && parts[2] ? parseInt(parts[2]) : 0;
    return hours * 60 + minutes;
  };

  const handleBookNow = (flight) => {
    setSelectedFlight(flight);
    setShowDialog(true);
  };

  const handleClassSelection = async (classType) => {
    // Check seat availability for selected class
    if (selectedFlight.seatsByClass[classType].available === 0) {
      alert(`Sorry, no seats available for ${classType} class!`);
    }

    // If seats are available, proceed with the booking
    console.log(`Booking ${classType} class for ${selectedFlight}`);

    console.log(selectedFlight);

    // You can add logic here to handle the booking process

    if (Cookies.get("token")) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/flight/book-flight`,
        {
          schedule_id: selectedFlight.scheduleId,
          classType,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            ContentType: "application/json",
          },
        }
      );

      console.log(response.data);

      const order = response.data.data.order;

      if (response.data.statusCode === 201) {
        const options = {
          key: "rzp_test_ChC1v5xGnKuucU", // from Razorpay Dashboard
          amount: order.amount,
          currency: order.currency,
          name: "Booking Hub",
          description: "Payment for flight booking",
          order_id: order.id,
          handler: function (response) {
            alert(
              `Booking successful! Payment ID: ${response.razorpay_payment_id}`
            );
            // Optionally send response to backend to verify payment
          },
          prefill: {
            name: "John Doe",
            email: "john@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        console.log(rzp);
        console.log(options);
        rzp.open();
      } else {
        alert(response.data.message);
      }
    } else {
      navigate("/login");
    }

    setSelectedClass(classType);
    setShowDialog(false);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white font-[Poppins]">
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

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 px-4">
        {[
          { label: "Price (Low)", value: "price-low" },
          { label: "Price (High)", value: "price-high" },
          { label: "Duration (Short)", value: "duration-short" },
          { label: "Duration (Long)", value: "duration-long" },
          { label: "Seats (More)", value: "seats-more" },
          { label: "Seats (Less)", value: "seats-less" },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 rounded-full border transition-all ${
              filter === btn.value
                ? "bg-red-500 text-white border-red-600"
                : "bg-transparent text-gray-400 border-gray-600 hover:bg-gray-800"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Flight Cards */}
      <div className="px-6 md:px-16 py-10">
        {flights.map((flight) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1a1a1a] p-8 md:p-10 rounded-2xl shadow-lg mb-8 hover:scale-[1.02] hover:shadow-2xl border border-gray-800"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold">{flight.airline}</h2>
              <p className="text-red-400 font-semibold flex items-center gap-2 bg-red-900 bg-opacity-30 px-4 py-2 rounded-lg text-lg">
                <BadgePercent size={24} /> {flight.discount}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-gray-300 text-lg">
              <div className="flex items-center gap-4">
                <PlaneTakeoff size={30} className="text-red-500" />
                <span className="font-medium">
                  Departure: <strong>{flight.departureTime}</strong>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <PlaneLanding size={30} className="text-red-500" />
                <span className="font-medium">
                  Arrival: <strong>{flight.arrivalTime}</strong>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Timer size={30} className="text-red-500" />
                <span className="font-medium">
                  Duration: <strong>{flight.duration}</strong>
                </span>
              </div>
            </div>

            <div className="mt-6 text-gray-200">
              <h3 className="text-xl font-bold">Available Seats:</h3>
              <ul className="space-y-4 mt-4">
                {["economy", "business", "first"].map((classType) => (
                  <li key={classType} className="flex justify-between">
                    <span className="font-medium capitalize">
                      {classType} class
                    </span>
                    <span
                      className={`text-lg ${
                        flight.seatsByClass[classType].available > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {flight.seatsByClass[classType].available} seats available
                    </span>
                    <span className="text-lg text-red-500 font-semibold">
                      ₹{flight.seatsByClass[classType].price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={() => handleBookNow(flight)}
                className="bg-red-500 text-white rounded-xl py-2 px-6 font-semibold text-lg transition-all hover:bg-red-600"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Dialog */}
      {showDialog && selectedFlight && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl text-black w-96">
            <h2 className="text-3xl font-semibold mb-4">
              Select a Class for Booking
            </h2>
            <div className="space-y-4">
              {["economy", "business", "first"].map((classType) => (
                <button
                  key={classType}
                  onClick={() => handleClassSelection(classType)}
                  className="w-full text-center bg-red-500 text-white py-3 rounded-lg text-xl hover:bg-red-600"
                >
                  {classType.charAt(0).toUpperCase() + classType.slice(1)} - ₹
                  {selectedFlight.seatsByClass[classType].price}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDialog(false)}
              className="mt-4 w-full text-center text-gray-400 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDetails;
