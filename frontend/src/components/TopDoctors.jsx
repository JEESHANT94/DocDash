import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'


const TopDoctors = () => {
   const navigate = useNavigate()
   const {topDoctors} = useContext(AppContext)

   const containerVariants = {
       hidden: { opacity: 0 },
       visible: {
           opacity: 1,
           transition: { staggerChildren: 0.1 }
       }
   }

   const cardVariants = {
       hidden: { opacity: 0, y: 20 },
       visible: { opacity: 1, y: 0 }
   }

   return (
       <motion.div 
           className='relative flex flex-col gap-6 my-16 items-center text-gray-900 md:mx-10'
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={containerVariants}
       >
           {/* Background Effects */}
           <div className="absolute inset-0 -z-10">
               <div className="absolute top-40 left-20 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-30" />
               <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />
           </div>

           <motion.h1 
               className='text-4xl font-medium bg-gradient-to-r from-gray-900 via-pink-500 to-gray-900 bg-clip-text text-transparent'
               variants={cardVariants}
           >
               Top Doctors to Book an Appointment
           </motion.h1>

           <motion.p 
               className='text-center text-gray-600 text-sm sm:w-1/3'
               variants={cardVariants}
           >
               Simply browse through the list of doctors and book an appointment with the one you like.
           </motion.p>

           <motion.div 
               className='w-full grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 pt-8 px-3 sm:px-0'
               variants={containerVariants}
           >
               {topDoctors.slice(0, 10).map((doctor, index) => (
                   <motion.div
                       key={index}
                       variants={cardVariants}
                       whileHover={{ 
                           y: -10,
                           transition: { type: "spring", stiffness: 300 }
                       }}
                       className='group bg-white border border-pink-100 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500'
                       onClick={() => navigate(`/appointment/${doctor._id}`)}
                   >
                       <div className="relative overflow-hidden">
                           <motion.div
                               className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                           />
                           <motion.img 
                               className='w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500' 
                               src={doctor.image}
                               alt={doctor.name}
                               whileHover={{ scale: 1.1 }}
                           />
                           <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                               <div className='flex items-center gap-2 text-sm text-green-500'>
                                   <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                                   <span>Available</span>
                               </div>
                           </div>
                       </div>

                       <motion.div 
                           className='p-6 relative'
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                       >
                           <h3 className='text-gray-900 text-xl font-medium group-hover:text-pink-500 transition-colors duration-300'>
                               {doctor.name}
                           </h3>
                           <p className='text-gray-600 text-sm mt-1'>{doctor.speciality}</p>
                           
                           <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                               </svg>
                           </div>
                       </motion.div>
                   </motion.div>
               ))}
           </motion.div>

           <motion.button 
               onClick={() => {navigate('/doctors');scrollTo(0,0)}}
               className='bg-gradient-to-r from-pink-500 to-pink-600 text-white px-12 py-3 rounded-full mt-10 shadow-lg hover:shadow-xl transition-all duration-300'
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
           >
               View More Doctors
           </motion.button>
       </motion.div>
   )
}

export default TopDoctors