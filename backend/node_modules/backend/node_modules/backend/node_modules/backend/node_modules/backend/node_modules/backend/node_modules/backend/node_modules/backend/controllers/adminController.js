import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
// Api for adding doct
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        
        const imageFile = req.file
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }
        
        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        // validating the email format 
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }
      
        // password validing strong or not 
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" })
        }

        //hasing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //uploading image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email, image:imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            password:hashedPassword,
            date:Date.now()
        }
const newDoctor = new doctorModel(doctorData)
await newDoctor.save()

return res.status(201).json({success:true, message:"Doctor added successfully", doctor:newDoctor})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message: error.message })
    }

}

// API FOr the admin login 

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" })
        }
       if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
        const token = jwt.sign( email+password, process.env.JWT_SECRET)
        return res.status(200).json({ success: true, message: "Admin logged in successfully", token })
       }
         else{
          return res.status(400).json({ success: false, message: "Invalid email or password" })
         }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to get all doctors list for the admin panel 
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.status(200).json({success:true, message:"Doctors fetched successfully", doctors})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message: error.message })
    
    }
}
// api to get all the appointments 
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.status(200).json({success:true, message:"Appointments fetched successfully", appointments})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message: error.message })
    }
}
// api to cancel the appointment 
const appointmentCancel = async (req, res) => {
    try {
      const { appointmentId } = req.body;

      
     
      
   
      
      // Find the appointment
      const appointment = await appointmentModel.findById(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found"
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
      
      return res.status(200).json({
        success: true,
        message: "Appointment canceled successfully"
      });
      
    } catch (error) {
      console.error("Error in cancelAppointment:", error);
      return res.status(500).json({
        success: false,
        message: "Error in canceling appointment: " + error.message
      });
    }
  };


  // api to get dashboard data  for admin dashboard 
  const dashboardData = async (req, res) => {
    try {
      const totalDoctors = await doctorModel.find({})
      // total user only uniq 
      
      const totalUsers = await userModel.find({})
      const totalAppointments = await appointmentModel.find({})
     

      const dashData = {
        doctor:totalDoctors.length,
        appointment:totalAppointments.length,
        patient:totalUsers.length,
       
        latestAppointments:totalAppointments.reverse().slice(0,5)
      }
      res.status(200).json({success:true, message:"Dashboard data fetched successfully", dashData})
        

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message: error.message })
    }
  }
export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, dashboardData }