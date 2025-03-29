import validator from "validator"
import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import sendConfirmationEmail from "../utilits/sendMail.js"
import Stripe from "stripe"
import crypto from "crypto"

//Api to register a user

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            })
        }
        const emailTrimmed = email.trim().toLowerCase();
        const existingUser = await userModel.findOne({ email: emailTrimmed })
        if (existingUser ) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        //hasing password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)




         const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new userModel({
      name,
      email: emailTrimmed,
      password: hashedPassword,
      verificationCode,
    });

    await newUser.save();

    // Send the verification email
    const html = `
    <div style="max-width:600px;margin:auto;padding:30px;border:1px solid #eee;border-radius:10px;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;background:#ffffff;color:#333;">
      
      <div style="text-align:center;">
        <img src="https://i.postimg.cc/tCrc8Hx5/logo3.png" alt="DocDash Logo" style="height:60px;margin-bottom:20px;" />
        <h2 style="color:#e91e63;margin:0;">Welcome to <span style="color:#d81b60;">DocDash</span>, ${name}!</h2>
        <p style="margin-top:10px;font-size:15px;color:#555;">
          We're excited to have you on board. Please verify your email address by entering the code below:
        </p>
      </div>
  
      <div style="margin:30px 0;text-align:center;">
        <h1 style="font-size:36px;letter-spacing:5px;color:#d81b60;background:#fce4ec;padding:15px 30px;
          display:inline-block;border-radius:10px;">
          ${verificationCode}
        </h1>
      </div>
  
      <p style="text-align:center;color:#777;font-size:14px;">
        This code is valid for 5 minutes. If you didn’t request this, please ignore this message.
      </p>
  
      <hr style="margin:40px 0;border:none;border-top:1px solid #eee;"/>
  
      <div style="text-align:center;font-size:13px;color:#999;">
        Need help? <a href="mailto:support@docdash.com" style="color:#e91e63;text-decoration:none;">Contact Support</a><br/>
        This is an automated message. Please do not reply.
        <p style="margin-top:20px;">© ${new Date().getFullYear()} DocDash — Quick Care, Anytime, Anywhere</p>
      </div>
    </div>
  `;
  

    await sendConfirmationEmail({
      to: email,
      subject: "Verify your DocDash account",
      html,
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
      userId: newUser._id, // Needed for the next page
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error in registering user" });
  }
};
const verifyUser = async (req, res) => {
  try {
    const { userId, code } = req.body;

    const user = await userModel.findById(userId);

    if (!user || user.verificationCode !== code.toString().trim()) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
const resendVerificationCode = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    await user.save();

    const html = `
      <div style="text-align:center;">
        <img src="https://i.postimg.cc/tCrc8Hx5/logo3.png" style="height:50px;" />
        <h2 style="color:#e91e63;">Your new DocDash verification code</h2>
        <h1 style="font-size:32px;color:#333;letter-spacing:4px;">${newCode}</h1>
      </div>
    `;

    await sendConfirmationEmail({
      to: user.email,
      subject: "New DocDash Verification Code",
      html
    });

    res.status(200).json({ success: true, message: "New verification code sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error resending code" });
  }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in logging in user"
        })
    }
}

//APi to get user profile data 

const getProfileData = async (req, res) => {
    try {
        console.log("Request Object:", req); // Debugging log

        const userId = req.userId; 
        console.log("Fetching User ID:", userId); // Debugging log

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found in request" });
        }

        const userData = await userModel.findById(userId).select("-password");
        console.log("Fetched User Data:", userData); // Debugging log

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile data fetched successfully",
            userData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in fetching user profile data",
        });
    }
};

//APi to update user profile data 

