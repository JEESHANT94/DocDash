import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { MailCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [expired, setExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, backendUrl } = useContext(AppContext);
  const inputRefs = useRef([]);

  const userId = location.state?.userId || localStorage.getItem("pendingVerificationUserId");

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/');
    if (!userId) navigate('/');
    localStorage.setItem("pendingVerificationUserId", userId);
  }, []);

  useEffect(() => {
    const timer = cooldown > 0 && setInterval(() => setCooldown(prev => prev - 1), 100);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    const expiry = setTimeout(() => setExpired(true), 5 * 60 * 1000); 
    return () => clearTimeout(expiry);
  }, []);

  const handleChange = (val, idx) => {
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 5) inputRefs.current[idx + 1].focus();
  };

  const handleVerify = async () => {
    if (expired) return toast.error("Code expired. Please request a new one.");
    if (attemptsLeft <= 0) return toast.error("Too many attempts. Try again later.");

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify`, {
        userId,
        code: code.join('')
      });
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem('token', data.token);
        localStorage.removeItem('pendingVerificationUserId');
        setToken(data.token);
        navigate('/');
      } else {
        setAttemptsLeft(prev => prev - 1);
        toast.error(data.message + ` (${attemptsLeft - 1} attempts left)`);
      }
    } catch (error) {
      console.log("Verification error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      console.log(userId);
      const { data } = await axios.post(`${backendUrl}/api/user/resend-code`, { userId });
      if (data.success) {
        toast.success("Verification code resent to your email.");
        setCooldown(60);
        setExpired(false);
        setAttemptsLeft(5);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Resend code error:", error);
      toast.error("Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl text-center"
      >
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mb-6">
          <MailCheck className="mx-auto h-12 w-12 text-pink-500" />
          <h2 className="text-xl font-bold text-pink-800 mt-4">Email Verification</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Please enter the 6-digit code sent to your email.
          </p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-4">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={el => inputRefs.current[idx] = el}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="w-12 h-12 text-center text-lg border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300"
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition duration-200"
        >
          Verify & Continue
        </motion.button>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="text-pink-500 hover:underline"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
          {expired && (
            <div className="text-red-500 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> Code expired
            </div>
          )}
        </div>

        {!expired && attemptsLeft < 5 && (
          <div className="mt-2 text-sm text-orange-500">
            {attemptsLeft} verification attempt{attemptsLeft === 1 ? '' : 's'} left
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyPage;