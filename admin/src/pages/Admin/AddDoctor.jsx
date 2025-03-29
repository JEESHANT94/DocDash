import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, User, Mail, Lock, Award, DollarSign, Stethoscope, GraduationCap, MapPin, FileText } from 'lucide-react';

const AddDoctor = () => {
    
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('');
    const [fees, setFees] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [education, setEducation] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [about, setAbout] = useState('');
    const [loading, setLoading] = useState(false);
    const [formStep, setFormStep] = useState(1); // For multi-step form
    const [imgHover, setImgHover] = useState(false);
 
    const { backendUrl, aToken } = useContext(AdminContext);

    useEffect(() => {
       
            window.scrollTo({ top: 0, behavior: 'smooth' });
         
        
      }, []);
      
    // Track form completion percentage
    const calculateProgress = () => {
        const totalSteps = 3;
        return (formStep / totalSteps) * 100;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (!docImg) {
                toast.error('Please upload doctor image');
                return;
            }

            setLoading(true);
            
            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('speciality', speciality);
            formData.append('degree', education);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
            formData.append('about', about);
          
            const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
                headers: { Authorization: `Bearer ${aToken}` }
            });

            if (data.success) {
                setLoading(false);
                
                // Success animation
                toast.success(data.message, {
                    position: "top-center",
                    autoClose: 2000
                });
                
                // Reset form
                setName('');
                setEmail('');
                setPassword('');
                setExperience('');
                setFees('');
                setSpeciality('');
                setEducation('');
                setAddress1('');
                setAddress2('');
                setAbout('');
                setDocImg(false);
                setFormStep(1);
            }
            else {
                setLoading(false);
                toast.error(data.message);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error submitting form", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleNextStep = () => {
        if (formStep === 1 && (!name || !email || !password)) {
            toast.warning("Please fill all required fields");
            return;
        }
        if (formStep === 2 && (!experience || !fees || !speciality || !education)) {
            toast.warning("Please fill all required fields");
            return;
        }
        if (formStep < 3) setFormStep(formStep + 1);
    };

    const handlePrevStep = () => {
        if (formStep > 1) setFormStep(formStep - 1);
    };

    // Speciality options with icons
    const specialities = [
        { name: 'General physician', icon: '👨‍⚕️' },
        { name: 'Gynecologist', icon: '👩‍⚕️' },
        { name: 'Dermatologist', icon: '🧴' },
        { name: 'Pediatricians', icon: '👶' },
        { name: 'Neurologist', icon: '🧠' },
        { name: 'Gastroenterologist', icon: '🏥' }
    ];
  
    const formVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };
 
    return (
        <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen  p-4 md:p-6 w-full"
    >
            <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-6 md:p-8 mx-auto"
    >
                {/* Header with progress bar */}
                <div className="mb-8 relative">
                    <h2 className="text-3xl font-bold text-center text-pink-700 mb-6 flex items-center justify-center">
                        <motion.div
                            initial={{ rotate: -180 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-pink-100 p-2 rounded-full mr-3 text-pink-600"
                        >
                            <Stethoscope size={24} />
                        </motion.div>
                        Add New Doctor
                    </h2>
                    
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-pink-100 rounded-full">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${calculateProgress()}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full"
                        />
                    </div>
                    
                    {/* Step indicators */}
                    <div className="flex justify-between mt-2 text-sm">
                        <div className={`flex flex-col items-center ${formStep >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${formStep >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>1</div>
                            <span>Basic Info</span>
                        </div>
                        <div className={`flex flex-col items-center ${formStep >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${formStep >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>2</div>
                            <span>Professional</span>
                        </div>
                        <div className={`flex flex-col items-center ${formStep >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${formStep >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>3</div>
                            <span>Details</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-6">
                    {/* Step 1: Basic Information */}
                    {formStep === 1 && (
                        <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {/* Upload Image Section */}
                            <div className="flex flex-col items-center mb-8">
                                <motion.label 
                                    htmlFor="doc-img" 
                                    className="cursor-pointer relative"
                                    whileHover={{ scale: 1.05 }}
                                    onHoverStart={() => setImgHover(true)}
                                    onHoverEnd={() => setImgHover(false)}
                                >
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-300 shadow-lg relative">
                                        {docImg ? (
                                            <img src={URL.createObjectURL(docImg)} alt="Doctor" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-pink-50 flex flex-col items-center justify-center">
                                                <Upload size={28} className="text-pink-400" />
                                                <span className="text-xs mt-1 text-pink-400">Upload</span>
                                            </div>
                                        )}
                                        {imgHover && (
                                            <div className="absolute inset-0 bg-pink-500 bg-opacity-60 flex items-center justify-center">
                                                <Upload size={28} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                </motion.label>
                                <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id='doc-img' className="hidden" accept="image/*" />
                                <p className="text-pink-600 mt-3 text-sm">Upload doctor profile picture</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="block text-pink-600 font-semibold mb-2">Doctor Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                                        <input 
                                            onChange={(e) => setName(e.target.value)} 
                                            value={name} 
                                            type="text" 
                                            placeholder='Full Name' 
                                            required 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-pink-600 font-semibold mb-2">Doctor Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                                        <input 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            value={email} 
                                            type="email" 
                                            placeholder='Email Address' 
                                            required 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300" 
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-pink-600 font-semibold mb-2">Password</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                                        <input 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            value={password} 
                                            type="password" 
                                            placeholder='Secure Password' 
                                            required 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Professional Information */}
                    {formStep === 2 && (
                        <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-pink-600 font-semibold mb-2">Experience</label>
                                    <div className="relative">
                                        <Award size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                                        <select 
                                            onChange={(e) => setExperience(e.target.value)} 
                                            value={experience} 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300 appearance-none"
                                        >
                                            <option value="">Select Experience</option>
                                            {[...Array(8).keys()].map(year => (
                                                <option key={year} value={`${year + 1} ${year === 0 ? 'year' : 'years'}`}>
                                                    {year + 1} {year === 0 ? 'year' : 'years'}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-pink-600 font-semibold mb-2">Consultation Fees</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                                        <input 
                                            onChange={(e) => setFees(e.target.value)} 
                                            value={fees} 
                                            type="number" 
                                            placeholder='Amount' 
                                            required 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-pink-600 font-semibold mb-2">Speciality</label>
                                    <div className="relative">
                                        <Stethoscope size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                                        <select 
                                            onChange={(e) => setSpeciality(e.target.value)} 
                                            value={speciality} 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300 appearance-none"
                                        >
                                            <option value="">Select Speciality</option>
                                            {specialities.map(spec => (
                                                <option key={spec.name} value={spec.name}>
                                                    {spec.icon} {spec.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-pink-600 font-semibold mb-2">Education</label>
                                    <div className="relative">
                                        <GraduationCap size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                                        <input 
                                            onChange={(e) => setEducation(e.target.value)} 
                                            value={education} 
                                            type="text" 
                                            placeholder='Degree, University' 
                                            required 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Additional Details */}
                    {formStep === 3 && (
                        <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-pink-600 font-semibold mb-2">Address Line 1</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                                        <input 
                                            onChange={(e) => setAddress1(e.target.value)} 
                                            value={address1} 
                                            type="text" 
                                            placeholder='Street Address' 
                                            required 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-pink-600 font-semibold mb-2">Address Line 2</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                                        <input 
                                            onChange={(e) => setAddress2(e.target.value)} 
                                            value={address2} 
                                            type="text" 
                                            placeholder='City, State, Zip Code' 
                                            required 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300" 
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-pink-600 font-semibold mb-2">About Doctor</label>
                                    <div className="relative">
                                        <FileText size={18} className="absolute left-3 top-4 text-pink-400" />
                                        <textarea 
                                            onChange={(e) => setAbout(e.target.value)} 
                                            value={about} 
                                            placeholder='Professional background, specializations, achievements...' 
                                            rows={5} 
                                            required 
                                            className="w-full p-3 pl-10 border rounded-md border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                        {formStep > 1 ? (
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button" 
                                onClick={handlePrevStep}
                                className="bg-gray-100 text-pink-600 border border-pink-300 py-2.5 px-8 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                                Back
                            </motion.button>
                        ) : (
                            <div></div>
                        )}
                        
                        {formStep < 3 ? (
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button" 
                                onClick={handleNextStep}
                                className="bg-pink-600 text-white py-2.5 px-8 rounded-lg hover:bg-pink-700 transition flex items-center gap-2"
                            >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </motion.button>
                        ) : (
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                type="submit" 
                                className="bg-gradient-to-r from-pink-500 to-pink-700 text-white py-3 px-10 rounded-lg hover:from-pink-600 hover:to-pink-800 transition flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Add Doctor
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddDoctor;