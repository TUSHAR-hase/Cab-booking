import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiStar, FiArrowLeft, FiUser, FiCalendar, FiCheck } from 'react-icons/fi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie';
import successAnimation from './success-animation.json'; // Replace with your animation file
import axios from 'axios';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: [{ name: '', age: '', aadhar: '' }],
    specialRequests: '',
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isRoomAvailable, setIsRoomAvailable] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    id: "",
    name: "",
    email: "",
    contact: "",
  });

  // Animation options
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    adaptiveHeight: true
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        setUserDetails({
          id: decoded.user._id,
          name: decoded.user.name,
          email: decoded.user.email,
          contact: decoded.user.contact,
        });

        await fetchVehicleDetails();
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize page");
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setIsLoading(true);
      try {
        const hotelResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/${id}`);
        if (!hotelResponse.ok) throw new Error('Failed to fetch hotel details');
        const hotelData = await hotelResponse.json();

        const roomsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/hotel/room/${id}`);
        if (!roomsResponse.ok) throw new Error('Failed to fetch rooms');
        const roomsData = await roomsResponse.json();

        setHotel(hotelData.data);
        setRooms(roomsData.data);

        const loadingStates = {};
        if (hotelData.hotelImages) {
          hotelData.hotelImages.forEach((_, index) => {
            loadingStates[index] = true;
          });
        }
        setImageLoading(loadingStates);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message || 'Failed to load hotel details',
          background: '#1a202c',
          color: '#f56565',
          confirmButtonColor: '#e53e3e',
        }).then(() => navigate('/hotels'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id, navigate]);

  useEffect(() => {
    if (selectedRoom && bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalAmount(diffDays * selectedRoom.room_price_per_day);
    }
  }, [bookingData.startDate, bookingData.endDate, selectedRoom]);

  const getImageUrl = (imagePath) => {
    const cleanedPath = imagePath.replace(/^public[\\/]/, '');
    return `${import.meta.env.VITE_API_URL}/${cleanedPath.replace(/\\/g, '/')}`;
  };

  const handleImageLoad = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleBookingModalOpen = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
    setBookingStep(1);
    setBookingData({
      startDate: '',
      endDate: '',
      guests: [{ name: '', age: '', aadhar: '' }],
      specialRequests: '',
    });
    setBookingConfirmed(false);
    setIsRoomAvailable(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGuests = [...bookingData.guests];
    updatedGuests[index][name] = value;
    setBookingData(prev => ({ ...prev, guests: updatedGuests }));
  };

  const addGuest = () => {
    if (bookingData.guests.length < selectedRoom.max_occupancy) {
      setBookingData(prev => ({
        ...prev,
        guests: [...prev.guests, { name: '', age: '', aadhar: '' }]
      }));
    }
  };

  const removeGuest = (index) => {
    if (bookingData.guests.length > 1) {
      const updatedGuests = [...bookingData.guests];
      updatedGuests.splice(index, 1);
      setBookingData(prev => ({ ...prev, guests: updatedGuests }));
    }
  };

  const checkAvailability = async () => {
    if (!validateStep1()) return;

    setIsCheckingAvailability(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/booking/rooms/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          roomId: selectedRoom._id,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate
        })
      });

      if (!response.ok) throw new Error('Failed to check availability');

      const data = await response.json();
      setIsRoomAvailable(data.isAvailable);

      if (data.isAvailable) {
        handleNextStep();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Not Available',
          text: 'This room is not available for the selected dates. Please try different dates.',
          background: '#1a202c',
          color: '#f56565',
          confirmButtonColor: '#e53e3e',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to check availability. Please try again.',
        background: '#1a202c',
        color: '#f56565',
        confirmButtonColor: '#e53e3e',
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const validateStep1 = () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select both check-in and check-out dates',
        background: '#1a202c',
        color: '#f56565',
        confirmButtonColor: '#e53e3e',
      });
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(bookingData.startDate);

    if (startDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Check-in date cannot be in the past',
        background: '#1a202c',
        color: '#f56565',
        confirmButtonColor: '#e53e3e',
      });
      return false;
    }

    if (new Date(bookingData.endDate) <= new Date(bookingData.startDate)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Check-out date must be after check-in date',
        background: '#1a202c',
        color: '#f56565',
        confirmButtonColor: '#e53e3e',
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    for (let guest of bookingData.guests) {
      if (!guest.name || !guest.age || !guest.aadhar) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill all guest details',
          background: '#1a202c',
          color: '#f56565',
          confirmButtonColor: '#e53e3e',
        });
        return false;
      }

      if (isNaN(guest.age) || guest.age < 1 || guest.age > 120) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please enter valid age for all guests',
          background: '#1a202c',
          color: '#f56565',
          confirmButtonColor: '#e53e3e',
        });
        return false;
      }

      if (guest.aadhar.length !== 12 || isNaN(guest.aadhar)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please enter valid 12-digit Aadhar number for all guests',
          background: '#1a202c',
          color: '#f56565',
          confirmButtonColor: '#e53e3e',
        });
        return false;
      }
    }

    if (bookingData.guests.length > selectedRoom.max_occupancy) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Maximum occupancy for this room is ${selectedRoom.max_occupancy}`,
        background: '#1a202c',
        color: '#f56565',
        confirmButtonColor: '#e53e3e',
      });
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (bookingStep === 1 && !validateStep1()) return;
    if (bookingStep === 2 && !validateStep2()) return;
    setBookingStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setBookingStep(prev => prev - 1);
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateStep2()) return;

    try {
      setPaymentLoading(true);

      // Create booking first
      const bookingResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          hotel: hotel._id,
          room: selectedRoom._id,
          bookingStartDate: bookingData.startDate,
          bookingEndDate: bookingData.endDate,
          personDetails: bookingData.guests,
          specialRequests: bookingData.specialRequests,
          totalAmount: totalAmount,
        })
      });

      if (!bookingResponse.ok) throw new Error('Booking creation failed');
      const bookingDataResponse = await bookingResponse.json();

      // Initialize Razorpay
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) throw new Error('Razorpay SDK failed to load');

      // Create payment order
      const orderResponse = await axios.post(`${import.meta.env.VITE_API_URL}/create-order`, {
        amount: totalAmount , // Convert to paise
      });

      if (!orderResponse.data.success) throw new Error('Order creation failed');

      // Razorpay options
      const options = {
        key: "rzp_test_Y8cefy5g53d5Se", // Replace with your Razorpay Key ID
        amount: orderResponse.data.order.amount,
        currency: "INR",
        order_id: orderResponse.data.order.id,
        name: "Booking Hub",
        description: `Booking for ${hotel.name} - ${selectedRoom.room_type}`,
        prefill: userDetails,
        theme: { color: "#3399cc" },
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/verify-payment`,
              response
            );
            if (verificationResponse.data.success) {
              setBookingConfirmed(true);
              setBookingStep(3);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Payment verification failed. Please try again.',
              background: '#1a202c',
              color: '#f56565',
              confirmButtonColor: '#e53e3e',
            });
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Payment processing failed. Please try again.',
        background: '#1a202c',
        color: '#f56565',
        confirmButtonColor: '#e53e3e',
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    if (bookingConfirmed) {
      // Optional: Redirect or refresh data after successful booking
      // navigate('/my-bookings');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex justify-center items-center">
        <p>Hotel not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-red-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Existing Hotel Details UI remains unchanged */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-red-400 hover:text-red-300 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to search results
        </button>

        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-96 relative">
            {hotel.hotelImages && hotel.hotelImages.length > 0 ? (
              <Slider {...sliderSettings} className="h-full">
                {hotel.hotelImages.map((image, index) => (
                  <div key={index} className="h-96 relative">
                    {imageLoading[index] && (
                      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        <div className="animate-pulse flex space-x-4">
                          <div className="rounded-full bg-gray-700 h-12 w-12"></div>
                        </div>
                      </div>
                    )}
                    <img
                      src={getImageUrl(image)}
                      alt={`${hotel.name} ${index + 1}`}
                      className={`w-full h-full object-cover ${imageLoading[index] ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageError(index)}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                <span className="text-red-400">No images available</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h1 className="text-3xl font-bold text-red-500">{hotel.name}</h1>
                <div className="flex items-center mt-2 text-red-300">
                  <FiMapPin className="mr-1" />
                  <span>{hotel.address?.area}, {hotel.address?.district}, {hotel.address?.pincode}</span>
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-red-400 mr-4">
                    <span>₹ {hotel.minPrice || 'N/A'} - ₹ {hotel.maxPrice || 'N/A'}</span>
                  </div>
                  {hotel.averageRating && (
                    <div className="flex items-center">
                      <div className="flex items-center bg-red-600 px-2 py-1 rounded">
                        <FiStar className="text-white mr-1" />
                        <span className="text-white">{hotel.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="mt-4 md:mt-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-black font-bold rounded"
                onClick={() => rooms.length > 0 && handleBookingModalOpen(rooms[0])}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-red-500 border-b-2 border-red-500' : 'text-red-400 hover:text-red-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'rooms' ? 'text-red-500 border-b-2 border-red-500' : 'text-red-400 hover:text-red-300'}`}
            onClick={() => setActiveTab('rooms')}
          >
            Rooms
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'amenities' ? 'text-red-500 border-b-2 border-red-500' : 'text-red-400 hover:text-red-300'}`}
            onClick={() => setActiveTab('amenities')}
          >
            Amenities
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-md p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-red-500 mb-4">About {hotel.name}</h2>
              <p className="text-red-300">{hotel.description || 'No description available.'}</p>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div>
              <h2 className="text-2xl font-bold text-red-500 mb-4">Available Rooms</h2>
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map(room => (
                    <div key={room._id} className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-xl font-bold text-red-400 mb-2">{room.room_type}</h3>
                      <div className="flex items-center text-red-300 mb-2">
                        <span>₹{room.room_price_per_day} per night</span>
                      </div>
                      <p className="text-red-300 mb-3">{room.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {room.facilities.map((amenity, index) => (
                          <span key={index} className="bg-gray-700 text-red-300 px-2 py-1 rounded text-sm">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <button
                        className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-black font-bold rounded"
                        onClick={() => handleBookingModalOpen(room)}
                      >
                        Book This Room
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-300">No rooms available for this hotel.</p>
              )}
            </div>
          )}

          {activeTab === 'amenities' && (
            <div>
              <h2 className="text-2xl font-bold text-red-500 mb-4">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.facilities && hotel.facilities.length > 0 ? (
                  hotel.facilities.map((amenity, index) => (
                    <div key={index} className="flex items-center bg-gray-800 p-3 rounded">
                      <span className="text-red-400">{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-red-300">No amenities listed for this hotel.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gray-900 border-2 border-red-600 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center z-10">
                <h3 className="text-xl font-bold text-red-500">
                  {bookingStep === 1 && 'Select Dates'}
                  {bookingStep === 2 && 'Guest Details'}
                  {bookingStep === 3 && bookingConfirmed ? 'Booking Confirmed' : 'Review & Pay'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-red-400 hover:text-red-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                {/* Step 1: Date Selection */}
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-red-400 mb-2">Check-in Date</label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-3 text-red-500" />
                          <input
                            type="date"
                            name="startDate"
                            value={bookingData.startDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-gray-800 border border-gray-700 text-red-300 rounded-lg pl-10 p-2.5"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-red-400 mb-2">Check-out Date</label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-3 text-red-500" />
                          <input
                            type="date"
                            name="endDate"
                            value={bookingData.endDate}
                            onChange={handleInputChange}
                            min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                            className="w-full bg-gray-800 border border-gray-700 text-red-300 rounded-lg pl-10 p-2.5"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-red-400 mb-2">Room Details</h4>
                      <p className="text-red-300">{selectedRoom.room_type}</p>
                      <p className="text-red-300">Max Occupancy: {selectedRoom.max_occupancy}</p>
                      <p className="text-red-300">₹ {selectedRoom.room_price_per_day} per night</p>
                    </div>
                  </div>
                )}

                {/* Step 2: Guest Details */}
                {bookingStep === 2 && (
                  <div className="space-y-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-red-400">Guest Information</h4>
                        {bookingData.guests.length < selectedRoom.max_occupancy && (
                          <button
                            onClick={addGuest}
                            className="text-sm bg-red-600 hover:bg-red-700 text-black px-3 py-1 rounded"
                          >
                            + Add Guest
                          </button>
                        )}
                      </div>

                      {bookingData.guests.map((guest, index) => (
                        <div key={index} className="mb-4 last:mb-0 border-b border-gray-700 pb-4">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="text-md font-medium text-red-400">Guest {index + 1}</h5>
                            {index > 0 && (
                              <button
                                onClick={() => removeGuest(index)}
                                className="text-xs bg-gray-700 hover:bg-gray-600 text-red-300 px-2 py-1 rounded"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm text-red-400 mb-1">Full Name</label>
                              <div className="relative">
                                <FiUser className="absolute left-3 top-3 text-red-500" />
                                <input
                                  type="text"
                                  name="name"
                                  value={guest.name}
                                  onChange={(e) => handleGuestChange(index, e)}
                                  className="w-full bg-gray-700 border border-gray-600 text-red-300 rounded-lg pl-10 p-2 text-sm"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm text-red-400 mb-1">Age</label>
                              <input
                                type="number"
                                name="age"
                                min="1"
                                max="120"
                                value={guest.age}
                                onChange={(e) => handleGuestChange(index, e)}
                                className="w-full bg-gray-700 border border-gray-600 text-red-300 rounded-lg p-2 text-sm"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-red-400 mb-1">Aadhar Number</label>
                              <input
                                type="text"
                                name="aadhar"
                                value={guest.aadhar}
                                onChange={(e) => handleGuestChange(index, e)}
                                maxLength="12"
                                className="w-full bg-gray-700 border border-gray-600 text-red-300 rounded-lg p-2 text-sm"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="mt-4">
                        <label className="block text-sm text-red-400 mb-1">Special Requests</label>
                        <textarea
                          name="specialRequests"
                          value={bookingData.specialRequests}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full bg-gray-700 border border-gray-600 text-red-300 rounded-lg p-2 text-sm"
                          placeholder="Any special requirements..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Confirmation */}
                {bookingStep === 3 && !bookingConfirmed && (
                  <div className="space-y-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-red-400 mb-4">Booking Summary</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-md font-medium text-red-400 mb-2">Stay Details</h5>
                          <div className="space-y-2 text-red-300">
                            <p><span className="font-medium">Room:</span> {selectedRoom.room_type}</p>
                            <p><span className="font-medium">Check-in:</span> {new Date(bookingData.startDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Check-out:</span> {new Date(bookingData.endDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Nights:</span> {Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24))}</p>
                            <p><span className="font-medium">Guests:</span> {bookingData.guests.length}</p>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-md font-medium text-red-400 mb-2">Price Breakdown</h5>
                          <div className="space-y-2 text-red-300">
                            <div className="flex justify-between">
                              <span>Room Price ({Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24))} nights):</span>
                              <span>₹ {selectedRoom.room_price_per_day * Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24))}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-700 pt-2">
                              <span className="font-medium">Total Amount:</span>
                              <span className="font-bold">₹ {totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h5 className="text-md font-medium text-red-400 mb-2">Guest Details</h5>
                        <div className="space-y-3">
                          {bookingData.guests.map((guest, index) => (
                            <div key={index} className="bg-gray-700 p-3 rounded-lg">
                              <p className="text-red-300 font-medium">Guest {index + 1}: {guest.name}</p>
                              <p className="text-red-300 text-sm">Age: {guest.age}</p>
                              <p className="text-red-300 text-sm">Aadhar: {guest.aadhar}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {bookingStep === 3 && bookingConfirmed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <div className="mb-6">
                      <Lottie options={defaultOptions} height={150} width={150} />
                    </div>
                    <h4 className="text-2xl font-bold text-red-500 mb-2">Booking Confirmed!</h4>
                    <p className="text-red-300 text-center mb-6">
                      Your booking at {hotel.name} has been successfully confirmed.
                      A confirmation has been sent to your email.
                    </p>
                    <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md">
                      <div className="flex justify-between mb-2">
                        <span className="text-red-400">Booking ID:</span>
                        <span className="text-red-300 font-mono">BK{Math.floor(Math.random() * 1000000)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-red-400">Room:</span>
                        <span className="text-red-300">{selectedRoom.room_type}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-red-400">Dates:</span>
                        <span className="text-red-300">
                          {new Date(bookingData.startDate).toLocaleDateString()} - {new Date(bookingData.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold mt-4 pt-2 border-t border-gray-700">
                        <span className="text-red-400">Total Paid:</span>
                        <span className="text-red-300">₹ {totalAmount}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4 flex justify-between z-10">
                {bookingStep > 1 && bookingStep < 3 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-red-300 rounded-lg"
                  >
                    Back
                  </button>
                )}

                {bookingStep === 1 && (
                  <button
                    onClick={checkAvailability}
                    disabled={isCheckingAvailability}
                    className={`px-6 py-2 ml-auto bg-red-600 hover:bg-red-700 text-black font-bold rounded-lg flex items-center ${isCheckingAvailability ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isCheckingAvailability ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 0 7.938l3-2.647z"></path>
                        </svg>
                        Checking...
                      </>
                    ) : (
                      'Check Availability'
                    )}
                  </button>
                )}

                {bookingStep === 2 && (
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className={`px-6 py-2 ml-auto bg-red-600 hover:bg-red-700 text-black font-bold rounded-lg flex items-center ${paymentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {paymentLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Continue to Payment'
                    )}
                  </button>
                )}

                {bookingStep === 3 && !bookingConfirmed && (
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className={`px-6 py-2 ml-auto bg-green-600 hover:bg-green-700 text-black font-bold rounded-lg flex items-center ${paymentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <FiCheck className="mr-2" /> Confirm Booking
                  </button>
                )}

                {bookingConfirmed && (
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 ml-auto bg-red-600 hover:bg-red-700 text-black font-bold rounded-lg"
                  >
                    Done
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelDetailsPage;