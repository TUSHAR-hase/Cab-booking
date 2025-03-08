import { Router } from "express";
import { logineHotelOwner, registerHotelOwner, approveHotelOwner, rejectHotelOwner, getHotelOwner, getUnapprovedHotelOwner, verifyOtp } from "../../controller/hotels/hotelOwner.controller.js";
const hotelOwnerRouter = Router();


hotelOwnerRouter.route("/register").post(registerHotelOwner);
hotelOwnerRouter.route("/verify-otp").post(verifyOtp);
hotelOwnerRouter.route("/login").post(logineHotelOwner);

hotelOwnerRouter.route("/approve").put(approveHotelOwner);
hotelOwnerRouter.route("/reject").put(rejectHotelOwner);
hotelOwnerRouter.route("/get-hotel-owner").get(getHotelOwner);
hotelOwnerRouter.route("/get-unapproved-hotel-owner").get(getUnapprovedHotelOwner);
export { hotelOwnerRouter };