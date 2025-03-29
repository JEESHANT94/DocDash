import React, { useContext, useEffect } from 'react'
import { 
  Users, 
  CalendarCheck, 
  Hospital, 
  Clock, 
  XCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { AdminContext } from '../../context/AdminContext'

const Dashboard = () => {
  const { aToken, dashData, cancelAppointment, getDashboardData } = useContext(AdminContext)

  useEffect(() => {
    if(aToken){
      getDashboardData()
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [aToken])

  const getStatusClass = (appointment) => {
    if (appointment.cancel) return 'text-red-600 bg-red-100 px-2 py-1 rounded-full'
    if (appointment.isCompleted) return 'text-green-600 bg-green-100 px-2 py-1 rounded-full'
    return 'text-pink-600 bg-pink-100 px-2 py-1 rounded-full'
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 15px 25px rgba(244, 114, 182, 0.2)",
      transition: { duration: 0.3 }
    }
  }

  return dashData && (
    <div className="min-h-screen  relative overflow-hidden text-gray-800 pt-10 pb-15">
      {/* Subtle Pink Dot Pattern Background */}
      <div className="absolute inset-0 opacity-30 bg-dot-pattern pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            type: "spring",
            stiffness: 100 
          }}
          className="text-5xl font-extrabold mb-12 text-center pt-8 bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-400 
          bg-clip-text text-transparent"
        >
          Control Center Dashboard
        </motion.h1>

        {/* Subtitle with subtle description */}
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
          Manage your healthcare ecosystem with real-time insights and comprehensive analytics at your fingertips.
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { 
              icon: Hospital, 
              title: "Total Doctors", 
              value: dashData.doctor,
              delay: 0.1,
              color: "text-pink-600",
              
            },
            { 
              icon: CalendarCheck, 
              title: "Total Appointments", 
              value: dashData.appointment,
              delay: 0.2,
              color: "text-pink-600",
         
            },
            { 
              icon: Users, 
              title: "Total Patients", 
              value: dashData.patient,
              delay: 0.3,
              color: "text-pink-600",
             
            }
          ].map(({ icon: Icon, title, value, delay, color, bgColor }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className={`${bgColor} shadow-xl rounded-3xl p-6 flex items-center 
                border-2 border-pink-200/50 transform transition-all duration-300 
                backdrop-blur-sm`}
            >
              <motion.div 
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mr-6"
              >
                <Icon className={`h-16 w-16 ${color} opacity-70`} strokeWidth={1.5} />
              </motion.div>
              <div>
                <h2 className="text-black-500 text-sm uppercase tracking-widest mb-1">{title}</h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: delay }}
                  className="text-4xl font-bold text-black-700"
                >
                  {value}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Latest Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border-2 border-pink-200/50 overflow-hidden"
        >
          <div className="p-6 border-b border-pink-200 flex items-center bg-pink-100/50">
            <Clock className="mr-3 text-pink-600 h-6 w-6" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-gray-800">Latest Appointments</h2>
          </div>
          <table className="w-full">
            <thead className="bg-pink-50/50">
              <tr>
                {['Appointment Details', 'Date', 'Time', 'Speciality', 'Status', 'Amount', 'Actions'].map((header) => (
                  <th 
                    key={header} 
                    className="p-4 text-left text-gray-700 font-semibold uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dashData.latestAppointments) && dashData.latestAppointments.length > 0 ? (
                dashData.latestAppointments.map((appointment) => {
                  const user = appointment.userData || {};
                  const doctor = appointment.docData || {};

                  return (
                    <tr 
                      key={appointment._id} 
                      className="border-b border-gray-100 hover:bg-pink-100/30 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <img 
                            src={user.image || "/default-avatar.png"} 
                            alt={user.name || "User"}
                            className="w-12 h-12 rounded-full mr-4 object-cover shadow-md 
                              group-hover:scale-110 transition-transform border-2 border-pink-200"
                          />
                          <div>
                            <div className="font-semibold text-gray-800">{user.name || "Unknown"}</div>
                            <div className="text-sm text-gray-600">
                              with {doctor.name || "Doctor"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{formatDate(appointment.date)}</td>
                      <td className="p-4 text-gray-700">{appointment.slotTime}</td>
                      <td className="p-4 text-gray-700">{doctor.speciality || "N/A"}</td>
                      <td className="p-4">
                        <span className={getStatusClass(appointment)}>
                          {appointment.cancel ? 'Cancelled' : 
                            appointment.isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700">${appointment.amount}</td>
                      <td className="p-4">
                        {!appointment.cancel && !appointment.isCompleted && (
                          <motion.button 
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => cancelAppointment(appointment._id)}
                            className="text-gray-500 hover:text-pink-600 transition-colors"
                          >
                            <XCircle className="h-6 w-6" strokeWidth={1.5} />
                          </motion.button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 p-8 font-medium">
                    No recent appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Custom CSS for Dot Background Pattern */}
      <style jsx global>{`
        .bg-dot-pattern {
          background-image: 
            radial-gradient(rgba(244, 114, 182, 0.1) 1px, transparent 1px),
            radial-gradient(rgba(244, 114, 182, 0.1) 1px, transparent 1px);
          background-position: 0 0, 25px 25px;
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  )
}

export default Dashboard