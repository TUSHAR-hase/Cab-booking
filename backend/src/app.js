import express, { application } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userRouter } from "./routes/main/userRoutes.js";
import vehicleapi from "./routes/Cabs/vehicle_routes.js"
import Riderapi from "./routes/Cabs/Rider_routes.js"
import booking from "./routes/Cabs/booking.js"
import Razorpay from "razorpay";
import { flightRouter } from "./routes/flight/flight.route.js";
// import "./services/deadlineCron.js"
import dotenv from "dotenv";
dotenv.config();
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',  // Specify the exact origin of your front-end
  credentials: true,               // Allow credentials (cookies, authorization headers)
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser());

app.use("/api/user", userRouter)

//------------CAB ROUTES-------------------------------------
app.use("/api/Rv/vehicle", vehicleapi)
app.use("/api/Rv/booking", booking)
app.use("/api/Rv/Rider", Riderapi)

//------------FLIGHT ROUTES-------------------------------------
app.use("/api/flightadmin", flightRouter);


//------------HOTEL ROUTES-------------------------------------

import { hotelOwnerRouter } from "./routes/hotels/hotelOwner.routes.js"
app.use("/api/hotel/owner", hotelOwnerRouter)

import { hotelRouter } from "./routes/hotels/hotel.routes.js"
app.use("/api/hotel", hotelRouter)

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