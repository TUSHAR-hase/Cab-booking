import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash, Plus, Mail, MapPin, Landmark, Hash, Building, Globe, Info, Images } from "lucide-react";

const HotelRegister = () => {
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    businessRegNo: "",
    hotelName: "",
    area: "",
    district: "",
    pincode: "",
    longitude: "",
    latitude: "",
    description: "",
    hotelImages: [],
  });
  const [editingOwner, setEditingOwner] = useState(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotelowners`);
      setOwners(response.data);
    } catch (error) {
      console.error("Error fetching owners", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, hotelImages: [...formData.hotelImages, ...files] });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      hotelImages: formData.hotelImages.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black border-2 border-red-500 rounded-xl p-8 max-w-4xl w-full text-center shadow-red-500 shadow-lg"
      >
        <h1 className="text-4xl font-bold uppercase tracking-wide text-red-500 mb-2">
          Hotel <span className="text-white">Registration</span>
        </h1>
        <p className="text-gray-400 mb-6">Register your hotel & manage bookings effortlessly.</p>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {[
            { name: "name", placeholder: "Full Name", icon: <Landmark className="text-red-500 mr-3" /> },
            { name: "email", placeholder: "Email", type: "email", icon: <Mail className="text-red-500 mr-3" /> },
            { name: "businessName", placeholder: "Business Name", icon: <Building className="text-red-500 mr-3" /> },
            { name: "businessRegNo", placeholder: "Business Reg. No.", icon: <Hash className="text-red-500 mr-3" /> },
            { name: "hotelName", placeholder: "Hotel Name", icon: <Landmark className="text-red-500 mr-3" /> },
            { name: "area", placeholder: "Area", icon: <MapPin className="text-red-500 mr-3" /> },
            { name: "district", placeholder: "District", icon: <Globe className="text-red-500 mr-3" /> },
            { name: "pincode", placeholder: "Pincode", icon: <Hash className="text-red-500 mr-3" /> },
            { name: "longitude", placeholder: "Longitude", icon: <Globe className="text-red-500 mr-3" /> },
            { name: "latitude", placeholder: "Latitude", icon: <Globe className="text-red-500 mr-3" /> },
          ].map(({ name, placeholder, type = "text", icon }) => (
            <div key={name}>
              <label className="text-sm font-semibold">{placeholder}</label>
              <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
                {icon}
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="w-full bg-black text-white focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Full-width fields */}
        <div className="mt-6 space-y-5 text-left">
          <div>
            <label className="text-sm font-semibold">Hotel Description</label>
            <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
              <Info className="text-red-500 mr-3" />
              <textarea
                name="description"
                placeholder="Hotel Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-black text-white focus:outline-none h-24"
              ></textarea>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-semibold">Hotel Images</label>
            <div className="flex items-center bg-black border border-red-500 p-3 rounded-lg text-lg">
              <Images className="text-red-500 mr-3" />
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full bg-black text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Image Preview */}
          <div className="flex flex-wrap gap-2">
            {formData.hotelImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(image)} alt="Hotel" className="w-20 h-20 object-cover rounded" />
                <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 text-lg rounded-lg flex items-center justify-center space-x-2"
          >
            <Plus size={22} />
            <span>{editingOwner ? "Update Owner" : "Register Hotel"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HotelRegister;