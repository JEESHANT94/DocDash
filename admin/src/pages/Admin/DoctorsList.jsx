import React, { useContext, useEffect, useState } from 'react';
import { Check, X, Heart, UserCheck, UserX, Filter, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (aToken) {
      setLoading(true);
      getAllDoctors()
        .catch((err) => console.error('getAllDoctors error:', err))
        .finally(() => setLoading(false));
    }
  }, [aToken]);

  const handleToggle = async (doctorId) => {
    try {
      setLoading(true);
      setToggleLoading(doctorId);
      await changeAvailability(doctorId);
      await getAllDoctors();
    } catch (error) {
      console.error('Error toggling availability:', error);
    } finally {
      setToggleLoading(null);
      setLoading(false);
    }
  };

  const filteredDoctors = Array.isArray(doctors)
    ? doctors.filter((doctor) => {
        const matchesFilter =
          filter === 'all' ||
          (filter === 'available' && doctor.available) ||
          (filter === 'unavailable' && !doctor.available);

        const matchesSearch =
          doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
      })
    : [];

  return (
    <div className="min-h-screen  py-10 px-6 relative">
      {/* Global Full Page Loader */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-16 h-16 border-4 border-pink-300 border-t-pink-600 rounded-full"
          />
        </div>
      )}

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-4xl font-extrabold mb-12 text-center pt-8 bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-400 
          bg-clip-text text-transparent">Doctor Management</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-white border border-pink-200 focus:ring-2 focus:ring-pink-300 transition duration-300 hover:border-pink-400 shadow-sm"
              />
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-white border border-pink-200 focus:ring-2 focus:ring-pink-300 transition duration-300 hover:border-pink-400 shadow-sm"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Doctor Cards */}
        {filteredDoctors.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence>
              {filteredDoctors.map((doctor) => (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  className={`rounded-3xl shadow-md p-6 border-l-4 overflow-hidden relative transform transition-all duration-300 
                    ${doctor.available ? 'border-green-500 bg-green-50/50' : 'border-red-500 bg-red-50/50'}`}
                >
                  <div
                    className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-bl-lg 
                    ${doctor.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </div>

                  <div className="relative mb-4 flex justify-center">
                    <motion.img
                      src={doctor.image}
                      alt={doctor.name}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      className={`w-32 h-32 rounded-full object-cover border-4 
                        ${doctor.available ? 'border-green-300' : 'border-red-300'}`}
                    />
                    <div
                      className={`absolute bottom-0 right-[30%] w-10 h-10 rounded-full flex items-center justify-center shadow-md 
                        ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {doctor.available ? (
                        <UserCheck className="text-white" size={20} />
                      ) : (
                        <UserX className="text-white" size={20} />
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-pink-800">{doctor.name}</h2>
                    <p className="text-pink-600 mb-4">{doctor.speciality}</p>

                    <button
                      onClick={() => handleToggle(doctor._id)}
                      disabled={toggleLoading === doctor._id}
                      className={`w-full py-3 rounded-full font-semibold text-white transition duration-300 flex items-center justify-center space-x-2
                        ${toggleLoading === doctor._id
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:shadow-md'}
                        ${doctor.available
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'}`}
                    >
                      {toggleLoading === doctor._id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : doctor.available ? (
                        <Check size={20} />
                      ) : (
                        <X size={20} />
                      )}
                      <span>
                        {toggleLoading === doctor._id
                          ? 'Updating...'
                          : doctor.available
                          ? 'Mark Unavailable'
                          : 'Mark Available'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 bg-pink-100 rounded-xl"
            >
              <Heart className="mx-auto text-pink-400 mb-4" size={48} />
              <p className="text-xl text-pink-600">No doctors found</p>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
