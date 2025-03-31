import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { HotelBooking } from "../../models/hotels/hotelBookings.model.js";
import { HotelRoom } from "../../models/hotels/hotelRoom.models.js";



const createBooking = async (req, res) => {
    try {
        const {
            hotel,
            room,
            bookingStartDate,
            bookingEndDate,
            totalAmount,
            personDetails
        } = req.body;

        // const userId = "67cc5d306491dfaf6decf6f0"; // Assuming user is logged in
        const userId = req.user._id; // Assuming user is logged in

        // Validate personDetails
        if (!personDetails || !Array.isArray(personDetails) || personDetails.length === 0) {
            return res.status(400).json({ message: "At least one person detail is required." });
        }
        console.log(personDetails);
        console.log(req.user);

        // Validate each person detail
        for (const person of personDetails) {
            if (!person.name || !person.age || !person.aadhar) {
                return res.status(400).json({
                    message: "Each person must have name, age, and aadhaar number."
                });
            }
        }

        // Check if room is available for booking dates
        const existingBooking = await HotelBooking.findOne({
            room,
            $or: [
                { bookingStartDate: { $lte: bookingEndDate }, bookingEndDate: { $gte: bookingStartDate } },
            ],
            bookingStatus: { $ne: "cancelled" },
        });

        if (existingBooking) {
            return res.status(400).json({ message: "Room not available for selected dates." });
        }

        const newBooking = await HotelBooking.create({
            hotel,
            user: userId,
            room,
            bookingStartDate,
            bookingEndDate,
            totalAmount,
            paymentStatus: "pending", // Update after payment success
            personDetails // Include person details in the booking
        });

        res.status(201).json({ success: true, booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: "Error creating booking", error: error.message });
    }
};
const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await HotelBooking.find({ user: userId })
            .populate("hotel")
            .populate("room");

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        const booking = await HotelBooking.findOne({ _id: bookingId, user: userId });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.bookingStatus === "cancelled") {
            return res.status(400).json({ message: "Booking already cancelled." });
        }

        booking.bookingStatus = "cancelled";
        await booking.save();

        // Optionally: Initiate refund if payment was made
        // if (booking.paymentStatus === "completed") { ... }

        res.status(200).json({ success: true, message: "Booking cancelled successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
};

//owner only
const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { bookingStatus, paymentStatus } = req.body;

        const booking = await HotelBooking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (bookingStatus) booking.bookingStatus = bookingStatus;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        await booking.save();
        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ message: "Error updating booking", error: error.message });
    }
};

const checkRoomAvailability = async (req, res) => {
    try {
        const { roomId, startDate, endDate } = req.body;


        const conflictingBookings = await HotelBooking.find({
            room: roomId,
            bookingStartDate: { $lte: new Date(endDate) },
            bookingEndDate: { $gte: new Date(startDate) },
            bookingStatus: { $ne: "cancelled" },
        });

        const isAvailable = conflictingBookings.length === 0;
        res.status(200).json({ isAvailable });
    } catch (error) {
        res.status(500).json({ message: "Error checking availability", error: error.message });
    }
};
export { checkRoomAvailability, createBooking, getUserBookings };