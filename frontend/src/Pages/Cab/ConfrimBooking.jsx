import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmBookingPage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberAge, setMemberAge] = useState("");
  const navigate = useNavigate();

  const addMember = () => {
    if (memberName && memberAge) {
      setMembers([...members, { name: memberName, age: memberAge }]);
      setMemberName("");
      setMemberAge("");
    }
  };

  const handleProceedToPayment = () => {
    if (!from || !to || members.length === 0) {
      alert("Please fill in all details before proceeding to payment.");
      return;
    }
    navigate("/payment", { state: { from, to, members } });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white shadow-xl rounded-2xl mt-10 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-500">Confirm Your Booking</h2>

        <div className="mb-6">
          <label className="block font-semibold text-red-500">From:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white mt-2 focus:outline-none focus:border-blue-400"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Enter departure location"
          />

          <label className="block font-semibold mt-4 text-red-500">To:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white mt-2 focus:outline-none focus:border-blue-400"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Enter destination"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold text-red-500">Add Members:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white mt-2 focus:outline-none focus:border-blue-400"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="Enter member name"
          />
          <input
            type="number"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white mt-2 focus:outline-none focus:border-blue-400"
            value={memberAge}
            onChange={(e) => setMemberAge(e.target.value)}
            placeholder="Enter age"
          />
          <button
            className="w-full bg-red-500 text-white py-3 rounded-lg mt-4 hover:bg-green-600 transition"
            onClick={addMember}
          >
            Add Member
          </button>
        </div>

        <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-600">
          <h3 className="font-bold text-gray-300">Members List:</h3>
          {members.length > 0 ? (
            <ul className="mt-2 text-gray-200">
              {members.map((member, index) => (
                <li key={index}>{member.name} (Age: {member.age})</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No members added yet.</p>
          )}
        </div>

        <button
          onClick={()=>{
            handleProceedToPayment ,
            navigate("/booking/paymentoption")}}
          
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default ConfirmBookingPage;
