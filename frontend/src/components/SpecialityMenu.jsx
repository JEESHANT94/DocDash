import React, { useEffect } from 'react';
import { specialityData } from '../assets/assets';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <motion.div
      id="speciality"
      className="relative flex flex-col items-center gap-6 py-20 px-4 text-gray-800 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-400 blur-2xl rounded-full" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400 blur-2xl rounded-full" />
      </div>

      <motion.h1
        className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        Find by Speciality
      </motion.h1>

      <motion.p
        className="sm:w-1/2 text-center text-sm text-gray-600"
        variants={itemVariants}
      >
        Explore a wide range of specialties and find the right doctor for your needs.
      </motion.p>

      {/* Speciality Cards */}
      <motion.div
        className="flex gap-6 pt-8 w-full overflow-x-auto pb-4 scrollbar-hide px-2 sm:px-0"
        variants={containerVariants}
      >
        {specialityData.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex-shrink-0"
          >
            <Link
              to={`/doctors/${item.speciality}`}
              onClick={scrollToTop}
              className="group flex flex-col items-center text-sm cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  className="w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-2xl shadow-lg p-4 relative z-10"
                  whileHover={{ rotate: [0, -4, 4, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={item.image}
                    alt={`${item.speciality} icon`}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              </div>
              <p className="mt-3 font-medium text-gray-700 group-hover:text-pink-500 transition-colors">
                {item.speciality}
              </p>
              <div className="flex justify-center gap-1 mt-1">
                <motion.span className="w-0 h-0.5 bg-pink-400 group-hover:w-6 transition-all duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll Indicator */}
      <div className="mt-6 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SpecialityMenu;
