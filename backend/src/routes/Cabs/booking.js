import express from "express"
import {getbooking,create_booking,getbookingByid,delate_booking,update_booking,acceptBooking,rejectBooking,complateBooking} from "../../controller/Cars/booking_control.js"

const router = express.Router()
router.get("/getallbooking",getbooking)
router.get("/getbooking/:id",getbookingByid)
router.put("/updatebooking/:id",update_booking)
router.put("/acceptbooking/:id",acceptBooking)
router.put("/completedbooking/:id",complateBooking)

router.put("/rejectbooking/:id",rejectBooking)
router.delete("/delatebooking/:id",delate_booking)
router.post("/createbooking",create_booking)





export default router
