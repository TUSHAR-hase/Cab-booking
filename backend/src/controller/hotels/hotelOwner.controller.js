import { HotelOwner } from "../../models/hotels/hotelOwner.model.js";
import ApiError from "../../utils/apiError.js";
import ApiResponser from "../../utils/apiResponse.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { User } from "../../models/main/user.model.js";


const registerHotelOwner = asyncHandler(async (req, res) => {
    // Get the bussinessName and bussinessRegNo from the request body
    const { bussinessName, bussinessRegNo } = req.body;

    // Check if the user exists
    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the user is already a hotel owner
    const hotelOwner = await HotelOwner.findOne({ user: req.user.id });

    if (hotelOwner) {
        throw new ApiError(400, "User is already a hotel owner");
    }

    // Create a new hotel owner
    const newHotelOwner = await HotelOwner.create({
        user: req.user.id,
        bussinessName,
        bussinessRegNo
    });

    // Send the response
    res.status(201).json(new ApiResponser(201, newHotelOwner, "Hotel owner registered successfully"));
});

const getHotelOwner = asyncHandler(async (req, res) => {
    // Get the hotel owner
    const hotelOwner = await HotelOwner.findOne({ user: req.user.id });

    // Send the response
    res.status(200).json(new ApiResponser(200, hotelOwner, "Hotel owner retrieved successfully"));
});

const approveHotelOwner = asyncHandler(async (req, res) => {
    // Get the hotel owner
    const hotelOwner = await HotelOwner.findById(req.params.id);

    if (!hotelOwner) {
        throw new ApiError(404, "Hotel owner not found");
    }

    // Update the hotel owner
    hotelOwner.isApproved = true;
    await hotelOwner.save();

    // Send the response
    res.status(200).json(new ApiResponser(200, hotelOwner, "Hotel owner approved successfully"));
});

export { registerHotelOwner, getHotelOwner, approveHotelOwner };