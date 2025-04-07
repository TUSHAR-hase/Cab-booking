import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Key,
  User,
  Star,
  Clock,
  Mail,
  Phone,
  Pencil,
  ChevronRight,
  MapPin,
  Calendar,
  DollarSign,
  Navigation,
} from "lucide-react";

// Enhanced Edit Profile Modal
const EditProfileModal = ({
  isOpen,
  onClose,
  onSave,
  riderDetails,
  setRiderDetails,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [localDetails, setLocalDetails] = useState(riderDetails);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Reset local state when modal opens or original data changes
  useEffect(() => {
    setLocalDetails(riderDetails);
    setHasChanges(false);
    setPreviewImage(riderDetails.avatar || '');
  }, [isOpen, riderDetails]);

  // Check for changes whenever localDetails changes
  useEffect(() => {
    const changesExist = Object.keys(localDetails).some(
      (key) => localDetails[key] !== riderDetails[key]
    );
    setHasChanges(changesExist);
  }, [localDetails, riderDetails]);

  const handleChange = (e) => {
    setLocalDetails({
      ...localDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setLocalDetails(prev => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await onSave(localDetails);
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex  justify-center p-4 z-50 "
        >
          <div className="mt-20 w-full max-w-lg">
          <motion.div
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl max-w-md w-full mx-4 border border-gray-700 shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-2 bg-red-400/20 rounded-lg shadow-md hover:bg-red-400/30 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-6 h-6 text-red-500" />
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Edit Profile
              </h2>
            </div>

            {/* Image Upload */}
            <div className="flex justify-center mb-6">
              <label className="relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center group-hover:border-red-500 transition-colors overflow-hidden"
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400 group-hover:text-red-500 transition-colors" />
                  )}
                </motion.div>
                <span className="absolute bottom-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs shadow-lg">
                  ✎
                </span>
              </label>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {[
                  {
                    field: "name",
                    icon: <User size={20} className="text-red-500" />,
                    type: "text",
                  },
                  {
                    field: "email",
                    icon: <Mail size={20} className="text-red-500" />,
                    type: "email",
                  },
                  {
                    field: "phone",
                    icon: <Phone size={20} className="text-red-500" />,
                    type: "tel",
                  },
                  {
                    field: "address",
                    icon: <MapPin size={20} className="text-red-500" />,
                    type: "text",
                  },
                ].map(({ field, icon, type }) => (
                  <div key={field} className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div className="relative">
                      <input
                        name={field}
                        type={type}
                        value={localDetails[field] || ""}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all"
                        required
                      />
                      <div className="absolute left-3 top-3 text-red-500">
                        {icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium flex items-center justify-center gap-2 ${
                    isSaving ? "opacity-80 " : !hasChanges ? "opacity-80" : ""
                  }`}
                  disabled={isSaving || !hasChanges}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Rider Profile Component
const RiderProfile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [riderDetails, setRiderDetails] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main Street, New York, USA",
    totalRides: 245,
    rating: 4.8,
    cancellationRate: 2.4,
    memberSince: "2021-05-15",
    vehicle: "Honda Civic 2020",
    licensePlate: "XYZ-1234",
  });

  const rideHistory = [
    {
      id: 1,
      date: "2023-03-15",
      time: "14:30",
      pickup: "Central Park, New York",
      dropoff: "Times Square, Manhattan",
      fare: 15.00,
      distance: "3.2 miles",
      duration: "12 min",
    },
    {
      id: 2,
      date: "2023-03-14",
      time: "09:15",
      pickup: "Empire State Building",
      dropoff: "Brooklyn Bridge Park",
      fare: 22.50,
      distance: "5.7 miles",
      duration: "18 min",
    },
    {
      id: 3,
      date: "2023-03-13",
      time: "17:45",
      pickup: "Statue of Liberty",
      dropoff: "Wall Street Financial District",
      fare: 18.75,
      distance: "4.1 miles",
      duration: "15 min",
    },
  ];

  const handleSaveChanges = async (updatedDetails) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRiderDetails(updatedDetails);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 px-4 py-6">
      <div className="container mx-auto border border-gray-700 rounded-2xl shadow-2xl bg-gray-800/40 backdrop-blur-md max-w-6xl p-6 md:p-8 mt-6">
        {/* Profile Header */}
        <motion.div
          className="flex flex-col items-center text-center gap-6 mb-12 mt-6 md:mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 rounded-full bg-red-500 blur-md -z-10"
            />
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-800 hover:border-red-600 shadow-xl overflow-hidden relative">
              {riderDetails.avatar ? (
                <img
                  src={riderDetails.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`absolute inset-0 bg-gray-700 flex items-center justify-center ${
                  riderDetails.avatar ? "hidden" : "flex"
                }`}
              >
                <User className="w-16 h-16 text-red-500" />
              </div>
            </div>
          </motion.div>

          <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {riderDetails.name}
            </h1>
            <p className="text-gray-400 text-sm">
              Member since {formatDate(riderDetails.memberSince)}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-800 transition-all flex items-center gap-2 cursor-pointer"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil size={18} />
            Edit Profile
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delay: 0.3 }}
        >
          {[
            {
              icon: User,
              label: "Total Rides",
              value: riderDetails.totalRides,
              color: "hover:bg-blue-500/10 text-blue-400",
            },
            {
              icon: Star,
              label: "Rating",
              value: `${riderDetails.rating}/5`,
              color: "hover:bg-yellow-500/10 text-yellow-400",
            },
            {
              icon: Clock,
              label: "Cancellation Rate",
              value: `${riderDetails.cancellationRate}%`,
              color: "hover:bg-red-500/10 text-red-400",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-red-500/50 transition-all cursor-pointer"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Information Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Personal Information Card */}
          <motion.div
            className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:border-red-500/50 transition-all"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="p-2 hover:bg-red-500/10 rounded-full shadow">
                <User className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-xl bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Personal Information
              </span>
            </h3>
            <div className="border-b-2 border-gray-700/100 mb-6"></div>
            <div className="space-y-4">
              {[
                {
                  icon: <Mail className="w-5 h-5 text-red-500" />,
                  label: "Email",
                  value: riderDetails.email,
                },
                {
                  icon: <Phone className="w-5 h-5 text-red-500" />,
                  label: "Phone",
                  value: riderDetails.phone,
                },
                {
                  icon: <MapPin className="w-5 h-5 text-red-500" />,
                  label: "Address",
                  value: riderDetails.address,
                },
                {
                  icon: <Calendar className="w-5 h-5 text-red-500" />,
                  label: "Member Since",
                  value: formatDate(riderDetails.memberSince),
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 hover:bg-gray-700/30 rounded-lg transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-1.5 bg-gray-700/50 rounded-lg mt-1">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">{item.label}</p>
                    <p className="text-white">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Vehicle Information Card */}
          <motion.div
            className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:border-red-500/50 transition-all"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="p-2 hover:bg-red-500/10 rounded-full shadow">
                <Key className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-xl bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Vehicle Information
              </span>
            </h3>
            <div className="border-b-2 border-gray-700/100 mb-6"></div>
            <div className="space-y-4">
              {[
                {
                  icon: <User className="w-5 h-5 text-red-500" />,
                  label: "Vehicle Model",
                  value: riderDetails.vehicle,
                },
                {
                  icon: <Lock className="w-5 h-5 text-red-500" />,
                  label: "License Plate",
                  value: riderDetails.licensePlate,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 hover:bg-gray-700/30 rounded-lg transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-1.5 bg-gray-700/50 rounded-lg mt-1">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">{item.label}</p>
                    <p className="text-white">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Rides Card */}
          <motion.div
            className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:border-red-500/50 transition-all lg:col-span-2"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="p-2 hover:bg-red-500/10 rounded-full shadow">
                <Clock className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-xl bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Recent Rides
              </span>
            </h3>
            <div className="border-b-2 border-gray-700/100 mb-6"></div>
            <div className="space-y-4">
              {rideHistory.map((ride, index) => (
                <motion.div
                  key={ride.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 bg-gray-700/30 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {formatDate(ride.date)} at {ride.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">
                        {formatCurrency(ride.fare)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center pt-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-px h-8 bg-gray-600 my-1"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Pickup</p>
                        <p className="text-white">{ride.pickup}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center pt-1">
                        <Navigation className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Trip Details</p>
                        <div className="flex gap-4">
                          <p className="text-white text-sm">{ride.distance}</p>
                          <p className="text-white text-sm">{ride.duration}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveChanges}
          riderDetails={riderDetails}
          setRiderDetails={setRiderDetails}
        />
      </div>
    </div>
  );
};

export default RiderProfile;