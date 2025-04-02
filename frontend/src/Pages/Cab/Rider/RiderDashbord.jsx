import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { } from "framer-motion";
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
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../config";
import { jwtDecode } from "jwt-decode";

const ActionButtons = ({ onConfirm, onCancel, onComplete }) => (
  <div className="mt-4 flex justify-end gap-2">
    {onCancel && (
      <motion.button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Reject
      </motion.button>
    )}
    {onConfirm && (
      <motion.button
        onClick={onConfirm}
        className="px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-600 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Accept
      </motion.button>
    )}
    {onComplete && (
      <motion.button
        onClick={onComplete}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Complete Ride
      </motion.button>
    )}
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
    <div className="min-h-screen bg-black text-white font-[Poppins] p-8 ">
      <motion.h1
        className="text-5xl font-extrabold text-left text-red-500 mb-8 "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Hii, {rider}
      </motion.h1>

      {/* Bookings Sections */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Request Bookings */}
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} 
        className="p-6 rounded-2xl shadow-lg border border-gray-800"
        >
          <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}

           className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
            <Clock size={28} /> Booking Requests
          </motion.h2>
          {requestBookings.map((booking) => (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key={booking._id}
              className="mt-4 p-4 border-l-4 border-red-500 bg-[#2a2a2a] rounded-lg"
            >
              <div className="flex items-center gap-4">
                {/* <img src={booking.image} alt={booking.rider} className="w-12 h-12 rounded-full" /> */}
                <div>
                  <h3 className="text-xl font-semibold">
                    {booking.user_id?.name}
                  </h3>
                  <p className="text-sm text-blue-400 mt-1">
                    Vehicle: {booking.vehicle_id.vehicle_number}
                  </p>
                  <p className="text-gray-400">
                    {booking.source_location.address} →{" "}
                    {booking.destination_location.address}
                  </p>
                  <p className="text-sm text-blue-400 mt-1">
                    Contact: {booking.user_id?.contact}
                  </p>
                  <p className="text-gray-300 mt-1">
                    <Calendar size={16} className="inline-block" /> Pick Time:{" "}
                    {booking.pickup_time
                      ? new Date(booking.pickup_time).toLocaleString()
                      : "Not Available"}
                  </p>
                </div>
              </div>
              <ActionButtons
                onConfirm={() => handleAccept(booking._id)}
                onCancel={() => handleReject(booking._id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Confirmed Bookings */}
        <motion.div className="p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-3xl font-bold text-green-500 flex items-center gap-2">
            <CheckCircle size={28} /> Confirmed Rides
          </h2>
          {confirmedBookings.map((booking) => (
            <motion.div
              key={booking._id}
              className="mt-4 p-4 border-l-4 border-green-500 bg-[#2a2a2a] rounded-lg"
            >
              <div className="flex items-center gap-4">
                {/* <img src={booking.image} alt={booking.rider} className="w-12 h-12 rounded-full" /> */}
                <div>
                  <h3 className="text-xl font-semibold">
                    {booking.user_id?.name}
                  </h3>
                  <p className="text-sm text-blue-400 mt-1">
                    Vehicle: {booking.vehicle_id.vehicle_number}
                  </p>
                  <p className="text-gray-400">
                    {booking.source_location.address} →{" "}
                    {booking.destination_location.address}
                  </p>
                  <p className="text-sm text-blue-400 mt-1">
                    Contact: {booking.user_id?.contact}
                  </p>
                  <p className="text-gray-300 mt-1">
                    <Calendar size={16} className="inline-block" /> Pick Time:{" "}
                    {booking.pickup_time
                      ? new Date(booking.pickup_time).toLocaleString()
                      : "Not Available"}
                  </p>
                </div>
              </div>
              <ActionButtons onComplete={() => handleComplete(booking._id)} />
            </motion.div>
          ))}
        </motion.div>

        {/* Completed Bookings */}
        <motion.div className="p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-3xl font-bold text-blue-500 flex items-center gap-2">
            <XCircle size={28} /> Completed Rides
          </h2>
          {completedBookings.map((booking) => (
            <motion.div
              key={booking._id}
              className="mt-4 p-4 border-l-4 border-blue-500 bg-[#2a2a2a] rounded-lg"
            >
              <div className="flex items-center gap-4">
                {/* <img src={booking.image} alt={booking.rider} className="w-12 h-12 rounded-full" /> */}
                <div>
                  <h3 className="text-xl font-semibold">
                    {booking.user_id?.name}
                  </h3>
                  <p className="text-sm text-blue-400 mt-1">
                    Vehicle: {booking.vehicle_id.vehicle_number}
                  </p>
                  <p className="text-gray-400">
                    {booking.source_location.address} →{" "}
                    {booking.destination_location.address}
                  </p>
                  <p className="text-sm text-blue-400 mt-1">
                    Contact: {booking.user_id?.contact}
                  </p>
                  <p className="text-gray-300 mt-1">
                    <Calendar size={16} className="inline-block" /> Pick Time:{" "}
                    {booking.pickup_time
                      ? new Date(booking.pickup_time).toLocaleString()
                      : "Not Available"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Add Vehicle Button */}
      <motion.div
        
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mt-15 flex justify-between"
      >
        <h2 className="text-3xl font-bold text-purple-500  flex items-center gap-2">
          <Car size={28} /> Your Vehicles
        </h2>
        <motion.button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all flex items-center 
gap-2 mb-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/booking/addingcab")}
        >
          <Plus size={20} />
          Add Vehicle
        </motion.button>

        {/* Vehicles Section */}
        {/* Vehicles List */}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle.vehicle_number}
            className="p-4 border-l-4 border-purple-500 bg-[#2a2a2a] rounded-lg shadow-md"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Car className="text-purple-400" size={20} />
                {vehicle.vehicle_number}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-gray-300">
                <p>Seats: {vehicle.seating_capacity}</p>
                <p>₹{vehicle.perKm_price}/km</p>
                <p>Type: {vehicle.vehicle_type}</p>
                <p>Model: {vehicle.vehicle_model}</p>
              </div>
              {/* Buttons */}
              <div className="flex justify-between mt-3">
                <motion.button
                  onClick={() => showUpdateForm(vehicle)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  onClick={() => deleteVehicle(vehicle._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* 🚀 Update Vehicle Form */}
      {isUpdateFormVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="p-6 rounded-lg w-96 z-50 border-2 border-red-600">
            <div className="flex justify-between mb-4">
              <h2 className="text-3xl font-bold text-red-600 mx-auto">
                Update Vehicle
              </h2>
              <button
                onClick={() => setIsUpdateFormVisible(false)}
                className="top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              <input
                type="text"
                name="vehicle_number"
                defaultValue={currentVehicle.vehicle_number}
                className="p-2 rounded  text-white border-red-500 hover:border-red-600 border-2 focus:border-red-600 outline-none"
                readOnly
              />
              <input
                type="number"
                name="seating_capacity"
                defaultValue={currentVehicle.seating_capacity}
                className="p-2 rounded bg-transparent text-white border-red-500 hover:border-red-600 border-2 focus:border-red-600
outline-none"
                required
              />
              <input
                type="number"
                name="perKm_price"
                defaultValue={currentVehicle.perKm_price}
                className="p-2 rounded bg-transparent text-white border-red-500 hover:border-red-600 border-2 focus:border-red-600
outline-none"
                required
              />
              <input
                type="text"
                name="vehicle_type"
                defaultValue={currentVehicle.vehicle_type}
                className="p-2 rounded bg-transparent text-white border-red-500 hover:border-red-600 border-2 focus:border-red-600
outline-none"
                required
              />
              <input
                type="text"
                name="vehicle_model"
                defaultValue={currentVehicle.vehicle_model}
                className="p-2 rounded bg-transparent text-white border-red-500 hover:border-red-600 border-2 focus:border-red-600
outline-none"
                required
              />
              <div className="flex gap-2 mt-4 justify-center">
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 "
                >
                  Update
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RiderDashboard;
