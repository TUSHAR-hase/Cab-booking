import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../middleware/asyncHandler";
import HotelBooking from "../models/hotelBookingModel.js";
import HotelRoom from "../models/hotelRoomModel.js";


const createBooking = asyncHandler(async (req, res) => {
    const { hotel, room, bookingStartDate, bookingEndDate, totalAmount } = req.body;

    if (!hotel || !room || !bookingStartDate || !bookingEndDate || !totalAmount) {
        throw new ApiError(400, "All fields are required");
    }

    const startDate = new Date(bookingStartDate);
    const endDate = new Date(bookingEndDate);

    if (startDate >= endDate) {
        throw new ApiError(400, "Booking start date must be before end date");
    }

    const roomExists = await HotelRoom.findById(room);
    if (!roomExists) {
        throw new ApiError(404, "Room not found");
    }

    const existingBooking = await HotelBooking.findOne({
        room,
        $or: [
            { bookingStartDate: { $lt: endDate }, bookingEndDate: { $gt: startDate } }
        ]
    });

    if (existingBooking) {
        throw new ApiError(400, "Room is already booked for the selected dates");
    }

    const booking = await HotelBooking.create({
        hotel,
        user: req.user.id, // needs to add verifyUser middleware
        room,
        bookingStartDate: startDate,
        bookingEndDate: endDate,
        totalAmount,
        paymentStatus: "pending",
    });

    res.status(201).json(new ApiResponse(201, booking, "Booking created successfully"));
});

const getUserBookings = asyncHandler(async (req, res) => {
    const bookings = await HotelBooking.find({ user: req.user.id })
        .populate("hotel", "name address")
        .populate("room", "roomType price")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, bookings, "User bookings retrieved successfully"));
});

const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await HotelBooking.find()
        .populate("user", "name email")
        .populate("hotel", "name")
        .populate("room", "roomType");

    res.status(200).json(new ApiResponse(200, bookings, "All bookings retrieved successfully"));
});

const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "Invalid booking ID");
    }

    const booking = await HotelBooking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (req.user.id !== booking.user.toString()) {
        throw new ApiError(403, "You are not authorized to cancel this booking");
    }

    await HotelBooking.findByIdAndDelete(bookingId);

    res.status(200).json(new ApiResponse(200, null, "Booking canceled successfully"));
});

export { createBooking, getUserBookings, getAllBookings, cancelBooking };