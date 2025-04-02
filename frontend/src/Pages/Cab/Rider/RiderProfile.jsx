import React, { useState } from "react";
import { HiStar, HiClock, HiUserCircle, HiMail, HiPhone } from "react-icons/hi";
import { motion } from "framer-motion";

// Modal component for Profile Edit
const EditProfileModal = ({
  isOpen,
  onClose,
  onSave,
  riderDetails,
  setRiderDetails,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setRiderDetails({
      ...riderDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-8 rounded-lg max-w-lg w-full">
        <h2 className="text-white text-2xl font-semibold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="text-white">Name</label>
          <input
            type="text"
            name="name"
            value={riderDetails.name}
            onChange={handleChange}
            className="w-full p-2 mt-2 text-black rounded"
          />
        </div>
        <div className="mb-4">
          <label className="text-white">Email</label>
          <input
            type="email"
            name="email"
            value={riderDetails.email}
            onChange={handleChange}
            className="w-full p-2 mt-2 text-black rounded"
          />
        </div>
        <div className="mb-4">
          <label className="text-white">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={riderDetails.phone}
            onChange={handleChange}
            className="w-full p-2 mt-2 text-black rounded"
          />
        </div>
        <div className="mb-4">
          <label className="text-white">Address</label>
          <input
            type="text"
            name="address"
            value={riderDetails.address}
            onChange={handleChange}
            className="w-full p-2 mt-2 text-black rounded"
          />
        </div>
        <div className="flex gap-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => {
              onSave();
              onClose();
            }}
          >
            Save Changes
          </button>
          <button
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal component for Change Password
const ChangePasswordModal = ({ isOpen, onClose, onSavePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      onSavePassword(currentPassword, newPassword);
      onClose();
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-8 rounded-lg max-w-lg w-full">
        <h2 className="text-white text-2xl font-semibold mb-4">
          Change Password
        </h2>
        <div className="mb-4">
          <label className="text-white">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 mt-2 text-black rounded"
          />
        </div>
        <div className="mb-4">
          <label className="text-white">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mt-2 text-black rounded"
          />
        </div>
        <div className="mb-4">
          <label className="text-white">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mt-2 text-black rounded"
          />
        </div>
        <div className="flex gap-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handlePasswordChange}
          >
            Change Password
          </button>
          <button
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

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
    coverPhoto:
      "https://images.pexels.com/photos/2399254/pexels-photo-2399254.jpeg",
  });

  // Sample ride history data
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

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    console.log("Profile saved:", riderDetails);
  };

  const handleChangePassword = (currentPassword, newPassword) => {
    // Implement password change logic (e.g., API call)
    console.log("Password changed:", currentPassword, newPassword);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={riderDetails.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-16 left-8">
          <img
            src={riderDetails.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 hover:border-red-600"
          />
        </div>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {riderDetails.name}
            </h1>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Stats Cards with Hover Effects */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div
            className="bg-black border-2 border-red-500 p-6 rounded-xl shadow-sm hover:bg-blue-500 
hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <HiUserCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-white">Total Rides</p>
                <p className="text-2xl text-white font-bold">
                  {riderDetails.totalRides}
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-black border-2 border-red-500 p-6 rounded-xl shadow-sm hover:bg-green-500 
hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <HiStar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-white">Rating</p>
                <p className="text-2xl text-white font-bold">
                  {riderDetails.rating}/5
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-black border-2 border-red-500 p-6 rounded-xl shadow-sm hover:bg-red-500 
hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <HiClock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-white">Cancellation Rate</p>
                <p className="text-2xl text-white font-bold">
                  {riderDetails.cancellationRate}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <div className="bg-black rounded-xl border-2 border-red-500 shadow-sm p-6 mb-8">
          <h2 className="text-xl text-white font-semibold mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <HiMail className="w-6 h-6 text-white" />
              <div>
                <p className="text-white">Email</p>
                <p className="font-medium text-white">{riderDetails.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HiPhone className="w-6 h-6 text-white" />
              <div>
                <p className="text-white">Phone Number</p>
                <p className="font-medium text-white">{riderDetails.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-white">Address</p>
              <p className="font-medium text-white">{riderDetails.address}</p>
            </div>
          </div>
        </div>

        {/* Ride History */}
        <div className="bg-black border-2 border-red-600 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Recent Rides
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">
                    Pickup
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">
                    Dropoff
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white">
                    Fare
                  </th>
                </tr>
              </thead>
              <tbody>
                {rideHistory.map((ride, index) => (
                  <tr key={index} className="text-white">
                    <td className="px-6 py-3 text-sm">{ride.date}</td>
                    <td className="px-6 py-3 text-sm">{ride.pickup}</td>
                    <td className="px-6 py-3 text-sm">{ride.dropoff}</td>
                    <td className="px-6 py-3 text-sm">{ride.fare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
