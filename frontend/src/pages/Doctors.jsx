import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react'; 
const Doctors = () => {
  const { speciality } = useParams();
  const { topDoctors } = useContext(AppContext);
  const [filterDoctors, setFilterDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Simulate loading state
  const navigate = useNavigate();

  // Apply filter based on speciality and search query
  const applyFilter = () => {
    let filteredDoctors = topDoctors;

    if (speciality) {
      filteredDoctors = filteredDoctors.filter((doctor) => doctor.speciality === speciality);
    }

    if (searchQuery) {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilterDoctors(filteredDoctors);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1-second delay for loading simulation
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    applyFilter();
  }, [topDoctors, speciality, searchQuery]);

  return (
    <div className='mt-20 px-4 sm:px-8'>
    {/* Hero Section */}
    <div className='text-center mb-10'>
      <h1 className='text-4xl font-bold text-gray-900 mb-4'>Find the Best Doctors</h1>
      <p className='text-gray-600 text-lg'>
        Browse through the list of doctors and book an appointment with the one you like.
      </p>
    </div>

    {/* Professional Search Bar */}
    <div className='flex justify-center mb-8'>
      <div className='relative w-full sm:w-96'>
        <input
          type='text'
          placeholder='Search doctors by name...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all'
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Search className='w-5 h-5 text-gray-400' /> {/* Search icon */}
        </div>
      </div>
    </div>

      {/* Filters and Doctor List */}
      <div className='flex flex-col sm:flex-row items-start gap-8'>
        {/* Filter Sidebar */}
        <div className='flex flex-col gap-4 text-sm text-gray-600 w-full sm:w-64'>
          {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((spec, index) => (
            <motion.p
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
              className={`w-full pl-3 py-2 pr-16 border border-gray-300 rounded-lg transition-all cursor-pointer ${
                speciality === spec ? 'bg-pink-200 text-black' : 'hover:bg-pink-50'
              }`}
            >
              {spec}
            </motion.p>
          ))}
        </div>

        {/* Doctor Cards */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {isLoading ? (
            // Loading Skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='bg-white border border-pink-100 rounded-2xl overflow-hidden shadow-lg animate-pulse'>
                <div className='w-full h-64 bg-gray-200'></div>
                <div className='p-6'>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
              </div>
            ))
          ) : (
            filterDoctors.map((doctor, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;