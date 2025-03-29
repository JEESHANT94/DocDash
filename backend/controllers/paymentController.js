import Stripe from "stripe";
import appointmentModel from "../models/appointmentModel.js";
import sendConfirmationEmail from "../utilits/sendMail.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import sendPaymentReceiptEmail from "../utilits/sendPaymentReceiptEmail.js";
   
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Stripe Checkout Session
export const createStripeSession = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: appointment.userData.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Consultation with Dr. ${appointment.docData.name}`,
              description: `${appointment.docData.speciality} (${appointment.docData.degree})`,
            },
            unit_amount: appointment.amount * 100,
          },
          quantity: 1,
        },
      ],
 success_url: `https://docdash-frontend.onrender.com/payment-success?appointmentId=${appointmentId}`,
cancel_url: `https://docdash-frontend.onrender.com/my-appointments`,

    });

    appointment.payment = true;
    await appointment.save();

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe payment error:", error);
    res.status(500).json({ success: false, message: "Stripe payment error" });
  }
};

// Mark Appointment as Paid
export const markAppointmentAsPaid = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.payment = true;
    await appointment.save();

    res.status(200).json({ success: true, message: "Appointment marked as paid" });
  } catch (error) {
    console.error("Error marking appointment as paid:", error);
    res.status(500).json({ success: false, message: "Error marking as paid" });
  }
};

// Send Receipt Email with PDF
export const sendPaymentReceipt = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // 📨 Send receipt email (no PDF)
    await sendPaymentReceiptEmail({ to: appointment.userData.email, appointment });

    res.status(200).json({ success: true, message: "Receipt sent successfully" });
  } catch (error) {
    console.error("❌ Error sending payment receipt:", error);
    res.status(500).json({ success: false, message: "Failed to send receipt" });
  }
};
