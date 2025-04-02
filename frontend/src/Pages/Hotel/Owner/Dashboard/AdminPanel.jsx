import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Hotel, Bed, LogOut, Menu } from "lucide-react";
import HotelDashboard from "./HotelDashboard.jsx";
import RoomDashboard from "./RoomDashboard.jsx";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Hotels", path: "/hotelowner/dashboard/hotel", icon: Hotel },
    { name: "Rooms", path: "/hotelowner/dashboard/room", icon: Bed },
  ];

  return (
    <div className="flex h-screen w-screen bg-black text-white">
      {/* Burger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-red-500 text-white rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`w-64 bg-black border-r border-red-500 flex flex-col shadow-2xl transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative h-full`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-red-500">
          <h2 className="text-2xl font-bold text-red-500">Admin Panel</h2>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      handleLinkClick();
                    }}
                    className={`w-full flex items-center py-3 px-5 rounded-3xl transition duration-200 ${location.pathname === item.path
                      ? "bg-red-500 text-black"
                      : "hover:bg-red-500 hover:text-black"
                      }`}
                  >
                    <Icon className="mr-3" size={20} />
                    <span>{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-red-500">
          <button
            onClick={() => navigate("/login/hotel")}
            className="w-full flex items-center justify-center py-3 px-5 text-center bg-red-500 text-black rounded-3xl hover:bg-red-600 transition-all duration-200"
          >
            <LogOut className="mr-3" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-grow bg-black p-4 md:p-8 overflow-auto shadow-inner ${isSidebarOpen ? "md:ml-64" : "md:ml-0"
          }`}
      >
        {location.pathname === "/hotelowner/dashboard/hotel" ? (
          <HotelDashboard />
        ) : (
          <RoomDashboard />
        )}
      </main>
    </div>
  );
};

export default AdminPanel;