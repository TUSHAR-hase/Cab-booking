import Hotel from "../../models/hotels/hotel.models";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../middleware/asyncHandler";

const createHotel = asyncHandler(async (req, res) => {
    const { name, area, district, pincode, longitude, latitude, description, hotelImages } = req.body;

    const newHotel = await Hotel.create({
        name,
        address,
        description,
        hotelImages
    });

    res.status(201).json(new ApiResponse(201, newHotel, "Hotel created successfully"));
});