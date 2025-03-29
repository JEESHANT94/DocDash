import React, { useContext, useEffect, useState } from 'react'
import { X, CalendarCheck, Stethoscope, Ban } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminContext } from '../../context/AdminContext'


const AllAppointments = () => {
  const ShimmerLoader = () => (
    <div className="animate-pulse text-center py-20 text-gray-400 text-lg">
      Fetching appointments...
    </div>
  )
  const { 
    aToken, 
    appointments, 
    getAllAppointments, 
    cancelAppointment 
  } = useContext(AdminContext)
  const [localAppointments, setLocalAppointments] = useState([])
  const [cancelConfirmation, setCancelConfirmation] = useState(null)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  useEffect(() => {
    if (appointments && appointments.length > 0) {
      const sorted = [...appointments]
        .sort((a, b) => {
          // First: non-cancelled before cancelled
          if (a.cancel && !b.cancel) return 1;
          if (!a.cancel && b.cancel) return -1;
  
          // Then: sort by date descending (latest first)
          const dateA = new Date(a.slotDate + ' ' + a.slotTime);
          const dateB = new Date(b.slotDate + ' ' + b.slotTime);
          return dateB - dateA;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      setLocalAppointments(sorted);
    }
  }, [appointments]);
  
  const calculateAge = (dob) => {
    if (!dob) return 'N/A'
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const handleCancelAppointment = (appointmentId) => {
    cancelAppointment(appointmentId)
    setCancelConfirmation(null)
  }

  return (
    <div className="min-h-screen w-full  p-6 pt-15 ">
      <div className="container mx-auto max-w-[90%] xl:max-w-[85%]">
        {/* Innovative Heading */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            type: "spring", 
            bounce: 0.3 
          }}
          className="flex items-center justify-center mb-10 space-x-4"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }
            }}
          >
            <Stethoscope 
              className="text-pink-600 w-12 h-12" 
              strokeWidth={1.5}
            />
          </motion.div>
          <h1 className="text-4xl font-bold text-pink-600 bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
            All Appointments
          </h1>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }
            }}
          >
            <CalendarCheck 
              className="text-pink-600 w-12 h-12" 
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

        {/* Appointments Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden border-4 border-pink-200/50"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-pink-100 text-pink-800 font-semibold p-4 px-6">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Patient</div>
            <div className="col-span-1">Age</div>
            <div className="col-span-2">Date & Time</div>
            <div className="col-span-3">Doctor</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          {/* Appointments List */}
          <AnimatePresence>
            {localAppointments.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1 
                }}
                className={`grid grid-cols-12 items-center p-4 px-6 border-b border-pink-100 hover:bg-pink-50/50 transition-colors group relative 
                  ${!item.cancel ? '' : 'bg-red-50'}`}
              >
                {/* Index */}
                <div className="col-span-1 text-pink-500 font-medium">
                  {index + 1}
                </div>

                {/* Patient Info */}
                <div className="col-span-3 flex items-center space-x-4">
                  <img 
                    src={item.userData.image} 
                    alt={item.userData.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 shadow-md"
                  />
                  <div>
                    <p className={`font-semibold ${!item.cancel ? 'text-gray-800' : 'text-red-600'}`}>
                      {item.userData.name}
                    </p>
                    <p className={`text-xs ${!item.cancel ? 'text-gray-500' : 'text-red-400'}`}>
                      {item.userData.email}
                    </p>
                  </div>
                </div>

                {/* Age */}
                <div className={`col-span-1 ${!item.cancel ? 'text-gray-700' : 'text-red-600'}`}>
                  {calculateAge(item.userData.dob)} yrs
                </div>

                {/* Date & Time */}
                <div className="col-span-2">
                  <p className={`${!item.cancel ? 'text-gray-800' : 'text-red-600'}`}>{item.slotDate}</p>
                  <p className={`text-xs ${!item.cancel ? 'text-gray-500' : 'text-red-400'}`}>{item.slotTime}</p>
                </div>

                {/* Doctor Info */}
                <div className="col-span-3 flex items-center space-x-3">
                  <img 
                    src={item.docData.image} 
                    alt={item.docData.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
                  />
                  <div>
                    <p className={`font-semibold text-sm ${!item.cancel ? 'text-gray-800' : 'text-red-600'}`}>
                      {item.docData.name}
                    </p>
                    <p className={`text-xs ${!item.cancel ? 'text-gray-500' : 'text-red-400'}`}>
                      {item.docData.speciality}
                    </p>
                  </div>
                </div>

                {/* Status/Action */}
                <div className="col-span-2 flex justify-end items-center">
                  {!item.cancel ? (
                    cancelConfirmation === item.id ? (
                      <div className="flex items-center space-x-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCancelAppointment(item._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                        >
                          Confirm
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCancelConfirmation(null)}
                          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          Back
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button 
                        whileHover={{ rotate: 90, scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCancelConfirmation(item.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors duration-200"
                        title="Cancel Appointment"
                      >
                        <X className="w-6 h-6 stroke-[3]" />
                      </motion.button>
                    )
                  ) : (
                    <div className="flex items-center text-red-600">
                      <Ban className="w-6 h-6 mr-2" />
                      <span className="font-semibold text-sm">Cancelled</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default AllAppointments