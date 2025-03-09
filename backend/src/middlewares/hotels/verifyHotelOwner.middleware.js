import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../middleware/asyncHandler";
import { HotelOwner } from "../../models/hotels/hotelOwner.model.js";


const verifyHotelOwner = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedinfo = await jwt.verify(token, process.env.JWT_SECRET)

        const owner = await HotelOwner.findById(decodedinfo?._id)

        if (!owner) {
            throw new ApiError(404, "Invalid Access Token")
        }
        req.hotel_owner = owner
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Token Expired');
        }

        throw new ApiError(404, error?.message)
    }
})

export { verifyHotelOwner };