import nodemailer from 'nodemailer';
import generateReceiptPDF from './generateReceiptPDF.js';
import path from 'path';

const sendPaymentReceiptEmail = async ({ to, appointment }) => {
  try {
    const outputPath = path.join('receipts', `receipt_${appointment._id}.pdf`);
    await generateReceiptPDF(appointment, outputPath);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
      secure: true
    });

    // Professional, Clean Email Template
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DocDash - Payment Receipt</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header {
            background: linear-gradient(135deg, #FFB6C1, #87CEFA);
            color: white;
            text-align: center;
            padding: 20px;
            border-radius: 5px;
          }
          .header img {
            max-width: 150px;
            max-height: 50px;
          }
          .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            color: #666;
            margin-top: 20px;
            font-size: 12px;
          }
          .details {
            background-color: white;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://i.postimg.cc/tCrc8Hx5/logo3.png" alt="DocDash Logo">
          <h1>📋 Payment Receipt</h1>
        </div>
        
        <div class="content">
          <p>Dear ${appointment.userData.name},</p>
          
          <p>Thank you for your recent appointment with DocDash. We have processed your payment and generated a detailed receipt.</p>
          
          <div class="details">
            <h3>Appointment Details</h3>
            <p><strong>Date:</strong> ${appointment.slotDate.replace(/_/g, '/')}</p>
            <p><strong>Time:</strong> ${appointment.slotTime}</p>
            <p><strong>Doctor:</strong> ${appointment.docData.name} - ${appointment.docData.speciality}</p>
          </div>
          
          <div class="details">
            <h3>Payment Summary</h3>
            <p><strong>Consultation Fee:</strong> $${appointment.amount.toFixed(2)}</p>
            <p><strong>Payment Status:</strong> Confirmed ✅</p>
          </div>
          
          <p>Your payment receipt is attached to this email. Please keep it for your records.</p>
          
          <p>If you have any questions or concerns, please contact our support team.</p>
          
          <p>Best regards,<br>DocDash Support Team</p>
        </div>
        
        <div class="footer">
          <p>© 2024 DocDash Healthcare Services | Confidential Communication</p>
          <p>Receipt ID: ${appointment._id}</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"DocDash Healthcare" <${process.env.MAIL_USER}>`,
      to,
      subject: `🧾 DocDash Payment Receipt - Appointment ${appointment._id}`,
      html,
      attachments: [
        {
          filename: `DocDash_Receipt_${appointment._id}.pdf`,
          path: outputPath
        }
      ]
    };

    // Send email with retry mechanism
    const sendWithRetry = async (retries = 2) => {
      try {
        await transporter.sendMail(mailOptions);
      
      } catch (error) {
        if (retries > 0) {
         
          await sendWithRetry(retries - 1);
        } else {
          throw error;
        }
      }
    };

    await sendWithRetry();
  } catch (error) {
    console.error("❌ Failed to send payment receipt email:", error);
  }
};

export default sendPaymentReceiptEmail;