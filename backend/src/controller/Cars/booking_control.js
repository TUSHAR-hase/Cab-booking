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
export const acceptBooking = async (req, resp) => {
    try {
        const { id } = req.params;
        console.log("Received booking ID:", req.params.id); 

        if (!id) {
            return resp.status(400).json({ message: "Booking ID is required" });
        }

        const updatedBooking = await booking.findByIdAndUpdate(
            id,
            { status: "accepted" },  
            { new: true }
        );

        if (!updatedBooking) {
            return resp.status(404).json({ message: "Booking not found" });
        }

        resp.status(200).json({ message: "Booking accepted", booking: updatedBooking });
    } catch (error) {
        console.error("Error accepting booking:", error);
        resp.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
export const complateBooking = async (req, resp) => {
    try {
        const { id } = req.params;

        if (!id) {
            return resp.status(400).json({ message: "Booking ID is required" });
        }

        const updatedBooking = await booking.findByIdAndUpdate(
            id,
            { status: "completed" },  
            { new: true }
        );

        if (!updatedBooking) {
            return resp.status(404).json({ message: "Booking not found" });
        }

        resp.status(200).json({ message: "Booking complated", booking: updatedBooking });
    } catch (error) {
        console.error("Error compalted booking:", error);
        resp.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
export const rejectBooking = async (req, resp) => {
    try {
        const { id } = req.params;

        if (!id) {
            return resp.status(400).json({ message: "Booking ID is required" });
        }

        const updatedBooking = await booking.findByIdAndUpdate(
            id,
            { status: "rejected" },  
            { new: true }
        );

        if (!updatedBooking) {
            return resp.status(404).json({ message: "Booking not found" });
        }

        resp.status(200).json({ message: "Booking rejected", booking: updatedBooking });
    } catch (error) {
        console.error("Error rejecting booking:", error);
        resp.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

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
export const getbookingByid = async (req, resp) => {
    try {
        if (!req.params.id) {
            return resp.status(400).json({ message: "Rider ID is required" });
        }

        const bookings = await booking.find({ Rider_id: req.params.id })
            .populate("user_id", "name contact") 
            .populate("vehicle_id", "vehicle_number vehicle_type"); 

        if (!bookings || bookings.length === 0) {
            return resp.status(404).json({ message: "Booking not found" });
        }

        resp.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error); 
        resp.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

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