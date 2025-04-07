import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, X, Car, Star, Search, Lock, LogIn } from "lucide-react";
import { BASE_URL } from "../../../config";

const CabDetails = () => {
  const [searchParams] = useSearchParams();
  const [seatFilter, setSeatFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [selectedCab, setSelectedCab] = useState(null);
  const [dummyCabs, setDummyCabs] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const checkUserLogin = (id) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/booking/confirmbooking/${id}`);
    } else {
      setShowLoginPrompt(true);
    }
  };

  useEffect(() => {
    const fetchCabs = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/Rv/vehicle/getallvehicle`
        );
        const data = await response.json();
        setDummyCabs(data);
      } catch (error) {
        console.error("Error fetching cabs:", error);
      }
    };
    fetchCabs();
  }, []);

  const filteredCabs = useMemo(
    () =>
      dummyCabs.filter((cab) => {
        const seatMatch =
          !seatFilter || cab.seating_capacity >= parseInt(seatFilter);
        const modelMatch =
          !modelFilter ||
          cab.vehicle_type.toLowerCase().includes(modelFilter.toLowerCase());
        return seatMatch && modelMatch;
      }),
    [seatFilter, modelFilter, dummyCabs]
  );

  const filtersApplied = seatFilter || modelFilter;

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 font-[Poppins] p-4 md:p-8">
        <div className="relative z-10 text-center  px-6 md:px-12 mt-5 mb-8">
        <h1 className="text-red-500 text-4xl md:text-6xl font-bold">Discover Your Perfect Ride</h1>
        <p className="text-lg md:text-xl mt-3">Book cabs instantly—luxury, budget, or shared rides.</p>
        </div>
      {/* Search and Filter Section */}


      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg border border-gray-800">
          <h1 className="text-2xl font-bold text-red-500 mb-6 ">
            Find Your Perfect Cab
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Seats Filter */}
            <div className="relative">
              <label className="block text-sm text-gray-400 mb-2">
                Seats Needed
              </label>
              <div className="relative">
                <select
                  value={seatFilter}
                  onChange={(e) => setSeatFilter(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 pl-10 text-white border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Any Seats</option>
                  <option value="2">2+ Seats</option>
                  <option value="4">4+ Seats</option>
                  <option value="6">6+ Seats</option>
                  <option value="8">8+ Seats</option>
                </select>
                <Users className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Model Filter */}
            <div className="relative">
              <label className="block text-sm text-gray-400 mb-2">
                Cab Type
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="SUV, Sedan, Hatchback..."
                  value={modelFilter}
                  onChange={(e) => setModelFilter(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 pl-10 text-white border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSeatFilter("");
                  setModelFilter("");
                }}
                disabled={!filtersApplied}
                className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  filtersApplied
                    ? "bg-red-600 hover:bg-red-700 text-white border-red-700 "
                    : "bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed"
                }`}
                
              >
                <X className="w-5 h-5" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Cabs (only shown when filters are applied) */}
      {filtersApplied && (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-red-500">
              Available Cabs{" "}
              <span className="text-gray-400">({filteredCabs.length})</span>
            </h2>
            <div className="text-sm text-gray-400">
              Showing {filteredCabs.length} of {dummyCabs.length} cabs
            </div>
          </div>

          {filteredCabs.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-xl p-12 text-center border border-gray-800">
              <div className="text-gray-400 mb-4">
                No cabs found matching your criteria
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setSeatFilter("");
                    setModelFilter("");
                  }}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg flex 
    items-center justify-center gap-2 hover:bg-red-600 transition cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCabs.map((cab) => (
                <motion.div
                  key={cab._id}
                  whileHover={{ y: -5 }}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-red-500/30 transition-all shadow-lg"
                >

                  <div className="relative h-48">
                    <img
                      src={
                        cab.vehicle_image
                          ? `${BASE_URL}/${cab.vehicle_image.replace(/\\/g, '/')}`
                          : "https://cdn.pixabay.com/photo/2017/01/20/00/30/taxi-1999478_960_720.jpg"
                      }
                      alt={cab.vehicle_type || "Cab"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        // First fallback - try another CDN image
                        e.target.src = "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        // Second fallback - inline SVG if CDN fails
                        e.target.onerror = () => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%231a1a1a'/%3E%3Ctext x='50%' y='50%' fill='%23666666' font-family='sans-serif' font-size='20' text-anchor='middle' dominant-baseline='middle'%3ECab Image%3C/text%3E%3C/svg%3E";
                        };
                      }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <div className="flex justify-between items-end">
                        <h3 className="text-lg font-bold">
                          {cab.vehicle_type}
                        </h3>
                        <div className="text-red-500 font-bold">
                          ₹{cab.perKm_price?.toLocaleString("en-IN")}/km
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{cab.seating_capacity} seats</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-sm">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{cab.rating || "4.5"}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <div className="text-gray-400">Number:</div>
                        <div className="font-mono">{cab.vehicle_number}</div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCab(cab)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-all"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial State (when no filters are applied) */}
      {!filtersApplied && (
        <div className="max-w-7xl mx-auto bg-[#1a1a1a] rounded-xl p-12 text-center border border-gray-800 ">
          <div className="text-gray-400 mb-4">
            <Search
              className="w-12 h-12 mx-auto text-gray-600 mb-4 hover:text-red-500 
  cursor-pointer transition-transform transform hover:scale-110 hover:rotate-12 duration-300"
            />

            <h3 className="text-xl font-medium text-gray-300 mb-2">
              Apply filters to see available cabs
            </h3>
            <p className="text-gray-500">
              Select seat capacity or cab type to find matching vehicles
            </p>
          </div>
        </div>
      )}

      {/* Cab Details Modal */}
      {selectedCab && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4"
          onClick={() => setSelectedCab(null)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-md border border-gray-800/60 overflow-hidden relative"
          >
            {/* Close button (top right) */}
            <button
              onClick={() => setSelectedCab(null)}
              className="absolute top-3 right-3 z-10  hover:bg-gray-800/90 p-1.5 rounded-full text-gray-300 hover:text-white transition-all"
            >
              <X className="w-5 h-5 " />
            </button>

            {/* Cab Image */}
            <div className="relative h-48 w-full bg-gradient-to-br from-gray-900 to-gray-800">
              <img
                  src={
                    selectedCab.vehicle_image
                      ? `${BASE_URL}/${selectedCab.vehicle_image.replace(/\\/g, '/')}`
                      : "https://cdn.pixabay.com/photo/2017/01/20/00/30/taxi-1999478_960_720.jpg"
                  }
                alt={selectedCab.vehicle_type || "Cab"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn.pixabay.com/photo/2017/01/20/00/30/taxi-1999478_960_720.jpg";
                }}
              />

              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
            </div>

            {/* Cab Details */}
            <div className="p-5 md:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-100">
                    {selectedCab?.vehicle_type || "Premium Cab"}
                  </h3>
                  <p className="text-gray-400 text-sm font-mono mt-1">
                    {selectedCab?.vehicle_number || "XXXX XX XXXX"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-red-500 font-bold text-xl">
                    ₹{selectedCab?.perKm_price?.toLocaleString("en-IN") || "15"}
                    /km
                  </div>
                  <div className="text-xs text-gray-500">excl. taxes</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800/40">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Seats
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-gray-100">
                      {selectedCab?.seating_capacity || "4"} seats
                    </span>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800/40">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Rating
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-gray-100">
                      {selectedCab?.rating || "4.5"}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  selectedCab?._id && checkUserLogin(selectedCab._id)
                }
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/10"
              >
                <Car className="w-5 h-5" />
                <span>Book This Cab</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4"
          onClick={() => setShowLoginPrompt(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-md border border-red-800/60 overflow-hidden relative"
          >
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-4 right-4 z-10  hover:bg-gray-800 p-2 rounded-full text-gray-500 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 text-center">
              {/* Animated Lock Icon */}
              <motion.div
                className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-900/20 mb-4"
                initial={{ scale: 0.8, rotate: -15 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  },
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                  }}
                >
                  <Lock
                    className="h-10 w-10 text-red-500"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-2">
                Login Required
              </h3>
              <p className="text-gray-400 mb-6">
                You need to login to book this cab
              </p>

              <div className="flex flex-col space-y-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowLoginPrompt(false);
                    navigate("/login");
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Go to Login Page</span>
                </motion.button>

                {/*  <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-all"
                >
                  Cancel
                </motion.button>*/}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CabDetails;
