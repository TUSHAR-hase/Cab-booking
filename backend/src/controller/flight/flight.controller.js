import { Flight } from "../../models/flight/flightSchema.model.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { Schedule } from "../../models/flight/schedule.model.js";
import { FlightBooking } from "../../models/flight/flightBooking.model.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const searchFlights = async (req, res) => {
  try {
    const { departure_time, departure_station, destination_station } =
      req.query;

    const filter = {};

    // 🎯 Filter by full day if departure_time (date only) is provided
    if (departure_time) {
      const date = new Date(departure_time);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      filter.departure_time = {
        $gte: date.toISOString(),
        $lt: nextDate.toISOString(),
      };
    }

    if (departure_station) filter.departure_station = departure_station;
    if (destination_station) filter.destination_station = destination_station;

    const schedules = await Schedule.find(filter).populate("flight_id").lean();

    const dummyFlights = await Promise.all(
      schedules.map(async (schedule, index) => {
        const flight = schedule.flight_id;

        const discounts = ["5% OFF", "10% OFF", "15% OFF"];
        const discount =
          discounts[Math.floor(Math.random() * discounts.length)];


          const bookingsForEconomy = await FlightBooking.find({
            flight_id: flight._id,
            schedule_id: schedule._id,
            class: "Economy",
            booking_status: "Confirmed",
          });
          let totalBookedForEconomy = 0;
          bookingsForEconomy.forEach((booking) => {
            if (booking.booked_seat) {
              totalBookedForEconomy += booking.booked_seat;
            }
          });

          const bookingsForBusiness = await FlightBooking.find({
            flight_id: flight._id,
            schedule_id: schedule._id,
            class: "Business",
            booking_status: "Confirmed",
          });
          let totalBookedForBusiness = 0;
          bookingsForBusiness.forEach((booking) => {
            if (booking.booked_seat) {
              totalBookedForBusiness += booking.booked_seat;
            }
          });


          const bookingsForFirst = await FlightBooking.find({
            flight_id: flight._id,
            schedule_id: schedule._id,
            class: "First",
            booking_status: "Confirmed",
          });
          let totalBookedForFirst = 0;
          bookingsForFirst.forEach((booking) => {
            if (booking.booked_seat) {
              totalBookedForFirst += booking.booked_seat;
            }
          });

        return {
          id: index + 1,
          airline: flight.flight_name,
          flightId: flight._id,
          scheduleId: schedule._id,
          price: schedule.economy_price,
          duration: schedule.duration,
          discount,
          departureStation: schedule.departure_station,
          departureTime: schedule.departure_time,
          arrivalTime: schedule.arrival_time,
          totalSeats: flight.number_of_seats,
          seatsByClass: {
            economy: {
              total: flight.economy_seats,
              available: flight.economy_seats - totalBookedForEconomy,
              price: schedule.economy_price,
            },
            business: {
              total: flight.business_seats,
              available: flight.business_seats - totalBookedForBusiness,
              price: schedule.business_price,
            },
            first: {
              total: flight.first_class_seats,
              available: flight.first_class_seats - totalBookedForFirst,
              price: schedule.first_class_price,
            },
          },
        };
      })
    );

    res.status(200).json(new ApiResponse(200, dummyFlights, "Flights found"));
  } catch (error) {
    console.error("Error fetching filtered flights:", error);
    res.status(500).json(new ApiResponse(500, error, "Error fetching flights"));
  }
};

const bookingFlight = async (req, res) => {
  try {
    const { date, schedule_id, classType, passengers } = req.body;
    const travelClass = classType.charAt(0).toUpperCase() + classType.slice(1);
    const user_id = req.user.user._id;

    const allowedClasses = ["Economy", "Business", "First"];
    if (!allowedClasses.includes(travelClass)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid travel class"));
    }

    const schedule = await Schedule.findById(schedule_id).populate("flight_id");
    if (!schedule) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Schedule not found"));
    }

    const flight = schedule.flight_id;

    // Get total seats for the selected class
    let totalSeats, price, luggage;
    switch (travelClass) {
      case "Economy":
        totalSeats = flight.economy_seats;
        price = schedule.economy_price;
        luggage = "20kg";
        break;
      case "Business":
        totalSeats = flight.business_seats;
        price = schedule.business_price;
        luggage = "30kg";
        break;
      case "First":
        totalSeats = flight.first_class_seats;
        price = schedule.first_class_price;
        luggage = "40kg";
        break;
    }

    const options = {
      amount: price * 100 * passengers.length, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Count already booked seats for this flight, schedule, and class
    const bookings = await FlightBooking.find({
      flight_id: flight._id,
      schedule_id,
      class: travelClass,
      booking_status: "Confirmed",
    });
    let totalBooked = 0;
    const bookedCount = bookings.forEach((booking) => {
      if (booking.booked_seat) {
        totalBooked += booking.booked_seat;
      }
    });

    const availableSeats = totalSeats - bookedCount;

    if (availableSeats <= 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "No available seats"));
    }

    const newPassengers = passengers.map((passenger, index) => ({
      name: passenger.name,
      age: passenger.age,
      seat_number: (parseInt(totalBooked) + index + 1),
    }));

    // Create the booking
    const booking = new FlightBooking({
      user_id,
      flight_id: flight._id,
      schedule_id,
      class: travelClass,
      date,
      booking_status: "Confirmed",
      price: price * passengers.length,
      luggage_details: luggage,
      passenger_detail: newPassengers,
      booked_seat:  passengers.length, // You can implement seat allocation logic here
      payment_id: order.id,
    });

    const data = {
      booking: booking,
      order: order,
    };

    await booking.save();

    res
      .status(201)
      .json(new ApiResponse(201, data, "Flight booked successfully"));
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json(new ApiResponse(500, error, "Error booking flight"));
  }
};

const getBookings = async (req, res) => {
  try {
    // Ensure only logged-in user's bookings are fetched
    const bookings = await FlightBooking.find({ user_id: req.user.user._id })
      .populate({
        path: "flight_id",
        select: "_id flight_name flightNo",
      })
      .populate({
        path: "schedule_id",
        select: "_id departure_station destination_station departure_time arrival_time",
      });

    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      user_id: booking.user_id,
      flight_id: {
        _id: booking.flight_id._id,
        airline: booking.flight_id.flight_name,
        flight_number: booking.flight_id.flightNo,
      },
      class: booking.class,
      schedule_id: {
        _id: booking.schedule_id._id,
        departure: {
          city: booking.schedule_id.departure_station,
          airport: booking.schedule_id.departure_station, // Assuming both are same
          time: new Date(booking.schedule_id.departure_time),
        },
        arrival: {
          city: booking.schedule_id.destination_station,
          airport: booking.schedule_id.destination_station, // Assuming both are same
          time: new Date(booking.schedule_id.arrival_time),
        },
      },
      date: booking.date,
      booking_status: booking.booking_status,
      luggage_details: booking.luggage_details,
      passenger_detail: booking.passenger_detail,
      seat_number: `${booking.booked_seat}`,
      price: booking.price,
      payment_id: booking.payment_id,
    }));

    res.status(200).json(new ApiResponse(200, formattedBookings, "Bookings fetched successfully"));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json(new ApiResponse(500, error, "Error fetching bookings"));
  }
}

export { searchFlights, bookingFlight,getBookings };
