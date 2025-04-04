import { Router } from "express";
import { checkRoomAvailability, createBooking, getUserBookings } from "../../controller/hotels/hotelBooking.controller.js";
import { verifyHotelOwner } from "../../middlewares/Hotels/verifyHotelOwner.middleware.js";
import { verifyUser } from "../../middlewares/main/auth.middleware.js";
const hotelBookingRouter = Router();

hotelBookingRouter.route("/rooms/check-availability").post(verifyUser, checkRoomAvailability)//add user middleware
hotelBookingRouter.route("/").post(verifyUser, createBooking)//add user middleware
hotelBookingRouter.route("/hotel").get(verifyUser, getUserBookings)//add user middleware
export { hotelBookingRouter };