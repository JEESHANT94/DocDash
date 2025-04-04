import React from 'react'
import {  Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import MyAppointment from './pages/MyAppointment'
import Doctors from './pages/Doctors'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import About from './pages/About'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentSuccess from './pages/PaymentSuccess';
import VerifyPage from './pages/VerifyPage';
const App = () => {
  return (

      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-appointments" element={<MyAppointment />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/doctors/" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile/>} />
          <Route path="/about" element={<About />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/verify" element={<VerifyPage />} />
        </Routes>
        <Footer />
      </div>

  )
}

export default App