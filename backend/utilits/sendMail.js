import nodemailer from 'nodemailer';
import path from 'path';
const sendConfirmationEmail = async ({ to, subject, html = [] }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,       
        pass: process.env.MAIL_PASS        
      }
    });

    const mailOptions = {
      from: `"DocDash Support" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    
    };

    
    transporter.sendMail(mailOptions);
    console.log("📧 Email sent to:", to);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

export default sendConfirmationEmail;
