import { Vehicle } from "../../models/Cabs/cab_vehicle_model.js"
import fs from "fs"
export const create_vehicle = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Vehicle image is required" });
      }
  
      // Verify file was saved successfully
      if (!fs.existsSync(req.file.path)) {
        throw new Error("File upload failed");
      }
  
      const vehicle = new Vehicle({
        ...req.body,
        perKm_price: parseFloat(req.body.perKm_price),
        seating_capacity: parseInt(req.body.seating_capacity),
        vehicle_image: req.file.path.replace(/\\/g, '/') // Convert to forward slashes
      });
  
      const savedVehicle = await vehicle.save();
      res.status(201).json(savedVehicle);
  
    } catch (error) {
      console.error("Error creating vehicle:", error);
      
      // Clean up failed upload
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
  
      res.status(500).json({ 
        message: "Error creating vehicle",
        error: error.message 
      });
    }
  };
export const getvehicle = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        if (vehicles) {
            res.status(200).json(vehicles)
        }
    } catch (error) {
        res.status(500).json(error)

    }
}
export const getvehicleByid = async (res, resp) => {
    try {
        const vehicle = await Vehicle.findById(res.params.id)
        if (!vehicle) {
            resp.status(500).json({ message: "vehicle not found" })
        } else {
            resp.status(200).json(vehicle)
        }
    } catch (error) {
        resp.status(500).json(error)

    }
}
export const getvehicleByriderid = async (req, resp) => {
    try {
        // console.log("Received Rider ID:", req.params.id); 
        if (!req.params.id) {
            return resp.status(400).json({ message: "Rider ID is required" });
        }

        const vehicle = await Vehicle.find({ Rider_id: req.params.id });
        if (!vehicle) {
            return resp.status(404).json({ message: "Vehicle not found" });
        }

        resp.status(200).json(vehicle);
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        resp.status(500).json({ message: "Server error", error });
    }
};


export const update_vehicle = async (res, resp) => {
    try {
        const updatevehicle = await Vehicle.findByIdAndUpdate(res.params.id, res.body, { new: true })
        if (!updatevehicle) return resp.status(404).json({ message: "Vehicle not found" });
        resp.status(200).json(updatevehicle);
    } catch (error) {
        resp.status(500).json(error)
    }
}
export const delate_vehicle = async (res, resp) => {
    try {
        const delatevehicle = await Vehicle.findByIdAndDelete(res.params.id)
        if (!delatevehicle) return resp.status(404).json({ message: "Vehicle not found" });
        resp.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        resp.status(500).json(error)
    }
}