import express from "express"
import multer from "multer";
import path from "path";
import fs from "fs"
import { getvehicle,getvehicleByid,delate_vehicle,update_vehicle,create_vehicle,getvehicleByriderid } from "../../controller/Cars/vehicle_controller.js"

const router = express.Router()
// In your vehicle_routes.js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join('uploads', 'vehicles');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `vehicle_${Date.now()}${ext}`);
  }
});
  const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });
router.get("/getallvehicle",getvehicle)
router.get("/getvehicle/:id",getvehicleByid)
router.get("/getvehiclebyriderid/:id",getvehicleByriderid)


router.put("/updatevehicle/:id",update_vehicle)
router.delete("/delatevehicle/:id",delate_vehicle)
router.post("/createvehicle",upload.single("vehicle_image"),create_vehicle)


export default router
