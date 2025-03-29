import doctorModel from "../models/doctorModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js"
const changeAvailability = async (req, res) => {
    try {
        const { doctorId } = req.body
        const docData = await doctorModel.findById(doctorId)
        await doctorModel.findByIdAndUpdate(doctorId, { available: !docData.available })
        res.status(200).json({
            success: true,
            message: "Availability changed successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in changing availability"
        })
    }
}
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password -email");

        res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            doctors
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in fetching doctors"
        })
    }
}
// api for the doctor login
const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor not found"
            })
        }
        const isMatch = await bcrypt.compare(password, doctor.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }
        const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.status(200).json({
            success: true,
            message: "Doctor logged in successfully",
            doctor,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in logging in doctor"
        })
    }


}
// api to get all doc appointments 
const getDocAppointments = async (req, res) => {
    try {
        const docId = req.doctorId
        const appointments = await appointmentModel.find({ docId })
        res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            appointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in fetching appointments"
        })
    }
}

// api tp mark appointment as completed
const markAppointmentAsCompleted = async (req, res) => {
    try {
        const docId = req.doctorId
        const { appointmentId } = req.body
        const appointment = await appointmentModel.findById(appointmentId)
        if (appointment && appointment.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            res.status(200).json({
                success: true,
                message: "Appointment marked as completed"
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Appointment not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in marking appointment as completed"
        })
    }
}
// api tp mark appointment as cancelled
const markAppointmentAsCancelled = async (req, res) => {
    try {
        const docId = req.doctorId
        const { appointmentId } = req.body
        const appointment = await appointmentModel.findById(appointmentId)
        if (appointment && appointment.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true })
            res.status(200).json({
                success: true,
                message: "Appointment marked as cancelled"
            })
        } else {
            res.status(400).json({
                success: false,
                message: "Appointment not found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in marking appointment as cancelled"
        })
    }
}

// api to get dashboard data 
const getDashboardData = async (req, res) => {
    try {
        const docId = req.doctorId
        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.forEach(appointment => {
            if (appointment.isCompleted || appointment.payment) {
                earnings += appointment.amount
            }
        })

        let patients = []

        appointments.map((appointment) => {
            if (!patients.includes(appointment.userId)) {
                patients.push(appointment.userId)
            }
        })
        const dashData = {
            earnings,
            patients: patients.length,
            appointments: appointments.length,
            latestAppointments: appointments.reverse().slice(0, 5),
            cancelledAppointments: appointments.filter(appointment => appointment.cancel).length,
            completedAppointments: appointments.filter(appointment => appointment.isCompleted).length
        }
        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            dashData
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in fetching dashboard data"
        })
    }
}

// api to get doctor profile
const getDoctorProfile = async (req, res) => {
    try {
        const docId = req.doctorId
        const doctor = await doctorModel.findById(docId).select("-password")
        res.status(200).json({
            success: true,
            message: "Doctor profile fetched successfully",
            doctor
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in fetching doctor profile"
        })
    }
}

// api to update doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.doctorId
        const { fees, address, available, about } = req.body
       await doctorModel.findByIdAndUpdate(docId, { fees, address, available, about })
        res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully",
        
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in updating doctor profile"
        })
    }
} 
      
export { changeAvailability, doctorList, doctorLogin, getDocAppointments, markAppointmentAsCompleted, markAppointmentAsCancelled, getDashboardData, getDoctorProfile, updateDoctorProfile }