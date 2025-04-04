import React, { useEffect, useState } from "react";
import { CheckCircleIcon,PhoneIcon, UserIcon, MapIcon, ClockIcon, CurrencyDollarIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import {Car} from"lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../config";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [bookingDetails,setbookingDetails]=useState(null)
  const { id } = useParams();

    useEffect(() => {
      
        getuserBookings();
      
    }, []);
    const getuserBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/Rv/booking/getuserbooking/${id}`);
        const data = await res.json();
        console.log(`${BASE_URL}/api/Rv/booking/getuserbooking/${id}`)
        console.log(data)
        if (data && data.length > 0) {
          setbookingDetails(data[0]); 
        }
      } catch (error) {
        console.error("Error fetching cab bookings:", error);
      }
    };
console.log(bookingDetails)

    console.log(`${BASE_URL}/api/Rv/booking/getuserbooking/${id}`)

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-black rounded-xl shadow-lg overflow-hidden border ">
        {/* Success Header */}
        <div className="bg-red-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-white" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-white">Ride Confirmed</h1>
                <p className="mt-1 text-red-100 flex items-center">
                  {/* <span>Booking ID: {bookingDetails.}</span> */}
                  {/* <span className="mx-2">•</span> */}
                  {/* <span className="flex items-center"> */}
                    {/* <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" /> */}
                    {/* {bookingDetails.driver.eta} ETA */}
                  {/* </span> */}
                </p>
              </div>
            </div>
            <div className="bg-[#1a1a1a] px-3 py-1 rounded-full border border-red-600 flex items-center">
              <Car className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">{bookingDetails?.vehicle_type}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#1a1a1a]">
          {/* Driver Assignment */}
          <div className="bg-[#3d4241] rounded-lg p-5 mb-6 border border-gray-600 hover:border-red-600 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center mb-3">
                  <UserIcon className="h-5 w-5 text-red-600 mr-2"  />
                  Your Driver
                </h2>
                <div className="flex items-center">
                  <div className="bg-[#1a1a1a] rounded-full h-14 w-14 flex items-center justify-center border-2 border-red-600">
                    <UserIcon className="h-7 w-7 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-white text-lg">{bookingDetails?.Rider_id?.name}</p>
                    <div className="flex items-center mt-1">
                      <span className="bg-black text-red-600 text-sm px-2.5 py-0.5 rounded-full flex items-center border border-red-600">
                        {/* ★ {bookingDetails.Rider_id.rating} */}
                      </span>
                      <span className="ml-3 text-sm text-gray-400">{bookingDetails?.Rider_id?.vehicle_number}</span>
                    </div>
                  </div>
                </div>
              </div>
              <a 
                href={`tel:${bookingDetails?.Rider_id.phone}`}
                className="hover:bg-black px-4 py-2 rounded-lg border border-red-500 text-red-500 text-sm font-medium bg-[#222] transition-colors flex items-center"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Call Driver</span>
                <span className="inline sm:hidden">Call</span>
              </a>
            </div>
          </div>

          {/* Trip Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MapIcon className="h-5 w-5 text-red-600 mr-2" />
              Trip Details
            </h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-5 h-5 bg-red-600 rounded-full mt-1 flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <div className="w-0.5 h-10 bg-gray-700"></div>
                  <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="pb-2 ">
                    <p className="font-bold text-white">{bookingDetails?.source_location?.address}</p>
                    <p className="text-sm text-gray-400 mt-1">Pickup at {bookingDetails?.pickup_time}</p>
                  </div>
                  <div className="pt-3">
                    <p className="font-bold text-white">{bookingDetails?.destination_location?.address}</p>
                  </div>
                </div>
              </div>

            
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors flex-1"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/userdashboard")}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700  transition-colors flex-1"
            >
              View My Rides
            </button>
          </div>

          {/* Safety Note */}
          <div className="mt-8 text-center">
            <span className=" text-white">
              For your safety :  Always verify the vehicle number before boarding
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;