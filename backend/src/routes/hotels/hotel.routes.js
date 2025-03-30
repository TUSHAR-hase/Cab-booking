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
    deleteRoom,
    getOwnerRooms
} from "../../controller/hotels/hotel.controller.js"
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyHotelOwner } from "../../middlewares/Hotels/verifyHotelOwner.middleware.js";
const hotelRouter = Router();

//----------------------------hotel routes-----------------------------------------

hotelRouter.route("/create").post(verifyHotelOwner, upload.array("images", 10), createHotel);
hotelRouter.route("/get-owner-hotels").get(verifyHotelOwner, getOwnerHotels)
hotelRouter.route("/update").post(verifyHotelOwner, upload.none(), updateHotel)
hotelRouter.route("/update-images").post(upload.array("images", 10), verifyHotelOwner, updateHotelImages);
hotelRouter.route("/delete").post(verifyHotelOwner, deleteHotel)

//----------------------------room routes-----------------------------------------

hotelRouter.route("/room/create").post(verifyHotelOwner, upload.array("images", 10), addRooms)
hotelRouter.route("/room/get-owner-rooms").get(verifyHotelOwner, getOwnerRooms)
hotelRouter.route("/room/update-status").post(verifyHotelOwner, updateRoomStatus)
hotelRouter.route("/room/update-images").post(verifyHotelOwner, upload.array("images", 10), updateRoomImages)
hotelRouter.route("/room/update").post(verifyHotelOwner, upload.none(), updateRoom)
hotelRouter.route("/room/delete").post(verifyHotelOwner, deleteRoom)
hotelRouter.route("/room/get").get(verifyHotelOwner, getRooms)

//-----------------------------for user--------------------------------------------

hotelRouter.route("/search").get(searchHotels)


//----------------------------for admin--------------------------------------------

hotelRouter.route("/admin/get-unapproved-hotels").get(getUnapprovedHotels) // add middleware to check if user is admin
hotelRouter.route("/approve").post(approveHotel)// add middleware to check if user is admin

export { hotelRouter };