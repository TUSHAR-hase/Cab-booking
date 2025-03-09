import { Router } from "express";
import {
    createHotel,
    getOwnerHotels,
    addRooms,
    updateRoomStatus,
    searchHotels,
    getRooms,
    updateHotel,
    updateHotelImages,
    deleteHotel,
    getUnapprovedHotels,
    approveHotel,
    updateRoom,
    updateRoomImages,
    deleteRoom
} from "../../controller/hotels/hotel.controller.js"
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyHotelOwner } from "../../middlewares/Hotels/verifyHotelOwner.middleware.js";
const hotelRouter = Router();

//----------------------------hotel routes-----------------------------------------

hotelRouter.route("/create").post(verifyHotelOwner, upload.fields([{ name: "hotelImages" }]), createHotel);
hotelRouter.route("/get-owner-hotels").get(verifyHotelOwner, getOwnerHotels)
hotelRouter.route("/update").post(verifyHotelOwner, updateHotel)
hotelRouter.route("/update-images").post(verifyHotelOwner, upload.fields([{ name: "hotelImages" }]), updateHotelImages)
hotelRouter.route("/delete").delete(verifyHotelOwner, deleteHotel)

//----------------------------room routes-----------------------------------------

hotelRouter.route("/room/create").post(verifyHotelOwner, addRooms)
hotelRouter.route("/room/update-status").post(verifyHotelOwner, updateRoomStatus)
hotelRouter.route("/room/update-images").post(verifyHotelOwner, updateHotelImages)
hotelRouter.route("/room/update").post(verifyHotelOwner, updateRoom)
hotelRouter.route("/room/delete").delete(verifyHotelOwner, deleteRoom)
hotelRouter.route("/room/get").get(verifyHotelOwner, getRooms)

//-----------------------------for user--------------------------------------------

hotelRouter.route("/search").get(searchHotels)


//----------------------------for admin--------------------------------------------

hotelRouter.route("/admin/get-unapproved-hotels").get(getUnapprovedHotels) // add middleware to check if user is admin
hotelRouter.route("/approve").post(approveHotel)// add middleware to check if user is admin

export { hotelRouter };