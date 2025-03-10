import { Router } from "express";
import { logineHotelOwner, registerHotelOwner, approveHotelOwner, rejectHotelOwner, getHotelOwner, getUnapprovedHotelOwner, verifyOtp } from "../../controller/hotels/hotelOwner.controller.js";
const hotelOwnerRouter = Router();


hotelOwnerRouter.route("/register").post(registerHotelOwner);
hotelOwnerRouter.route("/verify-otp").post(verifyOtp);
hotelOwnerRouter.route("/login").post(logineHotelOwner);

hotelOwnerRouter.route("/get-hotel-owner").get(getHotelOwner);

hotelOwnerRouter.route("/admin/reject-owner").post(rejectHotelOwner);  // admin verification middleware missing!
hotelOwnerRouter.route("/admin/approve-owner").post(approveHotelOwner); // admin verification middleware missing!
hotelOwnerRouter.route("/admin/get-unapproved-hotel-owner").get(getUnapprovedHotelOwner);// admin verification middleware missing!
export { hotelOwnerRouter };