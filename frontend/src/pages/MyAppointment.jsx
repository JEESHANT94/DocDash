import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Calendar, Clock, MapPin, CreditCard, XCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useLocation } from 'react-router-dom';

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData, handleStripePayment } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();

  const getUserAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      if (response.data.success) {
        const allAppointments = response.data.appointments;
        const sortedAppointments = allAppointments.sort((a, b) => {
          if (a.cancel && !b.cancel) return 1;
          if (!a.cancel && b.cancel) return -1;
          return new Date(b.date) - new Date(a.date);
        });
        setAppointments(sortedAppointments);
      } else {
        toast.error("Failed to fetch appointments.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error in getting appointments");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const result = await Swal.fire({
        title: 'Cancel Appointment?',
        text: "Are you sure you want to cancel this appointment?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f472b6',
        cancelButtonColor: '#d1d5db',
        confirmButtonText: 'Yes, cancel it!'
      });

      if (!result.isConfirmed) return;

      const response = await axios.delete(`${backendUrl}/api/user/cancel-appointment`, {
        headers: { token },
        data: { appointmentId }
      });

      if (response.data.success) {
        toast.success("Appointment canceled successfully");
        setAppointments(prev => prev.map(app => app._id === appointmentId ? { ...app, cancel: true } : app));
        getDoctorsData();
        setTimeout(() => {
          getUserAppointments();
          setRefreshKey(prev => prev + 1);
        }, 500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error(error.response?.data?.message || "Error in canceling appointment");
    }
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token, refreshKey]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const appointmentId = query.get('appointmentId');
    if (appointmentId) {
      console.log("Handling payment success for appointment:", appointmentId);
      handlePaymentSuccess(appointmentId).then(() => {
        getUserAppointments();
      });
    }
  }, [location.search]);
  

  return (
    <div className="p-6 bg-pink-50/50 rounded-lg mt-20 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-pink-400 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You don't have any appointments yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Section title="Upcoming Appointments" color="text-gray-800" appointments={appointments.filter(app => !app.cancel && !app.payment)}>
            {(appointment) => (
              <>
                <button onClick={() => handleStripePayment(appointment._id)} className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  <CreditCard className="w-4 h-4" /> Pay Online
                </button>
                <button onClick={() => cancelAppointment(appointment._id)} className="flex items-center justify-center gap-2 border border-pink-200 text-pink-500 hover:bg-pink-50 py-2 px-4 rounded-lg transition-colors duration-200">
                  <XCircle className="w-4 h-4" /> Cancel
                </button>
              </>
            )}
          </Section>

          <Section title="Completed Payments" color="text-green-800" appointments={appointments.filter(app => app.payment)}>
            {() => (
              <span className="text-green-600 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Paid</span>
            )}
          </Section>

          <Section title="Canceled Appointments" color="text-red-600" appointments={appointments.filter(app => app.cancel)}>
            {() => (
              <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">Canceled</span>
            )}
          </Section>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, color, appointments, children }) => (
  appointments.length > 0 && (
    <div>
      <h2 className={`text-xl font-semibold ${color} mb-4`}>{title}</h2>
      <div className="space-y-4">
        {appointments.map((appointment, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md border border-pink-200 p-4 md:p-6 flex flex-col md:flex-row md:items-start gap-4 transition hover:shadow-lg">
            {/* Doctor Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img src={appointment.docData.image} alt={appointment.docData.name} className="w-20 h-20 rounded-full object-cover border-2 border-pink-400" />
            </div>

            {/* Info Section */}
            <div className="flex-grow space-y-2">
              <h3 className="font-semibold text-lg text-gray-900">{appointment.docData.name}</h3>
              <p className="text-pink-500 font-medium">{appointment.docData.specialization || appointment.docData.speciality}</p>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 text-pink-400" />
                  <div>
                    <p className="font-medium">Address:</p>
                    <p>{appointment.docData.address?.line1 || "Central Hospital"}</p>
                    <p>{appointment.docData.address?.line2 || "Medical District"}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-700">
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  <span className="font-medium mr-1">Date:</span>
                  <span>{appointment.slotDate.split('_').join('/')}</span>
                </div>
                <div className="hidden sm:block border-r border-gray-300 h-5 mx-2"></div>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5 text-pink-400" />
                  <span className="font-medium mr-1">Time:</span>
                  <span>{appointment.slotTime}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 md:justify-center w-full md:w-auto">
              {children(appointment)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
);


export default MyAppointment;
