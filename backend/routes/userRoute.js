import express from "express";
import { registerUser, loginUser, getProfileData, updateProfileData, updateExistingUsers, bookAppointment, getAppointments, cancelAppointment , verifyUser, resendVerificationCode} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

import { markAppointmentAsPaid } from "../controllers/paymentController.js";
const userRouter = express.Router();
import sendConfirmationEmail from "../utilits/sendMail.js";
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/get-profile-data", authUser, getProfileData)
userRouter.post("/update-profile-data", authUser, upload.single("image"), updateProfileData)
userRouter.post("/update-existing-users", updateExistingUsers)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, getAppointments)
userRouter.delete("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/verify", verifyUser);
userRouter.post("/resend-code", resendVerificationCode);
//userRouter.post("/create-stripe-session", authUser, createStripeSession);
userRouter.post("/mark-appointment-as-paid", authUser, markAppointmentAsPaid);
  

export default userRouter;
