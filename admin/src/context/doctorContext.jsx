import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState({})
  const [doctorProfile, setDoctorProfile] = useState({})
  // ✅ useCallback prevents infinite useEffect loops
  const getDocAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { Authorization: `Bearer ${dToken}` }
      });

      if (data.success) {
        setAppointments(data.appointments);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch doctor appointments");
    }
  }, [backendUrl, dToken]); // ✅ Add dependencies

  const markAppointmentAsCompleted = useCallback(async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/mark-completed`, {
        appointmentId
      }, {
        headers: { Authorization: `Bearer ${dToken}` }
      });
      if (data.success) {
        toast.success(data.message);
        getDocAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark appointment as completed");
    }
  }, [backendUrl, dToken]);

  const markAppointmentAsCancelled = useCallback(async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/mark-cancelled`, {
        appointmentId
 
      }, {
        headers: { Authorization: `Bearer ${dToken}` }
      });
      if (data.success) {
        toast.success(data.message);
        getDocAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark appointment as cancelled");
    }
  }, [backendUrl, dToken]);

  const getDashboardData = useCallback(async () => {
    try {
      const {data} = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: {Authorization: `Bearer ${dToken}`}
      })
      if (data.success){
        setDashData(data.dashData)
        console.log(data.dashData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch dashboard data")
    }
  }, [])

  const getDoctorProfile = useCallback(async () => {
    try {
      const {data} = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: {Authorization: `Bearer ${dToken}`}
      })
      if (data.success){
        setDoctorProfile(data.doctor)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch doctor profile")
    }
  }, [])

  const updateDoctorProfile = useCallback(async (doctorProfile) => {
    try {
      const {data} = await axios.post(`${backendUrl}/api/doctor/update-profile`, doctorProfile, {
        headers: {Authorization: `Bearer ${dToken}`}
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to update doctor profile")
    }
  }, [])
  const value = {
    dToken,
    setDToken,
    appointments,
    setAppointments,
    getDocAppointments,
    markAppointmentAsCompleted,
    markAppointmentAsCancelled,
    dashData,
    getDashboardData,
    setDashData,
    doctorProfile,
    getDoctorProfile,
    updateDoctorProfile
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