const updateProfileData = async (req, res) => {
    try {
        const { name, email, phone, address, gender, dob, mood, blood_group, stats, achievements } = req.body
        const imageFile = req.file
        const userId = req.userId
        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        await userModel.findByIdAndUpdate(userId, { name, email, phone, address: JSON.parse(address), gender, dob, mood, blood_group, stats: JSON.parse(stats), achievements: JSON.parse(achievements) }, { new: true })
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            })
           const imageURL = imageUpload.secure_url
           await userModel.findByIdAndUpdate(userId, {image: imageURL}, {new: true})
        }
        res.status(200).json({
            success: true,
            message: "User profile data updated successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in updating user profile data"
        })
    }
}
const updateExistingUsers = async (req, res) => {
    try {
        await userModel.updateMany({}, {
            $set: {
                mood: "Happy",
                blood_group: "Unknown",
                stats: { completedTasks: 0, pendingTasks: 0, daysActive: 0 },
                achievements: []
            }
        });

        res.status(200).json({
            success: true,
            message: "All users updated with new fields."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating users." });
    }
};
//api to book an appointment 
const bookAppointment = async (req, res) => {
    try {
      const { userId, docId, slotDate, slotTime } = req.body;
  
      const docData = await doctorModel.findById(docId).select("-password");
      if (!docData.available) {
        return res.status(400).json({
          success: false,
          message: "Doctor is not available"
        });
      }
  
      let slots_booked = docData.slots_booked;
  
      // Slot availability check
      if (slots_booked[slotDate]) {
        if (slots_booked[slotDate].includes(slotTime)) {
          return res.status(400).json({
            success: false,
            message: "Slot is already booked"
          });
        } else {
          slots_booked[slotDate].push(slotTime);
        }
      } else {
        slots_booked[slotDate] = [slotTime];
      }
  
      const userData = await userModel.findById(userId).select("-password");
      delete docData.slots_booked;
  
      const appointmentData = {
        userId,
        docId,
        slotDate,
        slotTime,
        userData,
        docData,
        amount: docData.fees,
        date: Date.now(),
      };
  
      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();
  
      await doctorModel.findByIdAndUpdate(docId, { slots_booked }, { new: true });
  
      // ✅ Send Confirmation Email
      const htmlContent = `
  <div style="max-width:600px;margin:auto;padding:30px;border:1px solid #eee;border-radius:10px;font-family:Arial, sans-serif;color:#333;background:#ffffff;">
    <div style="text-align:center;">
      <img src="https://i.postimg.cc/tCrc8Hx5/logo3.png" alt="DocDash Logo" style="height:60px;margin-bottom:20px;" />
      <h2 style="color:#e91e63;margin-bottom:10px;">Your Appointment is Confirmed</h2>
      <p style="font-size:16px;color:#666;">Thank you for booking with <strong style="color:#e91e63;">DocDash</strong></p>
    </div>

    <hr style="margin:30px 0; border:none; border-top:1px solid #f3f3f3;"/>

    <div style="padding:10px 0;">
      <h3 style="margin-bottom:10px;color:#333;">👤 Patient Information</h3>
      <p><strong>Name:</strong> ${userData.name}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
    </div>

    <div style="padding:20px;background:#fce4ec;border-radius:8px;margin:20px 0;">
      <h3 style="color:#c2185b;">🩺 Appointment Details</h3>
      <ul style="padding-left:20px;margin-top:10px;line-height:1.6;">
        <li><strong>Date:</strong> ${slotDate.replace(/_/g, '/')}</li>
        <li><strong>Time:</strong> ${slotTime}</li>
        <li><strong>Doctor:</strong> ${docData.name} — ${docData.speciality} (${docData.degree})</li>
        <li><strong>Location:</strong> ${docData.address.line1} - ${docData.address.line2}</li>
        <li><strong>Fees:</strong> $ ${docData.fees}</li>
      </ul>
    </div>

    <div style="padding:10px 0;">
      <p style="font-size:14px;">📌 <strong>Note:</strong> Please arrive 10 minutes early and bring relevant documents.</p>
    </div>

    <div style="margin-top:30px;text-align:center;">
      <p style="color:#555;">Need help? <a href="mailto:support@docdash.com" style="color:#e91e63;text-decoration:none;">Contact Support</a></p>
      <p style="font-size:12px;color:#aaa;">This is an automated message. Please do not reply.</p>
    </div>

    <hr style="margin:30px 0; border:none; border-top:1px solid #f3f3f3;"/>

    <footer style="text-align:center;font-size:13px;color:#999;">
      © ${new Date().getFullYear()} DocDash — Quick Care, Anytime, Anywhere
    </footer>
  </div>
`;

    
      await sendConfirmationEmail({
        to: userData.email,
        subject: "✅ Your Appointment is Confirmed",
        html: htmlContent,
      });
     
      res.status(200).json({
        success: true,
        message: "Appointment booked successfully"
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error in booking appointment"
      });
    }
  };
  
const getAppointments = async (req, res) => {
    try {
        const userId = req.userId   
        const appointments = await appointmentModel.find({userId})
        res.status(200).json({success: true, appointments})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in getting appointments"
        })
    }
}


