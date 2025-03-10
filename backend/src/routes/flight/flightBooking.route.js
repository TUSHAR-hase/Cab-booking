import { Router } from "express";
const flightBookingRouter = Router();


flightBookingRouter.route("/register").post(registerHotelOwner);

export { flightBookingRouter };