import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

const RoomDashboard = () => {
  const navigate = useNavigate();

  // Dummy room data with hotel names
  const [rooms, setRooms] = useState([
    { id: 1, number: "101", type: "Deluxe", price: 2500, hotel: "Grand Luxe Hotel" },
    { id: 2, number: "102", type: "Suite", price: 5000, hotel: "Skyline Towers" },
    { id: 3, number: "103", type: "Standard", price: 1800, hotel: "Ocean View Resort" }
  ]);

  // Handle delete
  const deleteRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  return (
    <div className="bg-black text-white p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-red-500 pb-4">
        <h2 className="text-3xl font-bold text-red-500">Room Management</h2>
        <button
          onClick={() => navigate("/addroom")}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <Plus className="mr-2" size={20} /> Add Room
        </button>
      </div>

      {/* Room List */}
      <div className="overflow-x-auto">
        <table className="w-full border border-red-500 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-red-500 text-black">
              <th className="p-3">Hotel Name</th>
              <th className="p-3">Room Number</th>
              <th className="p-3">Type</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-red-500 text-center">
                <td className="p-3">{room.hotel}</td>
                <td className="p-3">{room.number}</td>
                <td className="p-3">{room.type}</td>
                <td className="p-3">₹ {room.price}</td>
                <td className="p-3 flex justify-center space-x-3">
                  <button
                    onClick={() => navigate(`/room/view/${room.id}`)}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/editroom/${room.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteRoom(room.id)}
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

export default RoomDashboard;
