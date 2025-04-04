import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../config";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Car,
  Users,
  IndianRupee,
  Calendar,
  ZapOff,
  Trash2,
  X,
  Edit,
} from "lucide-react";

const ActionButtons = ({ onConfirm, onCancel, onComplete }) => (
  <div className="mt-4 flex justify-end gap-2">
    <AnimatePresence>
      {onCancel && (
        <motion.button
          onClick={onCancel}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={16} />
          Reject
        </motion.button>
      )}
      {onConfirm && (
        <motion.button
          onClick={onConfirm}
          className="px-4 py-2 bg-green-500/60 text-white rounded-lg hover:bg-green-500/80 transition-all flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CheckCircle size={16} />
          Accept
        </motion.button>
      )}
      {onComplete && (
        <motion.button
          onClick={onComplete}
          className="px-4 py-2 bg-blue-500/60 text-white rounded-lg hover:bg-blue-500/80 transition-all flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CheckCircle size={16} />
          Complete
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [rider_id, setRiderId] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [riderName, setRiderName] = useState("");
  const [rider, setrider] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [requestBookings, setRequestBookings] = useState([]);
  // const [confirmedBookings, setConfirmedBookings] = useState([]);
  // const [completedBookings, setCompletedBookings] = useState([]);
  // const [ridesCompletedToday, setRidesCompletedToday] = useState(0);

  // Existing logic for data fetching and state management remains the same
  useEffect(() => {
    if (isUpdateFormVisible) {
      // Disable body scrolling when the modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scrolling when the modal is closed
      document.body.style.overflow = "auto";
    }
    // Clean up when the component is unmounted or when `isUpdateFormVisible` changes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isUpdateFormVisible]);
  useEffect(() => {
    const token = localStorage.getItem("ridertoken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        setRiderId(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  useEffect(() => {
    if (rider_id) {
      console.log("Fetching vehicles for Rider ID:", rider_id);
      getVehicles();
      getallriderrequest();
      getrider();
    }
  }, [rider_id]);
  const getVehicles = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/Rv/vehicle/getvehiclebyriderid/${rider_id}`
      );
      const data = await res.json();
      if (!data || data.length === 0) {
        console.log("No vehicles found");
        setVehicles([]);
      } else {
        console.log("Fetched Vehicles:", data);
        setVehicles(data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };
  const deleteVehicle = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );
    if (!isConfirmed) return;
    try {
      await fetch(`${BASE_URL}/api/Rv/vehicle/delatevehicle/${id}`, {
        method: "DELETE",
      });
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };
  const showUpdateForm = (vehicle) => {
    setCurrentVehicle(vehicle);
    setIsUpdateFormVisible(true);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      vehicle_number: e.target.vehicle_number.value,
      seating_capacity: e.target.seating_capacity.value,
      perKm_price: e.target.perKm_price.value,
      vehicle_type: e.target.vehicle_type.value,
      vehicle_model: e.target.vehicle_model.value,
    };
    try {
      await fetch(
        `${BASE_URL}/api/Rv/vehicle/updatevehicle/${currentVehicle._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      setIsUpdateFormVisible(false);
      getVehicles();
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };
  const [requestBookings, setRequestBookings] = useState([]);
  const getallriderrequest = async () => {
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `${BASE_URL}/api/Rv/booking/getbooking/${rider_id}`
      );
      const data = await res.json();
      if (!data || data.length === 0) {
        console.log("No bookings found");
        setRequestBookings([]);
        setCompletedBookings([]);
        setConfirmedBookings([]);
      } else {
        console.log("Fetched requests:", data);
        const pendingBookings = data.filter((b) => b.status === "pending");
        const confirmedBookings = data.filter((b) => b.status === "accepted");
        setCompletedBookings(data.filter((b) => b.status === "completed"));
        setRequestBookings(pendingBookings);
        setConfirmedBookings(confirmedBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false); // End loading
    }
  };
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [ridesCompletedToday, setRidesCompletedToday] = useState(0);
  const updateVehicleStatus = (vehicleNumber, isBooked) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.vehicle_number === vehicleNumber ? { ...v, is_booked: isBooked } : v
      )
    );
  };
  const handleComplete = async (id) => {
    const booking = confirmedBookings.find((b) => b._id === id);
    if (!booking) return;
    try {
      await fetch(`${BASE_URL}/api/Rv/booking/completedbooking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (booking.vehicle_id) {
        // Fix vehicle reference
        updateVehicleStatus(booking.vehicle_id.vehicle_number, false);
      }
      getallriderrequest();
      setConfirmedBookings((prev) => prev.filter((b) => b._id !== id));
      setCompletedBookings((prev) => [
        ...prev,
        { ...booking, status: "completed" },
      ]);
      setRidesCompletedToday((prev) => prev + 1);
    } catch (error) {
      console.error("Error completing ride:", error);
    }
  };
  const handleAccept = async (id) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/Rv/booking/acceptbooking/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirmed" }),
        }
      );
      if (!res.ok) throw new Error("Failed to update booking status");
      const acceptedBooking = requestBookings.find((b) => b._id === id);
      if (!acceptedBooking) return;
      setRequestBookings((prev) => prev.filter((b) => b._id !== id));
      setConfirmedBookings((prev) => [
        ...prev,
        { ...acceptedBooking, status: "accepted" },
      ]);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };
  const handleReject = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/Rv/booking/rejectbooking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      setRequestBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };
  const getrider = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/Rv/Rider/getRider/${rider_id}`);
      const data = await res.json();
      // console.log(rider adat ${data})
      if (!data || data.length === 0) {
        console.log("No Rider found");
        setrider(null);
      } else {
        console.log("Fetched rider:", data);
        setrider(data.name);
        // console.log(rider adat ${rider})
      }
    } catch (error) {
      console.error("Error fetching Rider:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-[Poppins] p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-red-500 to-gray-500 bg-clip-text text-transparent">
          Welcome Back, {rider}
        </h1>
        <p className="text-gray-400 mt-2 mx-2">Manage your rides and vehicles</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: "Pending Rides",
            value: requestBookings.length,
            icon: Clock,
            color: "yellow",
          },
          {
            title: "Active Rides",
            value: confirmedBookings.length,
            icon: CheckCircle,
            color: "green",
          },
          {
            title: "Completed Today",
            value: ridesCompletedToday,
            icon: XCircle,
            color: "blue",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="p-6 rounded-2xl bg-[#1a1a1a] border border-gray-700 hover:border-${stat.color}-500 transition-colors"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-${stat.color}-500/10 rounded-full`}>
                <stat.icon
                  size={28}
                  className={`text-${stat.color}-500`}
                />
              </div>
              <div>
                <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bookings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Request Bookings */}
        <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-500/10 rounded-full">
              <Clock size={24} className="text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold">Booking Requests</h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-20 bg-gray-700/50 rounded-lg animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              ))}
            </div>
          ) : requestBookings.length === 0 ? (
            <div className="p-4 text-center text-gray-400 rounded-lg bg-gray-700/20">
              No pending requests
            </div>
          ) : (
            <div className="space-y-4">
              {requestBookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  className="p-4 bg-gray-800/100 rounded-lg border-l-4 border-yellow-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{booking.user_id?.name}</h3>
                      <div className="text-sm text-gray-400 mt-2">
                        <p>
                          {booking.source_location.address} →{" "}
                          {booking.destination_location.address}
                        </p>
                        <p className="mt-1 flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(booking.pickup_time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ActionButtons
                    onConfirm={() => handleAccept(booking._id)}
                    onCancel={() => handleReject(booking._id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmed Bookings */}
        <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/10 rounded-full">
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">Confirmed Rides</h2>
          </div>
          
          {confirmedBookings.map((booking) => (
            <motion.div
              key={booking._id}
              className="p-4 bg-gray-800/100 rounded-lg border-l-4 border-green-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{booking.user_id?.name}</h3>
                  <div className="text-sm text-gray-400 mt-2">
                    <p>
                      {booking.source_location.address} →{" "}
                      {booking.destination_location.address}
                    </p>
                    <p className="mt-1 flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(booking.pickup_time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <ActionButtons onComplete={() => handleComplete(booking._id)} />
            </motion.div>
          ))}
        </div>

        {/* Completed Bookings */}
        <div className="p-6 rounded-2xl bg-[#1a1a1a] border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <XCircle size={24} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">Completed Rides</h2>
          </div>
          
          {completedBookings.map((booking) => (
            <motion.div
              key={booking._id}
              className="p-4 bg-gray-800/100 rounded-lg border-l-4 border-blue-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{booking.user_id?.name}</h3>
                  <div className="text-sm text-gray-400 mt-2">
                    <p>
                      {booking.source_location.address} →{" "}
                      {booking.destination_location.address}
                    </p>
                    <p className="mt-1 flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(booking.pickup_time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Vehicles Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8    ">
          <h2 className="text-2xl font-semibold flex items-center gap-3 text-red-500">
            <div className="p-3 hover:bg-red-500/10 rounded-full">
              <Car size={24} className="text-red-500 cursor-pointer" />
            </div>
            Your Vehicles
          </h2>
          <motion.button
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/booking/addingcab")}
          >
            <Plus size={20} />
            Add Vehicle
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle._id}
              className="p-6 rounded-xl bg-gray-800/100 border border-gray-700 hover:border-red-500 transition-colors"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 hover:bg-red-500/10 rounded-full">
                  <Car size={24} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">
                  {vehicle.vehicle_number}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {vehicle.seating_capacity} Seats
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee size={16} />
                  {vehicle.perKm_price}/km
                </div>
                <div className="flex items-center gap-2">
                  <ZapOff size={16} />
                  {vehicle.vehicle_type}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {vehicle.vehicle_model}
                </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <motion.button
                  onClick={() => showUpdateForm(vehicle)}
                  className="px-4 py-2 bg-gray-700 rounded-lg flex items-center gap-2 text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <Edit size={16} />
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => deleteVehicle(vehicle._id)}
                  className="px-4 py-2 bg-red-500/60 hover:bg-red-500/60 text-white rounded-lg flex items-center gap-2 text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <Trash2 size={16} />
                  Remove
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Update Vehicle Modal */}
      <AnimatePresence>
        {isUpdateFormVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="p-8 rounded-2xl bg-[#1a1a1a] border border-gray-700 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Update Vehicle</h2>
                <motion.button
                  onClick={() => setIsUpdateFormVisible(false)}
                  className="text-gray-400 hover:text-red-500"
                  whileHover={{ rotate: 90 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                {[
                  { name: "vehicle_number", label: "Vehicle Number", disabled: true },
                  { name: "seating_capacity", label: "Seating Capacity", type: "number" },
                  { name: "perKm_price", label: "Price per KM", type: "number" },
                  { name: "vehicle_type", label: "Vehicle Type" },
                  { name: "vehicle_model", label: "Vehicle Model" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-sm text-gray-400">{field.label}</label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      defaultValue={currentVehicle?.[field.name]}
                      className="w-full p-3 mt-1 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      disabled={field.disabled}
                    />
                  </div>
                ))}

                <div className="flex justify-center gap-3 mt-6">
                  <motion.button
                    type="submit"
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600  transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Update Vehicle
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiderDashboard;