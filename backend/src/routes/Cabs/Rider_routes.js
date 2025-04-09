import express from "express"
import { getRider,getRidersByid,add_rider,update_Rider,delate_Rider,loginrider,verifyOtp, complate_Otp } from "../../controller/Cars/Rider_controller.js"

const router = express.Router()
router.get("/getrider",getRider)
router.get("/getRider/:id",getRidersByid)
router.put("/updateRider/:id",update_Rider)
router.delete("/delateRider/:id",delate_Rider)
router.post("/createRider",add_rider)
router.post("/loginRider",loginrider)
router.post("/otp-veriyfy",verifyOtp)
router.post("/complate-veriyfy",complate_Otp)







export default router
