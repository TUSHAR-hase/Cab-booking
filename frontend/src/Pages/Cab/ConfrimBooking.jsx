import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../config";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";
const ConfirmBookingPage = () => {
  const {id}=useParams()
  console.log(id)
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  // const [user_id,setuserid]=useState()
  const [vehicalid,setVehicle]=useState()
  const [loading, setLoading] = useState(false);
  const [rider_id,setRider]=useState()
  const [userId, setUserId] = useState("");
  const [username,setusername]=useState()
  const [useremail,setuseremail]=useState()
  const [usercontect,setusercontect]=useState()
 const[amount,setammount]=useState()

  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded) 
    setUserId(decoded.user._id)
    setusercontect(decoded.user.contact)
    setusername(decoded.user.name)
    setuseremail(decoded.user.email)
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  hendecardetail();
}, []);
const hendecardetail=async()=>{
  const responce=await fetch(`${BASE_URL}/api/Rv/vehicle/getvehicle/${id}`) 
  const data=await responce.json();
  console.log(data)
  setRider(data.Rider_id)
  setVehicle(id)
  setammount(data.perKm_price)
}

useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = () => console.log("Razorpay script loaded");
  document.body.appendChild(script);
}, []);
const loadRazorpay = async () => {
  setLoading(true);


  try {
    // Call backend to create an order
    const { data } = await axios.post(`${BASE_URL}/create-order`, { amount: 500 });
console.log(data)
    if (!data.success) throw new Error("Failed to create order");

    const options = {
      key: "rzp_test_Y8cefy5g53d5Se", // Get from Razorpay
      amount: "1",
      currency: "INR",
      order_id: data.order.id,
      name: "Booking Hub",
      description: "Payment for Booking",
      handler: async (response) => {
        // Verify Payment Signature
        const verifyRes = await axios.post(`${BASE_URL}/verify-payment`, response);
        if (verifyRes.data.success) {
          alert("Payment Successful!");
        } else {
          alert("Payment Verification Failed!");
        }
      },
      prefill: {
        name: username,
        email: useremail,
        contact: usercontect,
      },
      theme: {
        color: "#3399cc",
      },
    };
    console.log(window.Razorpay);

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.log(error);
    alert(error.message);
  }

  setLoading(false);
};

  const handleProceedToPayment = async() => {
    if (!from || !to || !pickupTime) {
      alert("Please fill in all required fields");
      return;
    }
   try {
    const res=await fetch(`${BASE_URL}/api/Rv/booking/createbooking`,{
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({from,to,pickupTime,vehicalid,rider_id,userId})
  
    })
    console.log(res)
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
  
    console.log("Response Data:", data);
    if (data) {
      
      setTimeout(() => {
        alert("GO to Payment PAGE...!");
       
      }, 2000);
      loadRazorpay();

    }
   } catch (error) {
    console.log(error)
   }
    
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white shadow-xl rounded-2xl mt-10 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-500">Confirm Your Booking</h2>

        {/* Pickup Time */}
        <div className="mb-4">
          <label className="block font-semibold text-red-500">Pickup Time:</label>
          <input
            type="datetime-local"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white mt-2"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            required
          />
        </div>

        {/* Location Fields */}
        <div className="mb-4">
          <label className="block font-semibold text-red-500">From:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white mt-2"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Enter pickup location"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold text-red-500">To:</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white mt-2"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Enter destination"
            required
          />
        </div>

        {/* Proceed Button */}
        <button
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold"
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default ConfirmBookingPage;