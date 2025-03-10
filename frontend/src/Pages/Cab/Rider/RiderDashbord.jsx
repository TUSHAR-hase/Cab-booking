import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle, Star, Trophy, Target,Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActionButtons = ({ onConfirm, onCancel, onComplete }) => (
  <div className="mt-4 flex justify-end gap-2">
    {onCancel && (
      <motion.button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Cancel
      </motion.button>
    )}
    {onConfirm && (
      <motion.button
        onClick={onConfirm}
        className="px-4 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-600 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Confirm
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

const BookingCard = ({ booking, statusColor, actions }) => (
  <motion.div
    className={`mt-4 p-4 border-l-4 ${statusColor} bg-[#2a2a2a] rounded-lg shadow-md flex flex-col justify-between`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-4">
      <img src={booking.image} alt={booking.rider} className="w-12 h-12 rounded-full" />
      <div>
        <h3 className="text-xl font-semibold">{booking.rider}</h3>
        <p className="text-gray-400">From: {booking.from} → To: {booking.to}</p>
      </div>
    </div>
    {actions}
  </motion.div>
);

const RiderDashboard = () => {
  const navigate=useNavigate();
  const [requestBookings, setRequestBookings] = useState([
    { id: 1, rider: "John Doe", from: "Connaught Place", to: "Airport", status: "pending", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, rider: "Alice Smith", from: "Dwarka", to: "Noida", status: "pending", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  ]);
  const [confirmedBookings, setConfirmedBookings] = useState([
    { id: 3, rider: "Mark Johnson", from: "Karol Bagh", to: "Gurgaon", status: "confirmed", image: "https://randomuser.me/api/portraits/men/3.jpg" },
  ]);
  const [completedBookings, setCompletedBookings] = useState([
    { id: 4, rider: "Sophia Wilson", from: "Saket", to: "Ghaziabad", status: "completed", image: "https://randomuser.me/api/portraits/women/4.jpg" },
  ]);
  const [ridesCompletedToday, setRidesCompletedToday] = useState(0);

  const moveBooking = (id, fromList, setFromList, toList, setToList, newStatus) => {
    const booking = fromList.find((b) => b.id === id);
    if (!booking) return;
    setFromList(fromList.filter((b) => b.id !== id));
    setToList([...toList, { ...booking, status: newStatus }]);
    if (newStatus === "completed") setRidesCompletedToday((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white font-[Poppins] p-8">
      <motion.h1 className="text-5xl font-extrabold text-center text-red-500 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        Rider Dashboard
      </motion.h1>
      <motion.button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>navigate("/booking/addingcab") }
        >
          <Plus size={20} />
          Add Vehicle
        </motion.button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ title: "Request Bookings", icon: <Clock size={28} />, color: "text-yellow-500", list: requestBookings, setList: setRequestBookings, statusColor: "border-red-500", actions: (id) => (
          <ActionButtons onCancel={() => moveBooking(id, requestBookings, setRequestBookings, [], () => {})} onConfirm={() => moveBooking(id, requestBookings, setRequestBookings, confirmedBookings, setConfirmedBookings, "confirmed")} />
        )},
        { title: "Confirmed Bookings", icon: <CheckCircle size={28} />, color: "text-green-500", list: confirmedBookings, setList: setConfirmedBookings, statusColor: "border-green-500", actions: (id) => (
          <ActionButtons onComplete={() => moveBooking(id, confirmedBookings, setConfirmedBookings, completedBookings, setCompletedBookings, "completed")} />
        )},
        { title: "Completed Bookings", icon: <XCircle size={28} />, color: "text-blue-500", list: completedBookings, setList: setCompletedBookings, statusColor: "border-blue-500" }].map(({ title, icon, color, list, statusColor, actions }) => (
          <motion.div key={title} className="p-6 rounded-2xl shadow-lg border border-gray-800 hover:shadow-lg transition-all duration-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className={`text-3xl font-bold ${color} flex items-center gap-2`}>{icon} {title}</h2>
            {list.length === 0 ? <p className="text-gray-400 mt-4">No {title.toLowerCase()}.</p> : list.map((booking) => <BookingCard key={booking.id} booking={booking} statusColor={statusColor} actions={actions && actions(booking.id)} />)}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RiderDashboard;
