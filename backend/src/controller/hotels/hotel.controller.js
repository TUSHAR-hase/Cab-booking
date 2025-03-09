import Hotel from "../../models/hotels/hotel.models";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import asyncHandler from "../../middleware/asyncHandler";
import { HotelRoom } from "../../models/hotels/hotelRoom.models";


//====================== Hotel CRUD ========================
const createHotel = asyncHandler(async (req, res) => {

    //check if the hotel owner is approved
    if (!req.hotel_owner || !req.hotel_owner.isApproved) {
        throw new ApiError(401, "You are not authorized to create a hotel");
    }
    //get the deatails 
    const { name, area, district, pincode, longitude, latitude, description } = req.body;

    //validate
    if (!name || !area || !district || !pincode || !longitude || !latitude || !description) {
        throw new ApiError(400, "Please provide all the required fields");
    }

    //check the hotel images
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "Please provide hotel images");
    }

    //make array of images 
    const hotelImages = req.files.map(file => file.path)

    //make obj of address
    const address = { area, district, pincode, longitude, latitude };

    //created hotel
    const newHotel = await Hotel.create({
        name,
        address,
        description,
        hotelImages
    });

    //check for error if not created 
    if (!newHotel) {
        throw new ApiError(500, "An error occurred while creating the hotel");
    }

    //send the response
    res.status(201).json(new ApiResponse(201, newHotel, "Hotel created successfully"));
});

const updateHotel = asyncHandler(async (req, res) => {

    //get the deatails
    const { hotel_id, name, area, district, pincode, longitude, latitude, description } = req.body;

    //check for hotel id
    if (!hotel_id) {
        throw new ApiError(400, "Please provide a hotel id");
    }

    //validate 
    if (!name || !area || !district || !pincode || !longitude || !latitude || !description) {
        throw new ApiError(400, "Please provide at least one field to update");
    }


    const address = { area, district, pincode, longitude, latitude };

    //find the hotel
    const hotel = await Hotel.findById(hotel_id);
    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    //update
    hotel.name = name;
    hotel.address = address;
    hotel.description = description;
    await hotel.save();

    res.status(200).json(new ApiResponse(200, hotel, "Hotel updated successfully"));
});

const updateHotelImages = asyncHandler(async (req, res) => {

    //get the id
    const { hotel_id } = req.body

    //validate
    if (!hotel_id) {
        throw new ApiError(400, "Please provide hotel information")
    }

    // find the hotel
    const hotel = await Hotel.findById(hotel_id)

    if (!hotel) {
        throw new ApiError(404, "Hotel not found!")
    }

    // check for images
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "Please provide room images");
    }
    //update images
    const hotelImages = req.files.map(file => file.path)
    hotel.hotelImages = hotelImages
    await hotel.save()


    return res.status(200).json(new ApiResponse(200, null, "Hotel images updated successfully "))
});

const deleteHotel = asyncHandler(async (req, res) => {
    const { hotel_id } = req.body;

    // Validate input
    if (!hotel_id) {
        throw new ApiError(400, "Please provide hotel information");
    }

    // Find the hotel
    const hotel = await Hotel.findById(hotel_id);
    if (!hotel) {
        throw new ApiError(404, "Hotel not found!");
    }

    // Delete all rooms associated with the hotel
    await HotelRoom.deleteMany({ hotel: hotel_id });

    // Delete the hotel
    await hotel.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Hotel and all associated rooms deleted successfully"));
});

const getOwnerHotels = asyncHandler(async (req, res) => {
    const hotel_owner_id = req.hotel_owner._id

    if (!hotel_owner_id) {
        throw new ApiError(400, "Please provide a hotel owner id");
    }

    const hotels = await Hotel.find({ hotel_owner: hotel_owner_id });

    if (hotels.length === 0) {
        throw new ApiError(404, "No hotels found");
    }

    res.status(200).json(new ApiResponse(200, hotels, "Hotels retrieved successfully"));
});

const getUnapprovedHotels = asyncHandler(async (req, res) => {
    const hotels = await Hotel.find({ isApproved: false });

    if (!hotels) {
        throw new ApiError(404, "No hotels found");
    }

    res.status(200).json(new ApiResponse(200, hotels, "Hotels retrieved successfully"));
})

const approveHotel = asyncHandler(async (req, res) => {
    const { hotel_id } = req.body;
    if (!hotel_id) {
        throw new ApiError(400, "Please provide a hotel id");
    }
    const hotel = await Hotel.findById(hotel_id);
    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    hotel.isApproved = true;
    await hotel.save();

    res.status(200).json(new ApiResponse(200, hotel, "Hotel approved successfully"));
});

