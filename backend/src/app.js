import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userRouter } from "./routes/main/userRoutes.js";
import vehicleapi from "./routes/Cabs/vehicle_routes.js"
import Riderapi from "./routes/Cabs/Rider_routes.js"
import booking from "./routes/Cabs/booking.js"
import { flightRouter } from "./routes/flight/flight.route.js";
// import "./services/deadlineCron.js"
const app = express()
app.use(cors({
    origin: 'http://localhost:5173',  // Specify the exact origin of your front-end
    credentials: true,               // Allow credentials (cookies, authorization headers)
}));
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.static("public"))
app.use(cookieParser());

app.use("/api/user", userRouter)

//------------CAB ROUTES-------------------------------------
app.use("/api/Rv/vehicle",vehicleapi)
app.use("/api/Rv/booking",booking)
app.use("/api/Rv/Rider",Riderapi)

//------------FLIGHT ROUTES-------------------------------------
app.use("/api/flightadmin",flightRouter);


//------------HOTEL ROUTES-------------------------------------

import { hotelOwnerRouter } from "./routes/hotels/hotelOwner.routes.js"
app.use("/api/hotel/owner", hotelOwnerRouter)

// ------------------------------------------------------------
app.get("/", (req, res) => {
    res.send("Welcome to the backend");
})


export { app }