import React from 'react'
import { specialityData } from '../assets/assets'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'


const SpecialityMenu = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.div 
            className='relative flex flex-col items-center gap-6 py-20 text-gray-800 overflow-hidden'
            id='speciality'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 -z-10 opacity-5">
                <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-pink-400 blur-2xl"/>
                <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-blue-400 blur-2xl"/>
            </div>

            <motion.h1 
                className='text-4xl font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
                variants={itemVariants}
            >
                Find by Speciality
            </motion.h1>

            <motion.p 
                className='sm:w-1/3 text-center text-sm text-gray-600'
                variants={itemVariants}
            >
                Simply browse through the list of doctors and book an appointment with the one you like.
            </motion.p>

            <motion.div 
                className='flex sm:justify-center gap-6 pt-8 w-full overflow-x-auto pb-4 scrollbar-hide'
                variants={containerVariants}
            >
                {specialityData.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -10, scale: 1.05 }}
                        className="relative"
                    >
                        <Link 
                            onClick={() => scrollTo(0,0)} 
                            className='group flex flex-col items-center text-sm cursor-pointer flex-shrink-0' 
                            to={`/doctors/${item.speciality}`}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <motion.div
                                    className='w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-2xl shadow-lg p-4 relative z-10'
                                    whileHover={{ rotate: [0, -5, 5, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img 
                                        className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-110' 
                                        src={item.image} 
                                        alt={item.speciality} 
                                    />
                                </motion.div>
                            </div>
                            <p className="mt-3 font-medium text-gray-700 group-hover:text-pink-500 transition-colors duration-300">
                                {item.speciality}
                            </p>
                            <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-pink-400 group-hover:w-1/2 transition-all duration-300"/>
                            <span className="absolute -bottom-1 right-1/2 w-0 h-0.5 bg-pink-400 group-hover:w-1/2 transition-all duration-300"/>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Custom Scroll Indicator */}
            <div className="mt-6 flex gap-1">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-300"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                    />
                ))}
            </div>
        </motion.div>
    )
}



export default SpecialityMenu
