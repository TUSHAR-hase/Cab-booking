import { Router } from "express";
import { otpVerification, registerOwner,loginOwner, addFlight, getFlights, updateFlight, cancleFlight, deleteFlight, getBookingsForAdmin } from "../../controller/flight/flightAdmin.controller.js";
import authenticateToken from "../../middlewares/flight/authenticateToken.middlewares.js";
const flightRouter = Router();


flightRouter.route("/register").post(registerOwner);
flightRouter.route("/login").post(loginOwner);
flightRouter.route("/otp-verify").post(otpVerification);
flightRouter.route("/add-flight").post(authenticateToken,addFlight);
flightRouter.route("/get-flight").get(authenticateToken,getFlights);
flightRouter.route("/update-flight").put(authenticateToken,updateFlight);
flightRouter.route("/cancel-flight").put(authenticateToken,cancleFlight);
flightRouter.route("/delete-flight/:id").delete(authenticateToken,deleteFlight);

flightRouter.route("/bookings").get(authenticateToken,getBookingsForAdmin);

export { flightRouter };