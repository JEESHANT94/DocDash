// Navbar.jsx
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/doctorContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  
  const logout = () => {
    navigate('/');
    aToken && setAToken('');
    aToken && localStorage.removeItem('aToken');
    dToken && setDToken('');
    dToken && localStorage.removeItem('dToken');
  };

  // Animations
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      } 
    }
  };

  const logoVariants = {
    hover: { 
      scale: 1.03,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(236, 72, 153, 0.35)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
    tap: { scale: 0.95 }
  };

  const badgeVariants = {
    initial: { scale: 0 },
    animate: { 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        delay: 0.3,
        damping: 15 
      } 
    }
  };

  return (
    <motion.div 
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-between items-center px-4 sm:px-10 py-4 border-b bg-white shadow-sm backdrop-blur-sm bg-white/95 sticky top-0 z-50"
    >
      <div className="flex items-center gap-3 text-xs">
        <motion.img 
          variants={logoVariants}
          whileHover="hover"
          className="w-36 sm:w-40 cursor-pointer" 
          src={assets.logo3} 
          alt="DocDash Logo" 
        />
        <motion.p 
          variants={badgeVariants}
          initial="initial"
          animate="animate"
          className="border px-3 py-1 rounded-full border-pink-300 bg-pink-50 text-pink-600 font-medium"
        >
          {aToken ? 'Admin' : 'Doctor'}
        </motion.p>
      </div>
      
      <motion.button 
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={logout} 
        className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-sm px-8 py-2.5 rounded-full shadow-md"
      >
        Logout
      </motion.button>
    </motion.div>
  );
};

export default Navbar;
