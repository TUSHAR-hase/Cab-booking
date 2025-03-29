import { Router } from "express";
import { loginUser, registerUser, verifyOtp,getbookingByid } from "../../controller/main/user.controller.js";
const userRouter = Router();


userRouter.route("/register").post(registerUser);
userRouter.route("/verify-otp").post(verifyOtp);
userRouter.route("/login").post(loginUser);
userRouter.get("/getbooking/:id",getbookingByid)


export { userRouter };