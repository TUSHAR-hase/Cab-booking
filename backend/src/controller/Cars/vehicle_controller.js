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
            res.status(500).json({ message: "vehicle not found" })
        } else {
            res.status(200).json(vehicle)
        }
    } catch (error) {
        res.status(500).json(error)

    }
}
export const update_vehicle = async (res, resp) => {
    try {
        const updatevehicle = await Vehicle.findByIdAndUpdate(res.params.id, res.body, { new: true })
        if (!updatevehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.status(200).json(updatevehicle);
    } catch (error) {
        res.status(500).json(error)
    }
}
export const delate_vehicle = async (res, resp) => {
    try {
        const delatevehicle = await Vehicle.findByIdAndDelete(res.params.id)
        if (!delatevehicle) return res.status(404).json({ message: "Vehicle not found" });
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json(error)
    }
}