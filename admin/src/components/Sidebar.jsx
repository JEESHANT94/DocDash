import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/doctorContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarVariants = {
    expanded: { width: "240px", transition: { duration: 0.3, type: "spring", stiffness: 100 } },
    collapsed: { width: "80px", transition: { duration: 0.3, type: "spring", stiffness: 100 } }
  };

  const navItemVariants = {
    initial: { x: -20, opacity: 0 },
    animate: i => ({
      x: 0, opacity: 1,
      transition: { delay: i * 0.1, duration: 0.5 }
    }),
    hover: { backgroundColor: "#F9F5FF", color: "#EC4899", transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  const textVariants = {
    expanded: { opacity: 1, display: "block", transition: { delay: 0.1, duration: 0.2 } },
    collapsed: { opacity: 0, display: "none", transition: { duration: 0.2 } }
  };

  const iconVariants = {
    expanded: { marginRight: "12px" },
    collapsed: { marginRight: "0px" },
    pulse: { scale: [1, 1.1, 1], transition: { duration: 0.3 } }
  };

  const toggleVariants = {
    expanded: { rotate: 0 },
    collapsed: { rotate: 180 }
  };

  const navItems = [
    { to: '/admin-dashboard', icon: assets.home_icon, text: 'Dashboard' },
    { to: '/all-appointments', icon: assets.appointment_icon, text: 'Appointments' },
    { to: '/add-doctor', icon: assets.add_icon, text: 'Add Doctor' },
    { to: '/doctor-list', icon: assets.people_icon, text: 'Doctors List' }
  ];

  const doctorNavItems = [
    { to: '/doctor-dashboard', icon: assets.home_icon, text: 'Dashboard' },
    { to: '/doctor-appointments', icon: assets.appointment_icon, text: 'Appointments' },
    { to: '/doctor-profile', icon: assets.people_icon, text: 'Profile' } 
  ];

  return (
    <motion.div
      variants={sidebarVariants}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="min-h-screen bg-white border-r shadow-sm relative overflow-hidden"
    >
      {(aToken || dToken) && (
        <motion.div
          className="absolute top-5 -right-2 bg-pink-100 rounded-full p-1 cursor-pointer z-10"
          variants={toggleVariants}
          animate={isCollapsed ? "collapsed" : "expanded"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="text-pink-500"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.div>
      )}

      <div className="mt-8">
        {aToken && navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              const base = `flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} py-4 px-5 cursor-pointer relative overflow-hidden`;
              const active = isActive ? 'text-pink-600 font-medium bg-pink-50' : 'text-gray-600';
              return `${base} ${active}`;
            }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-pink-400"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <motion.div
                  custom={i}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  className={`flex items-center w-full rounded-md px-3 py-2 ${isActive ? 'bg-pink-50' : ''}`}
                >
                  <motion.img
                    src={item.icon}
                    alt=""
                    variants={iconVariants}
                    whileHover="pulse"
                    className="w-5 h-5"
                  />
                  <motion.span
                    variants={textVariants}
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    className="ml-3 whitespace-nowrap"
                  >
                    {item.text}
                  </motion.span>
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="indicator"
                      className="absolute right-5 w-1.5 h-1.5 rounded-full bg-pink-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </>
            )}
          </NavLink>
        ))}

        {dToken && doctorNavItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              const base = `flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} py-4 px-5 cursor-pointer relative overflow-hidden`;
              const active = isActive ? 'text-pink-600 font-medium bg-pink-50' : 'text-gray-600';
              return `${base} ${active}`;
            }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-pink-400"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <motion.div
                  custom={i}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  className={`flex items-center w-full rounded-md px-3 py-2 ${isActive ? 'bg-pink-50' : ''}`}
                >
                  <motion.img
                    src={item.icon}
                    alt=""
                    variants={iconVariants}
                    whileHover="pulse"
                    className="w-5 h-5"
                  />
                  <motion.span
                    variants={textVariants}
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    className="ml-3 whitespace-nowrap"
                  >
                    {item.text}
                  </motion.span>
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="indicator"
                      className="absolute right-5 w-1.5 h-1.5 rounded-full bg-pink-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;
