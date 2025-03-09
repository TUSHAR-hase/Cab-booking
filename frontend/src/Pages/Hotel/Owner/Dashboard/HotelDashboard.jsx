import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

const HotelDashboard = () => {
  const navigate = useNavigate();

  // Dummy hotel data
  const [hotels, setHotels] = useState([
    { id: 1, name: "Hotel RedSun", businessName: "RedSun Pvt Ltd", district: "Mumbai", pincode: "400001" },
    { id: 2, name: "Black Orchid", businessName: "Orchid Enterprises", district: "Delhi", pincode: "110001" },
    { id: 3, name: "Scarlet Inn", businessName: "Scarlet Hospitality", district: "Bangalore", pincode: "560001" }
  ]);

  // Handle delete
  const deleteHotel = (id) => {
    setHotels(hotels.filter((hotel) => hotel.id !== id));
  };

  return (
    <div className="bg-black text-white p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-red-500 pb-4">
        <h2 className="text-3xl font-bold text-red-500">Hotel Management</h2>
        <button
          onClick={() => navigate("/addhotel")}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <Plus className="mr-2" size={20} /> Add Hotel
        </button>
      </div>

      {/* Hotel List */}
      <div className="overflow-x-auto">
        <table className="w-full border border-red-500 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-red-500 text-black">
              <th className="p-3">Hotel Name</th>
              <th className="p-3">Business Name</th>
              <th className="p-3">District</th>
              <th className="p-3">Pincode</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="border-b border-red-500 text-center">
                <td className="p-3">{hotel.name}</td>
                <td className="p-3">{hotel.businessName}</td>
                <td className="p-3">{hotel.district}</td>
                <td className="p-3">{hotel.pincode}</td>
                <td className="p-3 flex justify-center space-x-3">
                  <button
                    onClick={() => navigate(`/hotel/view/${hotel.id}`)}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/hotel/owner/edithotel/${hotel.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteHotel(hotel.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelDashboard;
