import express, { application } from "express"
import cors from "cors"
import crypto from "crypto";
import fs from 'fs';
import path from 'path';


const uploadsDir = path.join(process.cwd(), 'uploads', 'vehicles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
import "./routes/Cabs/autoCancelBookings.js"

import cookieParser from "cookie-parser"
import { userRouter } from "./routes/main/userRoutes.js";
import vehicleapi from "./routes/Cabs/vehicle_routes.js"
import Riderapi from "./routes/Cabs/Rider_routes.js"
import Booking from "./routes/Cabs/booking.js"
import { booking } from "./models/Cabs/cab_booking_model.js";
import Razorpay from "razorpay";
import { flightRouter } from "./routes/flight/flight.route.js";
import dotenv from "dotenv";
dotenv.config();
import "./services/hotel/completeBookingCron.js"
const app = express()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser());

app.use("/api/user", userRouter)

//------------CAB ROUTES-------------------------------------
app.use("/api/Rv/vehicle", vehicleapi)
app.use("/api/Rv/booking", Booking)
app.use("/api/Rv/Rider", Riderapi)

//------------FLIGHT ROUTES-------------------------------------
app.use("/api/flightadmin", flightRouter);
app.use("/api/flight", flightBookingRouter);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
//------------HOTEL ROUTES-------------------------------------

import { hotelOwnerRouter } from "./routes/hotels/hotelOwner.routes.js"
app.use("/api/hotel/owner", hotelOwnerRouter)

import { hotelRatingRouter } from "./routes/hotels/hotelRating.routes.js";
app.use("/api/hotel-ratings", hotelRatingRouter)
import { hotelRouter } from "./routes/hotels/hotel.routes.js"
app.use("/api/hotel", hotelRouter)

import { hotelBookingRouter } from "./routes/hotels/hotelBooking.routes.js";
import { flightBookingRouter } from "./routes/flight/flightBooking.route.js";
app.use("/api/booking", hotelBookingRouter)

// ------------------------------------------------------------


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
app.patch("/update-payment-status/:id", async (req, res) => {
  const { bookingId } = req.params;
  try {
    const updatedBooking = await booking.findByIdAndUpdate(
      bookingId,
      { payment_status: "paid", updated_at: Date.now() },
      { new: true }
    );
    res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ success: false, message: "Failed to update payment status" });
  }
});


// ✅ Verify Payment Signature
app.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});
app.get("/", (req, res) => {
  res.send("Welcome to the backend");
})


export { app }