//===========================================================


//=========================ROOM CRUD=========================

const addRooms = asyncHandler(async (req, res) => {
    //get the details
    const { hotel_id, room_type, room_price_per_day, status, facilities, max_occupancy, room_number } = req.body;

    //validate
    if (!hotel_id || !room_type || !room_price_per_day || !status || !facilities || !max_occupancy || !room_number) {
        throw new ApiError(400, "Please provide all the required fields");
    }

    //check for images
    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "Please provide room images");
    }

    //find the hotel
    const hotel = await Hotel.findById(hotel_id);
    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }


    const roomImages = req.files.map(file => file.path);

    //create room
    const newRoom = await HotelRoom.create({
        hotel: hotel_id,
        room_type,
        room_price_per_day,
        room_images: roomImages,
        status,
        facilities,
        max_occupancy,
        room_number

    });

    //check for error
    if (!newRoom) {
        throw new ApiError(500, "An error occurred while adding the room");
    }

    res.status(201).json(new ApiResponse(201, newRoom, "Room added successfully"));
})

const updateRoomStatus = asyncHandler(async (req, res) => {
    const { room_id, status } = req.body;
    if (!room_id || !status) {
        throw new ApiError(400, "Please provide all the required fields");
    }
    const room = await HotelRoom.findById(room_id);
    if (!room) {
        throw new ApiError(404, "Room not found");
    }
    room.status = status;
    await room.save();
    res.status(200).json(new ApiResponse(200, room, "Room status updated successfully"));
})

const updateRoom = asyncHandler(async (req, res) => {
    //get details
    const { room_id, room_type, room_price_per_day, status, facilities, max_occupancy, room_number } = req.body;

    //validate
    if (!room_id || !room_type || !room_price_per_day || !status || !facilities || !max_occupancy || !room_number) {
        throw new ApiError(400, "Please provide all the required fields");
    }

    //find the room
    const room = await HotelRoom.findById(room_id);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    //update
    room.room_type = room_type;
    room.room_price_per_day = room_price_per_day;
    room.status = status;
    room.facilities = facilities;
    room.max_occupancy = max_occupancy;
    room.room_number = room_number;
    await room.save();


    res.status(200).json(new ApiResponse(200, room, "Room updated successfully"));
})


const updateRoomImages = asyncHandler(async (req, res) => {
    const { room_id } = req.body
    if (!room_id) {
        throw new ApiError(400, "Please provide room information")
    }

    const room = await HotelRoom.findById(room_id)

    if (!room) {
        throw new ApiError(404, "Room not found!")
    }

    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "Please provide room images");
    }
    const roomImages = req.files.map(file => file.path);
    room.room_images = roomImages
    await room.save()

    return res.status(200).json(new ApiResponse(200, null, "Room images updated successfully "))
})

const deleteRoom = asyncHandler(async (req, res) => {
    const { room_id } = req.body
    if (!room_id) {
        throw new ApiError(400, "Please provide room information")
    }

    const room = await HotelRoom.findById(room_id)

    if (!room) {
        throw new ApiError(404, "Room not found!")
    }

    await room.deleteOne()

    return res.status(200).json(new ApiResponse(200, null, "Room deleted successfully "))
})

//===========================================================

const searchHotels = asyncHandler(async (req, res) => {
    const { name, area, district, pincode } = req.query;

    let filter = {};
    if (name) filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
    if (area) filter["address.area"] = { $regex: area, $options: "i" };
    if (district) filter["address.district"] = { $regex: district, $options: "i" };
    if (pincode) filter["address.pincode"] = pincode;

    const hotels = await Hotel.find(filter).exec();

    if (hotels.length === 0) {
        throw new ApiError(404, "No hotels found matching your criteria");
    }

    res.status(200).json(new ApiResponse(200, hotels, "Hotels retrieved successfully"));
});

const getRooms = asyncHandler(async (req, res) => {
    const { hotel_id } = req.query;
    if (!hotel_id) {
        throw new ApiError(400, "Please provide a hotel id");
    }
    const rooms = await HotelRoom.find({ hotel: hotel_id });
    if (rooms.length === 0) {
        throw new ApiError(404, "No rooms found");
    }
    res.status(200).json(new ApiResponse(200, rooms, "Rooms retrieved successfully"));
});


export {
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
    deleteRoom
};