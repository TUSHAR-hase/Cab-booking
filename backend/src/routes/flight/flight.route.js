import { Router } from "express";
import { otpVerification, registerOwner } from "../../controller/flight/flightAdmin.controller.js";
const flightRouter = Router();


flightRouter.route("/register").post(registerOwner);
flightRouter.route("/otp-verify").post(otpVerification);

export { flightRouter };