// Controller for canceling an appointment
const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body;
      const userId = req.userId;
      
     
      
   
      
      // Find the appointment
      const appointment = await appointmentModel.findById(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found"
        });
      }
      
    
      
      // Verify appointment belongs to user
      if (appointment.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized to cancel this appointment"
        });
      }
      
      // Update appointment cancel status explicitly
      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { $set: { cancel: true } },
        { new: true }
      );
      
      if (!updatedAppointment) {
        return res.status(500).json({
          success: false,
          message: "Failed to update appointment"
        });
      }
      
     
      
      // Release the doctor's slot
      const { docId, slotDate, slotTime } = appointment;
      
      const docData = await doctorModel.findById(docId);
      if (!docData) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found"
        });
      }
      
      let slots_booked = { ...docData.slots_booked };
      
      if (slots_booked[slotDate] && Array.isArray(slots_booked[slotDate])) {
        // Log before removing
      
        
        // Filter out the specific time slot
        const filteredSlots = slots_booked[slotDate].filter(time => time !== slotTime);
        slots_booked[slotDate] = filteredSlots;
        
        // Log after removing
       
        
        // Update the doctor's slots_booked
        const updatedDoctor = await doctorModel.findByIdAndUpdate(
          docId,
          { $set: { slots_booked } },
          { new: true }
        );
        
        if (!updatedDoctor) {
         
          return res.status(500).json({
            success: false,
            message: "Failed to update doctor's availability"
          });
        }
        
       
      } else {
        console.log(`Warning: No slots found for date ${slotDate}`);
      }
      const htmlCancelContent = `
  <div style="max-width:600px;margin:auto;padding:30px;border:1px solid #eee;border-radius:10px;font-family:Arial, sans-serif;color:#333;background:#ffffff;">
    <div style="text-align:center;">
      <img src="https://i.postimg.cc/tCrc8Hx5/logo3.png" alt="DocDash Logo" style="height:60px;margin-bottom:20px;" />
      <h2 style="color:#e53935;margin-bottom:10px;">Your Appointment is Canceled</h2>
      <p style="font-size:16px;color:#666;">We’ve successfully canceled your appointment with <strong style="color:#e53935;">DocDash</strong></p>
    </div>

    <hr style="margin:30px 0; border:none; border-top:1px solid #f3f3f3;"/>

    <div style="padding:10px 0;">
      <h3 style="margin-bottom:10px;color:#333;">👤 Patient Information</h3>
      <p><strong>Name:</strong> ${appointment.userData.name}</p>
      <p><strong>Email:</strong> ${appointment.userData.email}</p>
    </div>

    <div style="padding:20px;background:#ffebee;border-radius:8px;margin:20px 0;">
      <h3 style="color:#c62828;">📅 Appointment Details</h3>
      <ul style="padding-left:20px;margin-top:10px;line-height:1.6;">
        <li><strong>Date:</strong> ${slotDate.replace(/_/g, '/')}</li>
        <li><strong>Time:</strong> ${slotTime}</li>
        <li><strong>Doctor:</strong> ${appointment.docData.name} — ${appointment.docData.speciality} (${appointment.docData.degree})</li>
        <li><strong>Location:</strong> ${appointment.docData.address.line1} - ${appointment.docData.address.line2}</li>
      </ul>
    </div>

    <div style="padding:10px 0;">
      <p style="font-size:14px;">📌 <strong>Need to rebook?</strong> Head back to <a href="https://docdash.com" style="color:#e53935;text-decoration:none;">DocDash</a> and pick a new slot.</p>
    </div>

    <div style="margin-top:30px;text-align:center;">
      <p style="color:#555;">Need help? <a href="mailto:support@docdash.com" style="color:#e53935;text-decoration:none;">Contact Support</a></p>
      <p style="font-size:12px;color:#aaa;">This is an automated message. Please do not reply.</p>
    </div>

    <hr style="margin:30px 0; border:none; border-top:1px solid #f3f3f3;"/>

    <footer style="text-align:center;font-size:13px;color:#999;">
      © ${new Date().getFullYear()} DocDash — Quick Care, Anytime, Anywhere
    </footer>
  </div>
`;
await sendConfirmationEmail({
    to: appointment.userData.email,
    subject: "Your Appointment has been Cancelled",
    html: htmlCancelContent,
  });
 
  
      return res.status(200).json({
        success: true,
        message: "Appointment canceled successfully"
      });
      
    } catch (error) {
  
      return res.status(500).json({
        success: false,
        message: "Error in canceling appointment: " + error.message
      });
    }
  };
  
  // const createStripeSession = async (req, res) => {
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  //   try {
  //     const { appointmentId } = req.body;
  //     const appointment = await appointmentModel.findById(appointmentId);
  //     if (!appointment) {
  //       return res.status(404).json({ success: false, message: "Appointment not found" });
  //     }
  
  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ['card'],
  //       mode: 'payment',
  //       customer_email: appointment.userData.email,
  //       line_items: [
  //         {
  //           price_data: {
  //             currency: 'usd',
  //             product_data: {
  //               name: `Consultation with Dr. ${appointment.docData.name}`,
  //               description: `${appointment.docData.speciality} (${appointment.docData.degree})`,
  //             },
  //             unit_amount: appointment.amount * 100,
  //           },
  //           quantity: 1,
  //         },
  //       ],
  //       success_url: `${process.env.CLIENT_URL}/payment-success?appointmentId=${appointmentId}`,
  //       cancel_url: `${process.env.CLIENT_URL}/my-appointments`,
  //     });
  //     appointment.payment = true;
  //     await appointment.save();
  //     res.status(200).json({ success: true, url: session.url});
  //   } catch (error) {
  //     console.error("Stripe payment error:", error);
  //     res.status(500).json({ success: false, message: "Stripe payment error" });
  //   }
  // };
  
  // const markAppointmentAsPaid = async (req, res) => {
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  //   try {
  //     const { appointmentId } = req.body;
  //     const appointment = await appointmentModel.findById(appointmentId);
  //     if (!appointment) {
  //       return res.status(404).json({ success: false, message: "Appointment not found" });
  //     }
  
  //     appointment.payment = true;
  //     await appointment.save();
  
  //     res.status(200).json({
  //       success: true,
  //       message: "Appointment marked as paid"
  //     });
  //   } catch (error) {
  //     console.error("Error marking appointment as paid:", error);
  //     res.status(500).json({ success: false, message: "Error marking as paid" });
  //   }
  // };
   
  
    export { registerUser, loginUser, getProfileData, updateProfileData, updateExistingUsers, bookAppointment, getAppointments, cancelAppointment , verifyUser, resendVerificationCode}//createStripeSession, markAppointmentAsPaid }    