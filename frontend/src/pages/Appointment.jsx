import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  Check, Info, Clock, Calendar, Star, 
  MapPin, Phone, Mail, Shield, Award,
  Heart, ChevronRight, Video
} from 'lucide-react';

function Appointment() {
  // ... [Previous state and helper functions remain the same]
  const { docId } = useParams();
  const { topDoctors, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // ... [Previous fetchDocInfo and getAvailableSlots functions remain the same]
  const fetchDocInfo = async () => {
    const docInfo = topDoctors.find((doctor) => doctor._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [topDoctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  if (!docInfo) return null;

  return (
    <div className="min-h-screen bg-pink-50/50 pt-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Doctor Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Left Column - Image and Quick Stats */}
          <div className="md:w-1/3">
            <div 
              className="relative rounded-xl overflow-hidden group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="aspect-w-1 aspect-h-1">
                <img
                  className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                  src={docInfo.image}
                  alt={docInfo.name}
                />
              </div>
              {/* Overlay with rating */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent  
                transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2">
                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                    <span className="font-medium">4.9/5.0</span>
                  </div>
                  <div className="text-sm opacity-90">200+ patient reviews</div>
                </div>
              </div>
              {/* Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="px-3 py-1 bg-pink-400 text-white text-sm rounded-full flex items-center gap-1 shadow-lg">
                  <Shield className="w-4 h-4" /> Verified
                </span>
                <span className="px-3 py-1 bg-pink-500 text-white text-sm rounded-full flex items-center gap-1 shadow-lg">
                  <Award className="w-4 h-4" /> Top Rated
                </span>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="mt-6 space-y-3">
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-400 p-2 rounded-full shadow-md">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-pink-900">Video Consultation</div>
                    <div className="text-sm text-pink-600">Available Today</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-400 p-2 rounded-full shadow-md">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Clinic Location</div>
                    <div className="text-sm text-gray-600">Central Hospital, NY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Doctor Details */}
          <div className="md:w-2/3 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{docInfo.name}</h1>
                <div 
                  className="relative"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Info className="text-pink-400 hover:text-pink-600 transition-colors cursor-pointer" size={20} />
                  {showTooltip && (
                    <div className="absolute z-10 px-3 py-2 text-sm text-white bg-pink-500 rounded-lg -top-10 left-1/2 transform -translate-x-1/2">
                      View profile
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm border border-pink-100">
                  {docInfo.speciality}
                </span>
                <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm border border-pink-100">
                  {docInfo.degree}
                </span>
                <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm border border-pink-100">
                  {docInfo.experience} years exp.
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">About</h3>
              <p className="text-gray-600 leading-relaxed">{docInfo.about}</p>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <span className="text-pink-900">Consultation Fee</span>
                </div>
                <span className="text-xl font-bold text-pink-600">
                  {currencySymbol}{docInfo.fees}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Booking Section */}
        <div className="bg-pink-50/50 p-6 mt-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-pink-500" />
            Book Your Appointment
          </h2>

          {/* Date Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
            {docSlots.map((slots, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`
                  cursor-pointer rounded-xl border-2 transition-all duration-300
                  ${slotIndex === index 
                    ? 'border-pink-400 bg-pink-50 shadow-md scale-105' 
                    : 'border-transparent bg-white hover:border-pink-200'
                  }
                `}
              >
                <div className="p-4 text-center">
                  <div className={`text-sm font-medium ${slotIndex === index ? 'text-pink-600' : 'text-gray-500'}`}>
                    {slots[0] && daysOfWeek[slots[0].datetime.getDay()]}
                  </div>
                  <div className={`text-lg font-bold mt-1 ${slotIndex === index ? 'text-pink-700' : 'text-gray-900'}`}>
                    {slots[0] && slots[0].datetime.getDate()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {docSlots[slotIndex]?.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSlotTime(slot.time)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                    ${slotTime === slot.time
                      ? 'bg-pink-400 text-white shadow-lg scale-105'
                      : 'bg-white hover:bg-pink-50 text-gray-700 hover:shadow border border-pink-100'
                    }
                  `}
                >
                  {slot.time.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Book Button */}
          <div className="mt-8 flex justify-end">
            <button
              className={`
                group flex items-center gap-2 px-6 py-3 rounded-xl font-medium
                transition-all duration-300 
                ${slotTime 
                  ? 'bg-pink-400 hover:bg-pink-500 text-white transform hover:-translate-y-1'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
              disabled={!slotTime}
            >
              <span>Book Appointment</span>
              <ChevronRight 
                className={`w-5 h-5 transition-transform duration-300 
                ${slotTime ? 'group-hover:translate-x-1' : ''}`} 
              />
              {slotTime && (
                <Heart className="w-5 h-5 text-white animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointment;