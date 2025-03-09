import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userRouter } from "./routes/main/userRoutes.js";

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


//------------HOTEL ROUTES-------------------------------------

import { hotelOwnerRouter } from "./routes/hotels/hotelOwner.routes.js"
app.use("/api/hotel/owner", hotelOwnerRouter)

// ------------------------------------------------------------
app.get("/", (req, res) => {
    res.send("Welcome to the backend");
})


export { app }