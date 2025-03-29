import express from "express";
import { doctorList, doctorLogin, getDocAppointments, markAppointmentAsCompleted, markAppointmentAsCancelled, getDashboardData, getDoctorProfile, updateDoctorProfile } from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList)
doctorRouter.post("/login", doctorLogin)
doctorRouter.get("/appointments", authDoctor, getDocAppointments)
doctorRouter.post("/mark-completed", authDoctor, markAppointmentAsCompleted)
doctorRouter.post("/mark-cancelled", authDoctor, markAppointmentAsCancelled)
doctorRouter.get("/dashboard", authDoctor, getDashboardData)
doctorRouter.get("/profile", authDoctor, getDoctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)
export default doctorRouter;
