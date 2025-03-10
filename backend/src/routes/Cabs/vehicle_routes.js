import express from "express"
import { getvehicle,getvehicleByid,delate_vehicle,update_vehicle,create_vehicle } from "../../controller/Cars/vehicle_controller.js"

const router = express.Router()
router.get("/getallvehicle",getvehicle)
router.get("/getvehicle/:id",getvehicleByid)
router.put("/updatevehicle/:id",update_vehicle)
router.delete("/delatevehicle/:id",delate_vehicle)
router.post("/createvehicle",create_vehicle)

export default router
