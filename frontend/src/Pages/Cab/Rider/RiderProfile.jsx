import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Key, User, Star, Clock, Mail, Phone, Pencil } from "lucide-react";

// Edit Profile Modal Component
const EditProfileModal = ({
  isOpen,
  onClose,
  onSave,
  riderDetails,
  setRiderDetails,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setRiderDetails({
      ...riderDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave();
    setIsSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            className="bg-black p-6 rounded-xl max-w-lg w-full mx-4 border border-gray-800 shadow-xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <User className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-500">
                Edit Profile
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {["name", "email", "phone", "address"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                      {field}
                    </label>
                    <input
                      name={field}
                      value={riderDetails[field]}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSaving}
                  className={`flex-1 bg-red-500 text-white px-6 py-3 rounded-lg
                           hover:bg-red-600 transition-all font-medium flex items-center justify-center gap-2
                           ${isSaving ? "opacity-80 cursor-not-allowed" : ""}`}
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Change Password Modal Component
const ChangePasswordModal = ({ isOpen, onClose, onSavePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setIsChanging(true);
    await onSavePassword(currentPassword, newPassword);
    setIsChanging(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            className="bg-black p-6 rounded-xl max-w-lg w-full mx-4 border border-gray-800 shadow-xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Lock className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-500">
                Change Password
              </h2>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                      required
                    />
                    <Key className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                      required
                    />
                    <Lock className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white 
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                      required
                    />
                    <Lock className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isChanging}
                  className={`flex-1 bg-red-500 text-white px-6 py-3 rounded-lg
                           hover:bg-red-600 transition-all font-medium flex items-center justify-center gap-2
                           ${isChanging ? "opacity-80 cursor-not-allowed" : ""}`}
                >
                  {isChanging ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Rider Profile Component
const RiderProfile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [riderDetails, setRiderDetails] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main Street, New York, USA",
    totalRides: 245,
    rating: 4.8,
    cancellationRate: 2.4,
    avatar:
      "https://i.pinimg.com/280x280_RS/8d/35/e0/8d35e05e1a89c8a252452d03b8adff24.jpg",
  });

  const rideHistory = [
    {
      date: "2023-03-15",
      pickup: "Central Park",
      dropoff: "Times Square",
      fare: "$15.00",
    },
    {
      date: "2023-03-14",
      pickup: "Empire State",
      dropoff: "Brooklyn Bridge",
      fare: "$22.50",
    },
    {
      date: "2023-03-13",
      pickup: "Statue of Liberty",
      dropoff: "Wall Street",
      fare: "$18.75",
    },
  ];

  const handleEditClick = () => setIsEditModalOpen(true);
  const handleSaveChanges = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Profile saved:", riderDetails);
  };
  const handleChangePassword = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Password changed");
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-8 bg-[#1a1a1a] rounded-lg ">
        {/* Profile Header */}
        <motion.div
          className="flex flex-col items-center text-center gap-6 mb-12 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Avatar */}
          <motion.div whileHover={{ scale: 1.05 }} className="relative group">
            <img
              src={riderDetails.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-lg"
            />
          </motion.div>

          {/* Profile Info */}
          <div className="w-full">
            <div className="flex justify-center items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {riderDetails.name}
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex items-center gap-2"
              onClick={handleEditClick}
            >
              <Pencil size={18} />
              Edit Profile
            </motion.button>
            {/*<motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 border border-gray-700 hover:border-red-500 hover:bg-red-500/10 text-white rounded-lg transition-colors flex items-center gap-2"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <Key size={18} />
              Change Password
            </motion.button>*/}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delay: 0.3 }}
        >
          {[
            {
              icon: User,
              label: "Total Rides",
              value: riderDetails.totalRides,
              description: "Completed rides to date",
            },
            {
              icon: Star,
              label: "Rating",
              value: `${riderDetails.rating}/5`,
              description: "Average passenger rating",
            },
            {
              icon: Clock,
              label: "Cancellation Rate",
              value: `${riderDetails.cancellationRate}%`,
              description: "Rides cancelled",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 bg-gray-700/80 border border-gray-800 rounded-xl hover:border-red-500 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-red-500/10">
                  <stat.icon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-white">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white mt-2">
                    {stat.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Information Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Contact Information Card */}
          <motion.div
            className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-red-500 transition-all"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="text-red-500" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{riderDetails.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{riderDetails.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white">{riderDetails.address}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Rides Card */}
          <motion.div
            className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-red-500 transition-all"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="text-red-500" />
              Recent Rides
            </h3>
            <div className="overflow-hidden rounded-lg border border-gray-800">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    {["Date", "Pickup", "Dropoff", "Fare"].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-sm font-medium text-gray-400 border-b border-gray-800"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {rideHistory.map((ride, index) => (
                    <motion.tr
                      key={index}
                      className="hover:bg-red-500/10 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <td className="px-4 py-3 text-sm text-white">
                        {ride.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {ride.pickup}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {ride.dropoff}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-red-400">
                        {ride.fare}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveChanges}
        riderDetails={riderDetails}
        setRiderDetails={setRiderDetails}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSavePassword={handleChangePassword}
      />
    </div>
  );
};

export default RiderProfile;