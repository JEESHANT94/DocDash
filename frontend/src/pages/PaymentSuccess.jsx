import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const { handleFullPaymentSuccess } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const appointmentId = query.get("appointmentId");
  
    if (appointmentId) {
      handleFullPaymentSuccess(appointmentId, () => {
        setTimeout(() => {
          navigate("/my-appointments");
        }, 3000);
      });
    }
  }, [location.search]);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-green-700 p-6">
      <CheckCircle className="w-20 h-20 mb-4 text-green-500 animate-bounce" />
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-center max-w-md">
        Your appointment has been confirmed. You'll be redirected shortly.
      </p>
    </div>
  );
};

export default PaymentSuccess;
