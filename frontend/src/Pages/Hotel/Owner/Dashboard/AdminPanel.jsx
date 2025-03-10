import React from "react";
import {  useNavigate,useLocation } from "react-router-dom";
import { Hotel, Bed, LogOut } from "lucide-react";
import HotelDashboard from "./HotelDashboard.jsx";
import RoomDashboard from "./RoomDashboard.jsx";

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-red-500 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-red-500">
          <h2 className="text-2xl font-bold text-red-500">Admin Panel</h2>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate("/hotelowner/dashboard/hotel")}
                className={`w-full flex items-center py-3 px-4 rounded-lg ${
                  location.pathname === "/admin/hotels" ? "bg-red-500 text-black" : "hover:bg-red-500 hover:text-black"
                } transition-all duration-200`}
              >
                <Hotel className="mr-3" size={20} />
                <span>Hotels</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/hotelowner/dashboard/room")}
                className={`w-full flex items-center py-3 px-4 rounded-lg ${
                  location.pathname === "/admin/rooms" ? "bg-red-500 text-black" : "hover:bg-red-500 hover:text-black"
                } transition-all duration-200`}
              >
                <Bed className="mr-3" size={20} />
                <span>Rooms</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-red-500">
          <button
            onClick={() => navigate("/login/hotel")}
            className="w-full flex items-center justify-center py-3 px-4 text-center bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            <LogOut className="text-white mr-2" size={20} />
            <span className="text-white">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-6">
        {location.pathname === "/hotelowner/dashboard/hotel" ? <HotelDashboard /> : <RoomDashboard />}
      </div>
    </div>
  );
};

export default AdminPanel;
