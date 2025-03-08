import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, X } from "lucide-react";
import CarRentalUI from "./CarRentalUI";

const CabDetails = () => {
  const [searchParams] = useSearchParams();
  const [seatFilter, setSeatFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [selectedCab, setSelectedCab] = useState(null); // State for selected cab

  const dummyCabs = useMemo(
    () => [
      {
        id: 1,
        cabName: "Sedan - XYZ123",
        perkmprice: 12,
        type: "Sedan",
        totalSeats: 4,
        driver: "John Doe",
        rating: 4.8,
      },
      {
        id: 2,
        cabName: "SUV - ABC456",
        perkmprice: 15,
        type: "SUV",
        totalSeats: 6,
        driver: "Alice Smith",
        rating: 4.5,
      },
      {
        id: 3,
        cabName: "Hatchback - LMN789",
        perkmprice: 10,
        type: "Hatchback",
        totalSeats: 4,
        driver: "Michael Brown",
        rating: 4.2,
      },
    ],
    []
  );

  const filteredCabs = useMemo(
    () =>
      dummyCabs.filter((cab) => {
        const seatMatch = !seatFilter || cab.totalSeats >= parseInt(seatFilter);
        const modelMatch =
          !modelFilter ||
          cab.type.toLowerCase().includes(modelFilter.toLowerCase());
        return seatMatch && modelMatch;
      }),
    [seatFilter, modelFilter, dummyCabs]
  );

  return (
    <div className="min-h-screen w-full bg-black text-white font-[Poppins]">
      {/* Hero Section with Search */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[85vh] w-full overflow-hidden"
      >
        <motion.img
          src="https://i.pinimg.com/736x/eb/ba/ba/ebbaba49e0acdf2ef594c5c8b5721a5c.jpg"
          alt="Cab booking background"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <div className="absolute inset-0 bg-black/60 flex flex-col items-center pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-6xl px-4 mt-8"
          >
            <div className="bg-black-400/80 backdrop-blur-none rounded-xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seats Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Seats Needed
                  </label>
                  <select
                    value={seatFilter}
                    onChange={(e) => setSeatFilter(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 text-white border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  >
                    <option value="" className="bg-gray-600">
                      Select Seats
                    </option>
                    <option value="2" className="bg-gray-600">
                      2+ Seats
                    </option>
                    <option value="4" className="bg-gray-600">
                      4+ Seats
                    </option>
                    <option value="6" className="bg-gray-600">
                      6+ Seats
                    </option>
                  </select>
                </div>

                {/* Model Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Cab Type
                  </label>
                  <input
                    type="text"
                    placeholder="Search by model (e.g., SUV)"
                    value={modelFilter}
                    onChange={(e) => setModelFilter(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 text-white border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Available Cabs */}
      {(seatFilter || modelFilter) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 py-20 -mt-20 relative z-10"
        >
          <div className="rounded-xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-red-500 mb-8">
              Available Cabs ({filteredCabs.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCabs.map((cab) => (
                <motion.div
                  key={cab.id}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{cab.cabName}</h3>
                      <p className="text-red-400 text-sm mt-1">{cab.type}</p>
                    </div>
                    <p className="text-red-500 font-bold text-xl">
                      ₹{cab.perkmprice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Users size={18} />
                      <span>{cab.totalSeats} Seats</span>
                    </div>

                    {/* Book Button - Opens Popover */}
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#dc2626" }}
                      whileTap={{ scale: 0.9 }}
                      className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg transition-all duration-200"
                      onClick={() => setSelectedCab(cab)}
                    >
                      Book
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCabs.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No cabs found matching your criteria
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Popover for Booking Details */}
      {selectedCab && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Cab Details</h3>
              <button
                onClick={() => setSelectedCab(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-300">Cab Name: {selectedCab.cabName}</p>
            <p className="text-gray-300">Type: {selectedCab.type}</p>
            <p className="text-gray-300">Seats: {selectedCab.totalSeats}</p>
            <p className="text-gray-300">Driver: {selectedCab.driver}</p>
            <p className="text-gray-300">Rating: ⭐ {selectedCab.rating}</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-red-400 font-bold">
                Price: ₹{selectedCab.perkmprice} per km
              </p>
              <button className="bg-red-500 text-white px-4 py-2 rounded">
                Confirm
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Car Rental UI */}
      <CarRentalUI />
    </div>
  );
};

export default CabDetails;
