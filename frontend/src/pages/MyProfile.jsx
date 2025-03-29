import React, { useState, useContext, useRef, useEffect } from 'react';
import { Edit2, Save, Camera, Award, MapPin, Calendar, Phone, Mail, Droplet, User, Heart, Activity, Smile, Frown, Meh } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showAchievementAnimation, setShowAchievementAnimation] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Mood options with emoji and colors
  const moodOptions = [
    { value: 'Happy', icon: <Smile className="h-5 w-5 text-yellow-500" />, color: 'bg-yellow-100' },
    { value: 'Neutral', icon: <Meh className="h-5 w-5 text-blue-500" />, color: 'bg-blue-100' },
    { value: 'Sad', icon: <Frown className="h-5 w-5 text-gray-500" />, color: 'bg-gray-100' },
    { value: 'Energetic', icon: <Activity className="h-5 w-5 text-green-500" />, color: 'bg-green-100' },
    { value: 'Loving', icon: <Heart className="h-5 w-5 text-pink-500" />, color: 'bg-pink-100' },
  ];

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        gender: userData.gender || '',
        dob: userData.dob || '',
        blood_group: userData.blood_group || '',
        achievements: userData.achievements || [],
        address: userData.address || { line1: "", line2: "" },
        stats: userData.stats || { completedTasks: 0, pendingTasks: 0, daysActive: 0 },
        mood: userData.mood || 'Happy'
      });
      
      // Reset image preview when userData changes
      setImagePreview(null);
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Create FormData object for sending data including file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('dob', formData.dob);
      formDataToSend.append('blood_group', formData.blood_group);
      formDataToSend.append('mood', formData.mood || 'Happy');
      
      // Convert objects to JSON strings as required by your backend
      formDataToSend.append('address', JSON.stringify(formData.address || {}));
      formDataToSend.append('stats', JSON.stringify(formData.stats || {}));
      formDataToSend.append('achievements', JSON.stringify(formData.achievements || []));

      // Add image file if it exists
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      // Send request to update profile
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile-data`,
        formDataToSend,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        toast.success('Profile updated successfully', {
          icon: '💖',
          style: { background: '#FDF2F8', color: '#BE185D' }
        });
        // Reset imagePreview so we load from server
        setImagePreview(null);
        // Reload user data to get the updated profile
        await loadUserData();
        setIsEditing(false);
        
        // Show achievement animation if achievements were updated
        if (formData.achievements?.length > (userData.achievements?.length || 0)) {
          setShowAchievementAnimation(true);
          setTimeout(() => setShowAchievementAnimation(false), 3000);
        }
      } else {
        toast.error(data.message || 'Error updating profile');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile-data`, {
        headers: {
          token
        }
      });
      
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading user data');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true);
      
      // Update local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
      
      // Store the file for form submission
      setFormData({ ...formData, imageFile: file });
      
      // If you want to upload immediately
      if (!isEditing) {
        setIsEditing(true);
      }
    }
  };

  // Function to update nested address object
  const updateAddress = (field, value) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: value
      }
    });
  };

  // Get the correct image URL to display
  const getImageUrl = () => {
    if (imagePreview) {
      return imagePreview; // Show local preview if available
    } else if (userData && userData.image) {
      // Add a timestamp or random param to force re-fetch
      return `${userData.image}?t=${new Date().getTime()}`;
    }
    return '/default-profile.png'; // Fallback to default
  };

  // Format birth date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Calculate age from birth date
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Current mood display
  const getCurrentMoodDisplay = () => {
    const currentMood = moodOptions.find(m => m.value === (formData.mood || 'Happy'));
    return currentMood || moodOptions[0];
  };

  if (!userData || Object.keys(userData).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-300 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <p className="text-gray-500 mt-2">Loading Profile...</p>
      </div>
    );
  }
  return  (
    <div className="p-4 max-w-3xl mx-auto mt-20">
      {/* Achievement animation */}
      {showAchievementAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="animate-bounce p-8 rounded-lg bg-white shadow-xl flex flex-col items-center">
            <Award className="h-16 w-16 text-pink-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Achievement Unlocked!</h2>
            <p className="text-gray-600 mt-2">You've added a new achievement to your profile!</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        {/* Profile Header with Banner */}
        <div className="relative h-40 bg-gradient-to-r from-pink-400 to-pink-600">
          {/* Profile Stats Floating Card */}
          <div className="absolute right-4 top-4 bg-white rounded-lg shadow-md p-3 flex space-x-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Tasks</p>
              <p className="text-lg font-bold text-pink-500">{userData.stats?.completedTasks || 0}</p>
            </div>
            <div className="text-center border-l border-r border-gray-200 px-4">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-lg font-bold text-pink-500">{userData.stats?.pendingTasks || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Active Days</p>
              <p className="text-lg font-bold text-pink-500">{userData.stats?.daysActive || 0}</p>
            </div>
          </div>
          
          {/* Mood Badge */}
          <div className="absolute left-4 top-4">
            <div className={`${getCurrentMoodDisplay().color} px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm`}>
              {getCurrentMoodDisplay().icon}
              <span className="text-sm font-medium">{getCurrentMoodDisplay().value}</span>
            </div>
          </div>
        </div>
        
        {/* Profile Image - Positioned for overlap effect */}
        <div className="relative -mt-20 px-6 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">

          <div className="relative">
            <div className={`h-32 w-32 rounded-full border-4 border-white shadow-md overflow-hidden ${imageLoading ? 'animate-pulse bg-pink-100' : ''}`}>
              <img
                src={getImageUrl()}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => {e.target.src = '/default-profile.png'}}
              />
            </div>
            
            {/* Camera Button Overlay */}
            <label htmlFor="profile-image" className="absolute -right-2 bottom-0 bg-pink-500 text-white p-2 rounded-full shadow-lg hover:bg-pink-600 cursor-pointer transform transition-all hover:scale-110">
              <Camera className="h-5 w-5" />
            </label>
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
          
          {/* Name and Basic Details */}
          <div className="ml-4 mb-4 flex-1 flex flex-col justify-end">
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-b-2 border-pink-300 focus:border-pink-500 text-2xl font-bold bg-transparent focus:outline-none px-2 py-1 mb-1"
                placeholder="Your Name"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
            )}
            
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-1 text-pink-500" />
              <span>{userData.email}</span>
            </div>
          </div>
          
          {/* Edit/Save Button */}
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 rounded-full mb-2 shadow transform transition-transform hover:scale-105 ${
              isLoading ? 'bg-gray-300 cursor-not-allowed' : isEditing ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 border border-pink-500'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-gray-200">
         <div className="flex flex-wrap gap-2 sm:space-x-4">

            <button
              onClick={() => setActiveTab('personal')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                activeTab === 'personal' ? 'border-pink-500 text-pink-500' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="h-4 w-4 inline-block mr-1" />
              Personal
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                activeTab === 'address' ? 'border-pink-500 text-pink-500' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin className="h-4 w-4 inline-block mr-1" />
              Address
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                activeTab === 'achievements' ? 'border-pink-500 text-pink-500' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="h-4 w-4 inline-block mr-1" />
              Achievements
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6 animate-fade-in">
              {/* Contact Section */}
              <div className="bg-pink-50/50 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <Mail className="mr-2 h-5 w-5 text-pink-500" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField
                    label="Email"
                    icon={<Mail className="h-4 w-4 text-pink-400" />}
                    value={isEditing ? formData.email : userData.email}
                    isEditing={isEditing}
                    onChange={(value) => setFormData({ ...formData, email: value })}
                    type="email"
                  />
                  <InfoField
                    label="Phone"
                    icon={<Phone className="h-4 w-4 text-pink-400" />}
                    value={isEditing ? formData.phone : userData.phone}
                    isEditing={isEditing}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                    type="tel"
                  />
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="bg-pink-50/50 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <User className="mr-2 h-5 w-5 text-pink-500" />
                  Personal Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField
                    label="Date of Birth"
                    icon={<Calendar className="h-4 w-4 text-pink-400" />}
                    value={isEditing ? formData.dob : formatDate(userData.dob)}
                    displayValue={isEditing ? null : formatDate(userData.dob)}
                    isEditing={isEditing}
                    onChange={(value) => setFormData({ ...formData, dob: value })}
                    type="date"
                  />
                  {!isEditing && userData.dob && (
                    <div className="flex items-center p-2">
                      <span className="font-medium mr-2">Age:</span>
                      <span className="bg-pink-100 text-pink-800 py-1 px-2 rounded-full text-sm">
                        {calculateAge(userData.dob)} years
                      </span>
                    </div>
                  )}
                  <InfoField
                    label="Gender"
                    icon={<User className="h-4 w-4 text-pink-400" />}
                    value={isEditing ? formData.gender : userData.gender}
                    isEditing={isEditing}
                    onChange={(value) => setFormData({ ...formData, gender: value })}
                    options={["Male", "Female", "Other"]}
                  />
                  <InfoField
                    label="Blood Group"
                    icon={<Droplet className="h-4 w-4 text-pink-400" />}
                    value={isEditing ? formData.blood_group : userData.blood_group}
                    isEditing={isEditing}
                    onChange={(value) => setFormData({ ...formData, blood_group: value })}
                    options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]}
                  />
                  {isEditing && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                      <div className="flex flex-wrap gap-2">
                        {moodOptions.map((mood) => (
                          <button
                            key={mood.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, mood: mood.value })}
                            className={`flex items-center space-x-1 p-2 rounded-lg transition-all ${
                              formData.mood === mood.value 
                                ? 'bg-pink-200 border-2 border-pink-400 shadow-sm' 
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {mood.icon}
                            <span className="text-sm">{mood.value}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div className="animate-fade-in">
              <div className="bg-pink-50/50 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <MapPin className="mr-2 h-5 w-5 text-pink-500" />
                  Address Information
                </h2>
                
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      <input
                        type="text"
                        value={formData.address?.street || ''}
                        onChange={(e) => updateAddress('street', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Enter street address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.address?.city || ''}
                        onChange={(e) => updateAddress('city', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.address?.state || ''}
                        onChange={(e) => updateAddress('state', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Enter state/province"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
                      <input
                        type="text"
                        value={formData.address?.zipcode || ''}
                        onChange={(e) => updateAddress('zipcode', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Enter postal/zip code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={formData.address?.country || ''}
                        onChange={(e) => updateAddress('country', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {userData.address && Object.values(userData.address).some(v => v) ? (
                      <div className="bg-white p-4 rounded-lg border border-pink-200 relative overflow-hidden">
                        <MapPin className="absolute right-0 top-0 h-24 w-24 text-pink-100 transform translate-x-6 -translate-y-1" />
                        <p className="text-lg">
                          {userData.address.street ? userData.address.street : ''}
                        </p>
                        <p className="text-gray-700">
                          {userData.address.city ? userData.address.city + ', ' : ''}
                          {userData.address.state ? userData.address.state + ' ' : ''}
                          {userData.address.zipcode || ''}
                        </p>
                        <p className="text-gray-700 font-medium mt-1">
                          {userData.address.country || ''}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-pink-50 rounded-lg border border-dashed border-pink-200">
                        <MapPin className="h-12 w-12 mx-auto text-pink-300 mb-2" />
                        <p className="text-gray-500">No address provided</p>
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setActiveTab('address');
                            }}
                            className="mt-3 text-pink-500 hover:text-pink-600 text-sm font-medium"
                          >
                            + Add Address
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="animate-fade-in">
              <div className="bg-pink-50/50 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <Award className="mr-2 h-5 w-5 text-pink-500" />
                  Achievements
                </h2>
                
                {isEditing ? (
                  <div className="space-y-3">
                    {formData.achievements && formData.achievements.length > 0 ? (
                      formData.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center group animate-fade-in">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...formData.achievements];
                              newAchievements[index] = e.target.value;
                              setFormData({ ...formData, achievements: newAchievements });
                            }}
                            className="border border-gray-300 p-2 rounded-lg w-full focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Enter achievement"
                          />
                          <button
                            onClick={() => {
                              const newAchievements = [...formData.achievements];
                              newAchievements.splice(index, 1);
                              setFormData({ ...formData, achievements: newAchievements });
                            }}
                            className="ml-2 bg-white hover:bg-red-50 text-red-500 border border-red-300 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No achievements yet</p>
                    )}
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          achievements: [...(formData.achievements || []), ''],
                        })
                      }
                      className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center w-full"
                    >
                      <span className="mr-1">+</span> Add Achievement
                    </button>
                  </div>
                ) : (
                  <div>
                    {userData.achievements && userData.achievements.length > 0 ? (
                      <div className="space-y-3">
                        {userData.achievements.map((achievement, index) => (
                          <div 
                            key={index} 
                            className="bg-white p-3 rounded-lg border border-pink-200 flex items-center transform transition-all hover:-translate-y-1 hover:shadow-md"
                          >
                            <Award className="h-5 w-5 text-pink-500 mr-3 flex-shrink-0" />
                            <p>{achievement}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-pink-50 rounded-lg border border-dashed border-pink-200">
                        <Award className="h-12 w-12 mx-auto text-pink-300 mb-2" />
                        <p className="text-gray-500">No achievements yet</p>
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setActiveTab('achievements');
                            }}
                            className="mt-3 text-pink-500 hover:text-pink-600 text-sm font-medium"
                          >
                            + Add Achievement
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Enhanced Field Component with dropdown support
const InfoField = ({ label, value, isEditing, onChange, type = 'text', options }) => {
  return (
    <div className="flex justify-between items-center mb-2 py-1">
      <span className="font-medium">{label}:</span>

      {isEditing ? (
        options ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="border p-1 w-1/2"
          >
            <option value="">Select {label}</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="border p-1 w-1/2"
          />
        )
      ) : (
        <span>{value || '-'}</span>
      )}
    </div>
  );
};

export default MyProfile;