import React, { useState, useContext, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Lock, ArrowRight, Shield, Stethoscope } from 'lucide-react';
import { DoctorContext } from '../context/doctorContext';
const Login = () => {
  const [state, setState] = useState('Admin');
  const { setAToken, backendUrl } = useContext(AdminContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const { setDToken } = useContext(DoctorContext);

  useEffect(() => {
    setAnimate(true);
    return () => setAnimate(false);
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
 
        if (data.success) {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          toast.success('Login Successful! 🎉');
        } else {
          toast.error(data.message || 'Invalid credentials, please try again!');
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
        if (data.success) {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          toast.success('Login Successful! 🎉');
        } else {
          toast.error(data.message || 'Invalid credentials, please try again!');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleState = () => {
    setAnimate(false);
    setTimeout(() => {
      setState(state === 'Admin' ? 'Doctor' : 'Admin');
      setAnimate(true);
    }, 300);
  };
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-50/50">
      <div className={`w-full max-w-md transform transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center bg-pink-500 text-white transition-colors duration-300">
            <div className="flex justify-center mb-4">
              {state === 'Admin' ? 
                <Shield className="h-12 w-12 text-white" /> : 
                <Stethoscope className="h-12 w-12 text-white" />
              }
            </div>
            <h2 className="text-3xl font-bold">
              <span className="animate-pulse inline-block mr-1">
                {state}
              </span> Login
            </h2>
            <p className="mt-2 text-sm opacity-80">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form fields */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-pink-400" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-pink-400" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {isLoading ? 'Logging in...' : 'Login'} 
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {state === 'Admin' ? 'Doctor Login? ' : 'Admin Login? '}
                <button 
                  type="button"
                  onClick={toggleState}
                  className="font-medium text-pink-500 hover:text-pink-600 transition-all duration-300"
                >
                  Click here
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;