import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import {
  Stethoscope,
  MapPin,
  Clock,
  Edit,
  CheckCircle2,
  Save,
  X
} from 'lucide-react'
import { DoctorContext } from '../../context/doctorContext'

const DoctorProfile = () => {
  const { dToken, doctorProfile, getDoctorProfile, updateDoctorProfile } = useContext(DoctorContext)

  const [editProfile, setEditProfile] = useState(false)
  const [formData, setFormData] = useState({
    fees: 0,
    address: { line1: '', line2: '' },
    available: false,
    about: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (dToken) getDoctorProfile()
  }, [dToken, getDoctorProfile])

  useEffect(() => {
    if (doctorProfile) {
      setFormData({
        fees: doctorProfile.fees || 0,
        address: {
          line1: doctorProfile.address?.line1 || '',
          line2: doctorProfile.address?.line2 || ''
        },
        available: doctorProfile.available || false,
        about: doctorProfile.about || ''
      })
    }
  }, [doctorProfile])

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      await updateDoctorProfile(formData)
      toast.success('Profile updated successfully!')
      setEditProfile(false)
    } catch (err) {
      toast.error('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  if (!doctorProfile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-purple-600 text-xl"
        >
          Loading profile...
        </motion.div>
      </div>
    )
  }

  const safeProfile = {
    name: doctorProfile.name || 'Doctor Name',
    image: doctorProfile.image || '/default-avatar.png',
    degree: doctorProfile.degree || 'Medical Degree',
    speciality: doctorProfile.speciality || 'General Practice',
    experience: doctorProfile.experience || 0,
    fees: doctorProfile.fees || 0,
    address: doctorProfile.address || { line1: '', line2: '' },
    available: doctorProfile.available || false,
    about: doctorProfile.about || 'No description available'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-10 px-4">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border-2 border-purple-200/50"
      >
        <div className="bg-purple-100/50 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={safeProfile.image}
                alt={safeProfile.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = '/default-avatar.png')}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-600">{safeProfile.name}</h2>
              <p className="text-indigo-600 flex items-center">
                <Stethoscope className="mr-2 w-5 h-5" />
                {safeProfile.degree} - {safeProfile.speciality}
              </p>
            </div>
          </div>
          {!editProfile && (
            <button
              onClick={() => setEditProfile(true)}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-600 transition shadow-md"
            >
              <Edit className="mr-2 w-5 h-5" />
              Edit Profile
            </button>
          )}
        </div>

        {editProfile ? (
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-pink-700 mb-1 block">Consultation Fees</label>
                <input
                  type="number"
                  value={formData.fees}
                  onChange={(e) => setFormData(prev => ({ ...prev, fees: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-pink-700 mb-1 block">Address Line 1</label>
                <input
                  type="text"
                  value={formData.address.line1}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                  className="w-full px-3 py-2 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-pink-700 mb-1 block">Address Line 2</label>
                <input
                  type="text"
                  value={formData.address.line2}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                  className="w-full px-3 py-2 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-pink-700 mb-1 block">Availability</label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                    className="mr-2 h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                  <span>{formData.available ? 'Available' : 'Unavailable'}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-pink-700 mb-1 block">About</label>
              <textarea
                value={formData.about}
                onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (<><Save className="mr-2 w-5 h-5" /> Save</>)}
              </button>
              <button
                onClick={() => setEditProfile(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-600 transition"
              >
                <X className="mr-2 w-5 h-5" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg text-pink-700 mb-2">Experience</h3>
              <div className="bg-pink-50 p-3 rounded-lg flex items-center mb-4">
                <Clock className="mr-3 w-6 h-6 text-pink-600" />
                <span className="text-pink-800">{safeProfile.experience} Years</span>
              </div>
              <h3 className="font-semibold text-lg text-pink-700 mb-2">About</h3>
              <p className="text-gray-700 bg-pink-50 p-3 rounded-lg mb-4">
                {safeProfile.about}
              </p>
              <h3 className="font-semibold text-lg text-pink-700 mb-2">Consultation Fee</h3>
              <div className="bg-blue-50 p-3 rounded-lg text-blue-800">
                ₹{safeProfile.fees}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-pink-700 mb-2">Address</h3>
              <div className="bg-blue-50 p-3 rounded-lg flex items-center mb-4">
                <MapPin className="mr-3 w-6 h-6 text-pink-600" />
                <div>
                  <p>{safeProfile.address.line1}</p>
                  <p>{safeProfile.address.line2}</p>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-pink-700 mb-2">Availability</h3>
              <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                <CheckCircle2 className={`w-6 h-6 ${safeProfile.available ? 'text-green-600' : 'text-red-600'}`} />
                <span>{safeProfile.available ? 'Currently Available' : 'Not Available'}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DoctorProfile
