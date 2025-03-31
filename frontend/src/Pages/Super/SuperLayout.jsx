import React from "react";
import { Outlet } from "react-router-dom";
import SuperSideBar from "./SuperSideBar";

function SuperLayout() {
  return (
    <div className="flex h-screen bg-black font-poppins">
      <SuperSideBar />
      <main className="flex-1 p-6 bg-black text-white overflow-y-auto transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default SuperLayout;