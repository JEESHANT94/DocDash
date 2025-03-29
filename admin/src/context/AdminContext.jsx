import { createContext } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'');
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState({})

    const backendUrl = "https://docdash-backend-fate.onrender.com";
    const getAllDoctors = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
                headers: { Authorization: `Bearer ${aToken}` }

            })
            if(data.success){
                setDoctors(data.doctors)
             console.log('Doctors from backend:', data.doctors)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const changeAvailability = async (doctorId) => {
        try {
            const {data} = await axios.post(`${backendUrl}/api/admin/change-availability`, {doctorId}, {
              headers: { Authorization: `Bearer ${aToken}` }

            })
            if(data.success){
                toast.success(data.message)
                setDoctors(data.doctors) // just added this line
             

            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    const getAllAppointments = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/appointments`, {
                headers: { Authorization: `Bearer ${aToken}` }

            })
            if(data.success){
                setAppointments(data.appointments)
                console.log(data.appointments)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const cancelAppointment = async (appointmentId) => {
        try {
            const {data} = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, {appointmentId}, {
                headers: { Authorization: `Bearer ${aToken}` }

            })
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getDashboardData = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${aToken}` }

            })
            if(data.success){
                setDashData(data.dashData)
              console.log(data.dashData)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
   
    const value = {
        aToken, setAToken, backendUrl, doctors, getAllDoctors, changeAvailability, appointments,setAppointments, getAllAppointments, cancelAppointment, getDashboardData, dashData,setDashData 
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export default AdminContextProvider;
