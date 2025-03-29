import React, { useContext, useEffect } from 'react';
import { CalendarCheck, CheckCircle, XCircle, Clock, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { DoctorContext } from '../../context/doctorContext';

const DoctorDashboard = () => {
  const { dToken, dashData, getDashboardData } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getDashboardData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [dToken, getDashboardData]);

  const getStatusClass = (appointment) => {
    if (appointment.cancel) return 'text-red-600 bg-red-100 px-2 py-1 rounded-full';
    if (appointment.isCompleted) return 'text-green-600 bg-green-100 px-2 py-1 rounded-full';
    return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full';
  };

  const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 15px 25px rgba(0,0,0,0.1)',
      transition: { duration: 0.3 }
    }
  };

  return dashData && (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white relative overflow-hidden text-gray-800 pt-10 pb-16">
      <div className="absolute inset-0 opacity-20 bg-dot-pattern pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="text-5xl font-extrabold mb-12 text-center pt-8 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 bg-clip-text text-transparent"
        >
          Doctor Dashboard
        </motion.h1>

        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
          Monitor and manage your appointments with real-time insights.
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {[
            { icon: CalendarCheck, title: 'Appointments', value: dashData.appointments, delay: 0.1 },
            { icon: CheckCircle, title: 'Completed', value: dashData.completedAppointments, delay: 0.2 },
            { icon: XCircle, title: 'Cancelled', value: dashData.cancelledAppointments, delay: 0.3 },
            { icon: DollarSign, title: 'Earnings', value: `$${dashData.earnings || 0}`, delay: 0.4 },
            { icon: Users, title: 'Patients', value: dashData.patients || 0, delay: 0.5 }
          ].map(({ icon: Icon, title, value, delay }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white shadow-xl rounded-3xl p-6 flex items-center border-2 border-purple-200/50 transition-all duration-300 backdrop-blur-sm"
            >
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="mr-6"
              >
                <Icon className="h-14 w-14 text-purple-600 opacity-70" strokeWidth={1.5} />
              </motion.div>
              <div>
                <h2 className="text-sm uppercase tracking-widest text-gray-500">{title}</h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay }}
                  className="text-3xl font-bold text-gray-800"
                >
                  {value}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Latest Appointments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border-2 border-purple-200/50 overflow-hidden"
        >
          <div className="p-6 border-b border-purple-200 flex items-center bg-purple-100/50">
            <Clock className="mr-3 text-purple-600 h-6 w-6" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-gray-800">Recent Appointments</h2>
          </div>
          <table className="w-full">
            <thead className="bg-purple-50/50">
              <tr>
                {['Patient', 'Date', 'Time', 'Status', 'Amount'].map((header) => (
                  <th key={header} className="p-4 text-left text-gray-700 font-semibold uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dashData.latestAppointments) && dashData.latestAppointments.length > 0 ? (
                dashData.latestAppointments.map((appt) => {
                  const user = appt.userData || {};
                  return (
                    <tr key={appt._id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors group">
                      <td className="p-4 flex items-center">
                        <img
                          src={user.image || '/default-avatar.png'}
                          alt={user.name || 'User'}
                          className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-purple-200 shadow-md"
                        />
                        <span className="font-semibold text-gray-800">{user.name || 'Unknown'}</span>
                      </td>
                      <td className="p-4 text-gray-700">{formatDate(appt.date)}</td>
                      <td className="p-4 text-gray-700">{appt.slotTime}</td>
                      <td className="p-4">
                        <span className={getStatusClass(appt)}>
                          {appt.cancel ? 'Cancelled' : appt.isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700">${appt.amount}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-8 font-medium">
                    No recent appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      <style jsx="true" global>{`
        .bg-dot-pattern {
          background-image: radial-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            radial-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-position: 0 0, 25px 25px;
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;