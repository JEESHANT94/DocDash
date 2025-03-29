import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/doctorContext';
import { CheckCircle2, XCircle, Loader2, UserCircle2, CalendarDays, CreditCard, Clock3 } from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorAppointment = () => {
  const { dToken, appointments, getDocAppointments, markAppointmentAsCompleted, markAppointmentAsCancelled } = useContext(DoctorContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateAge = (birthdate) => {
    if (!birthdate) return 'N/A';
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        if (dToken) {
          await getDocAppointments();
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch appointments');
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [dToken, getDocAppointments]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full p-8">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
        <p className="text-gray-500 text-lg">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 mt-10 bg-white shadow-xl rounded-3xl border border-purple-100"
    >
      <div className="flex items-center mb-6 space-x-3">
        <CalendarDays className="text-purple-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-purple-700">Your Appointments</h2>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg font-semibold mb-2">No appointments currently</p>
          <p className="text-sm">You have no scheduled appointments at the moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-purple-50">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left"><UserCircle2 className="inline mr-1 text-purple-400" />Patient</th>
                <th className="p-4 text-left"><CreditCard className="inline mr-1 text-green-400" />Payment</th>
                <th className="p-4 text-left">Age</th>
                <th className="p-4 text-left"><Clock3 className="inline mr-1 text-blue-400" />Date & Time</th>
                <th className="p-4 text-left">Fees</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice().reverse().map((appointment, index) => (
                <tr key={appointment._id || index} className="border-t hover:bg-purple-50/30 transition-colors">
                  <td className="p-4 font-medium text-purple-600">{index + 1}</td>
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={appointment.userData.image}
                      alt={appointment.userData.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-200"
                    />
                    <span>{appointment.userData.name}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.payment
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'}`}
                    >
                      {appointment.payment ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="p-4">{calculateAge(appointment.userData.dob)}</td>
                  <td className="p-4">{appointment.slotDate} {appointment.slotTime}</td>
                  <td className="p-4 font-semibold">${appointment.amount}</td>
                  <td className="p-4">
                    {appointment.cancel ? (
                      <span className="text-red-600 font-semibold">Cancelled</span>
                    ) : appointment.isCompleted ? (
                      <span className="text-green-600 font-semibold">Completed</span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => markAppointmentAsCompleted(appointment._id)}
                          className="text-green-600 hover:text-green-800"
                          title="Mark as Completed"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <button
                          onClick={() => markAppointmentAsCancelled(appointment._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Cancel Appointment"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default DoctorAppointment;
