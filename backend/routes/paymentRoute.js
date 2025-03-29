import express from "express";
import { createStripeSession, markAppointmentAsPaid, sendPaymentReceipt } from "../controllers/paymentController.js";
import authUser from "../middlewares/authUser.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-stripe-session", authUser, createStripeSession);
paymentRouter.post("/mark-appointment-as-paid", authUser, markAppointmentAsPaid);
paymentRouter.post("/send-payment-receipt", authUser, sendPaymentReceipt);


export default paymentRouter;
