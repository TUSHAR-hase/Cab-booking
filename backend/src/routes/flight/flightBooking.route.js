import { Router } from "express";
import { bookingFlight, searchFlights } from "../../controller/flight/flight.controller.js";
import authenticateUser from "../../middlewares/flight/authenticateUser.middleware.js";
const flightBookingRouter = Router();


//flightBookingRouter.route("/register").post(registerHotelOwner);

flightBookingRouter.route("/search-flight").get(searchFlights);
flightBookingRouter.route("/book-flight").post(authenticateUser,bookingFlight);

export { flightBookingRouter };