import { createContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from '@stripe/stripe-js';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
 
    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [topDoctors, setTopDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : false)
    const [userData, setUserData] = useState(false)
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`)
            if (data.success) {
                setTopDoctors(data.doctors)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
    const loadUserData = async () => {
        try {
           
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile-data`, {
                headers: {
                    token
                }
            })
            if (data.success) {
                setUserData(data.userData)
               
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleStripePayment = async (appointmentId) => {
        try {
          const res = await axios.post(
            `${backendUrl}/api/payment/create-stripe-session`,
            { appointmentId },
            { headers: { token } }
          );
          
          if (res.data.success && res.data.url) {
            // ✅ Use direct redirect instead of Stripe's redirectToCheckout with sessionId
            window.location.href = res.data.url;
          } else {
            toast.error("Failed to initiate payment.");
          }
        } catch (error) {
          console.error("Stripe payment error:", error);
          toast.error("Something went wrong with payment.");
        }
      };
     
      const handleFullPaymentSuccess = async (appointmentId, callback) => {
        try {
          const res = await axios.post(
            `${backendUrl}/api/payment/mark-appointment-as-paid`,
            { appointmentId },
            { headers: { token } }
          );
      
          if (res.data.success) {
            toast.success("✅ Payment successful!");
      
            await axios.post(
              `${backendUrl}/api/payment/send-payment-receipt`,
              { appointmentId },
              { headers: { token } }
            );
      
            console.log("📧 Receipt email sent successfully");
      
            if (typeof callback === "function") callback();
          } else {
            toast.error("❌ Payment failed.");
          }
        } catch (error) {
          console.error("❌ Error during payment/receipt:", error);
          toast.error("Something went wrong during payment process.");
        }
      };
      
    
    const value = {
        topDoctors,
        currencySymbol,
        backendUrl,
        token,
        setToken,
        getDoctorsData,
        userData,
        setUserData,
        handleStripePayment,
        handleFullPaymentSuccess,

    };
    useEffect(() => {
        getDoctorsData()
    }, [])
    useEffect(() => {
        if (token) {
            loadUserData()
        }
        else {
            setUserData(false)
        }
    }, [token])
    return (
        <AppContext.Provider value={value}>
            {children}

        </AppContext.Provider>
    );
};

export default AppContextProvider;
