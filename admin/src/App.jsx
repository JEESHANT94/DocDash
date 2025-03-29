import React, { useContext } from 'react';
import Login from './pages/login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppoinment from './pages/Doctor/DoctorAppoinment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import AllAppointments from './pages/Admin/AllAppointments';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/doctorContext';
const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return aToken || dToken ? (
    
    <div className="bg-[#F8F9FD] min-h-screen">
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Full-width Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="flex pt-[70px]"> {/* Add top padding equal to navbar height */}
        {/* Sidebar fixed on the left below navbar */}
        <div className="fixed top-[70px] left-0 h-[calc(100vh-70px)] z-40">
          <Sidebar />
        </div>

        {/* Main content area with sidebar offset and navbar offset */}
        {/* Admin Routes */}
        <div className="ml-[240px] w-full px-6">
          <Routes>
            <Route path="/" element={aToken ? <Dashboard /> : <DoctorDashboard />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorsList />} />

            {/* Doctor Routes */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-appointments" element={<DoctorAppoinment />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default App;
