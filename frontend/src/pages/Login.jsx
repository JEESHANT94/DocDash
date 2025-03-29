import React, { useState, useContext, useEffect } from 'react';
import { User, Mail, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setToken, backendUrl, token } = useContext(AppContext)
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { email, password, name })
        if (data.success) {
          localStorage.removeItem("token");
          navigate('/verify', { state: { userId: data.userId } });
   
          toast.success(data.message)
     
        }
        else {
          toast.error(data.message)
        }
      }
      else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
        if (data.success) {
          setToken(data.token)
          localStorage.setItem('token', data.token)
          toast.success(data.message)
      
        }
        else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const toggleState = () => {
    setState(state === 'Sign Up' ? 'Login' : 'Sign Up');
  };
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (token && currentPath !== '/verify') {
      navigate('/');
    }
  }, [token, navigate]);
  
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100 p-4">
      {/* Creative background elements */}
      <div className="absolute inset-0 z-0">
        {/* Top wave */}
        <motion.div
          className="absolute -top-24 left-0 right-0 h-64 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute h-full w-full fill-pink-100">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </motion.div>

        {/* Bottom wave */}
        <motion.div
          className="absolute -bottom-24 left-0 right-0 h-64 w-full rotate-180"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute h-full w-full fill-pink-200">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </motion.div>

        {/* Animated particles */}
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full bg-pink-${100 + (index % 4) * 100}/30`}
            style={{
              width: `${10 + (index % 5) * 8}px`,
              height: `${10 + (index % 5) * 8}px`,
              left: `${(index * 8) % 90}%`,
              top: `${(index * 7) % 85}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, index % 2 === 0 ? 10 : -10, 0],
              opacity: [0.7, 0.9, 0.7]
            }}
            transition={{
              duration: 3 + index % 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
        ))}

        {/* Geometric patterns */}
        <div className="absolute h-full w-full bg-[radial-gradient(circle_at_10%_20%,rgba(255,192,203,0.05)_0%,rgba(255,182,193,0.07)_40%,rgba(255,105,180,0.1)_80%)]"></div>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')"
          }}>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <motion.div
          className="relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm shadow-2xl"
          animate={{ borderRadius: state === 'Sign Up' ? "1.5rem" : "1rem" }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative elements */}
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-400/20"></div>
          <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-pink-400/20"></div>

          <div className="relative p-8">
            <motion.div
              className="mb-6 text-center"
              animate={{ y: state === 'Sign Up' ? 0 : -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h2
                className="text-2xl font-bold text-pink-900"
                key={state}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {state === 'Sign Up' ? 'Create an account' : 'Welcome back'}
              </motion.h2>
              <motion.p
                className="mt-2 text-gray-600"
                key={state + "desc"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                Please {state === 'Sign Up' ? 'sign up' : 'login'} to book an appointment
              </motion.p>
            </motion.div>

            <form onSubmit={onSubmit} className="space-y-4">
              <motion.div
                className="space-y-4"
                animate={{ height: state === 'Sign Up' ? 'auto' : 0, opacity: state === 'Sign Up' ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                {state === 'Sign Up' && (
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-pink-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={state === 'Sign Up'}
                      className="w-full rounded-lg border border-pink-100 bg-pink-50/50 py-3 pl-10 pr-4 text-gray-900 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                  </div>
                )}
              </motion.div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-pink-100 bg-pink-50/50 py-3 pl-10 pr-4 text-gray-900 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-pink-100 bg-pink-50/50 py-3 pl-10 pr-4 text-gray-900 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>

              {state === 'Login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-pink-400 hover:text-pink-600">
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative mt-2 flex w-full items-center justify-center rounded-lg bg-pink-500 py-3 text-white transition duration-300 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <span className="mr-2">{state === 'Sign Up' ? 'Sign Up' : 'Login'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-gray-600">
                {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={toggleState}
                  className="ml-1 inline-flex items-center font-medium text-pink-400 hover:text-pink-600"
                >
                  {state === 'Sign Up' ? (
                    <>
                      <LogIn className="mr-1 h-4 w-4" />
                      Login
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-1 h-4 w-4" />
                      Sign Up
                    </>
                  )}
                </motion.button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;