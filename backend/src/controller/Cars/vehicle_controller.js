import { Vehicle } from "../../models/Cabs/cab_vehicle_model.js"

export const create_vehicle = async (res, resp) => {
    try {
        const newvehicle = new Vehicle(res.body);
        const seved_vehicle = await newvehicle.save();
     console.log(`seved vehicle${seved_vehicle}`)
     return resp.status(201).json({ 
        message: "Vehicle added successfully!", 
        vehicle: newvehicle 
    });
    } catch (error) {
        console.log(error)
    }
}
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