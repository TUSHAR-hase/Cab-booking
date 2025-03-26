import { booking } from "../../models/Cabs/cab_booking_model.js";


export const create_booking = async (res, resp) => {
    try {
        const { from, to, pickupTime, vehicalid, rider_id, userId } = res.body
        const newbooking = new booking({
            user_id: userId,
            vehicle_id: vehicalid,
            Rider_id: rider_id,
            source_location: {
                address:from
            },
            destination_location: {
                address:to
            },
            pickup_time: pickupTime
        });
        const seved_booking = await newbooking.save();
       
            console.log(`seved booking${seved_booking}`)
        return resp.status(201).json({
            message: "booking added successfully!",
            booking: newbooking
        });
    } catch (error) {
        console.log(error)
    }
}
export const getbooking = async (req, res) => {
    try {
        const bookings = await booking.find();
        if (bookings) {
            res.status(200).json(bookings)
        }
    } catch (error) {
        res.status(500).json(error)

    }
}
export const getbookingByid = async (res, resp) => {
    try {
        const bookings = await booking.findById(res.params.id)
        if (!bookings) {
            res.status(500).json({ message: "booking not found" })
        } else {
            res.status(200).json(bookings)
        }
    } catch (error) {
        res.status(500).json(error)

    }
}
export const update_booking = async (res, resp) => {
    try {
        const updatebooking = await booking.findByIdAndUpdate(res.params.id, res.body, { new: true })
        if (!updatebooking) return res.status(404).json({ message: "booking not found" });
        res.status(200).json(updatebooking);
    } catch (error) {
        res.status(500).json(error)
    }
}
export const delate_booking = async (res, resp) => {
    try {
        const delatebooking = await booking.findByIdAndDelete(res.params.id)
        if (!delatebooking) return res.status(404).json({ message: "booking not found" });
        res.status(200).json({ message: "booking deleted successfully" });
    } catch (error) {
        res.status(500).json(error)
    }
}