import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [activeTab, setActiveTab] = useState('form');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const mapRef = useRef(null);
  const headerRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-view');
          }
        });
      },
      { threshold: 0.2 }
    );
    
    [formRef, infoRef, mapRef, headerRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });
    
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the form data to your backend
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="relative overflow-hidden pb-20">
      {/* Animated background elements */}
      <div className="absolute -z-10 top-40 left-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -z-10 bottom-40 right-10 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Header Section */}
      <div ref={headerRef} className="opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="text-center pt-16 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-pink-500 to-gray-800 bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our services, 
            pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
        
        {/* Decorative Image */}
        <div className="relative max-w-4xl mx-auto mb-16 overflow-hidden rounded-2xl shadow-xl">
          <img 
            src={assets.contact_image} 
            alt="Medical professionals ready to help" 
            className="w-full h-64 object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">We're Here For You</h2>
              <p className="max-w-md">Our dedicated team is available to assist you with any healthcare needs or questions.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full p-1 bg-pink-50 shadow-md">
            <button 
              onClick={() => setActiveTab('form')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'form' 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'bg-transparent text-gray-600 hover:bg-pink-100'
              }`}
            >
              <MessageSquare className="inline-block mr-2 h-4 w-4" />
              Contact Form
            </button>
            <button 
              onClick={() => setActiveTab('map')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'map' 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'bg-transparent text-gray-600 hover:bg-pink-100'
              }`}
            >
              <MapPin className="inline-block mr-2 h-4 w-4" />
              Find Us
            </button>
          </div>
        </div>
      
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div 
            ref={infoRef}
            className="lg:col-span-1 opacity-0 translate-x-[-30px] transition-all duration-1000 ease-out"
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-200 h-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Sparkles className="text-pink-500 mr-2" />
                Contact Information
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <Phone className="text-pink-500 h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Call Us</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 8am - 6pm</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <Mail className="text-pink-500 h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Email Us</h4>
                    <p className="text-gray-600">contact@healthcare.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <MapPin className="text-pink-500 h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Visit Us</h4>
                    <p className="text-gray-600">123 Health Avenue, Medical District</p>
                    <p className="text-sm text-gray-500">New York, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-100 p-3 rounded-full mr-4">
                    <Clock className="text-pink-500 h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Working Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 8am - 6pm</p>
                    <p className="text-gray-600">Saturday: 9am - 1pm</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group">
                  Schedule an Appointment
                  <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Contact Form or Map based on active tab */}
          <div className="lg:col-span-2">
            {activeTab === 'form' && (
              <div 
                ref={formRef}
                className="bg-white p-8 rounded-2xl shadow-lg border border-pink-200 opacity-0 translate-x-[30px] transition-all duration-1000 ease-out"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                
                {formSubmitted ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg animate-fade-in">
                    <h4 className="text-green-800 font-medium text-lg mb-2">Message Sent Successfully!</h4>
                    <p className="text-green-700">Thank you for contacting us. We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleInputChange}
                        rows="5"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 outline-none"
                        placeholder="Please provide details about your inquiry..."
                        required
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group"
                    >
                      <Send className="mr-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            )}
            
            {activeTab === 'map' && (
              <div 
                ref={mapRef}
                className="bg-white p-8 rounded-2xl shadow-lg border border-pink-200 h-full opacity-0 translate-x-[30px] transition-all duration-1000 ease-out"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Find Our Location</h3>
                
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md h-96 bg-gray-100 relative">
                  {/* This would be your actual map component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Map goes here - integrate with Google Maps or your preferred map service</p>
                  </div>
                  {/* Placeholder map styling */}
                  <div className="absolute inset-0 bg-gray-200 opacity-50">
                    <div className="h-full w-full" style={{ 
                      backgroundImage: `repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 10px, #f1f1f1 10px, #f1f1f1 20px)` 
                    }}></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <MapPin className="h-12 w-12 text-pink-500" />
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-medium text-gray-800 mb-2">Directions</h4>
                  <p className="text-gray-600 mb-4">
                    We're conveniently located in the Medical District, just 5 minutes from downtown and easily accessible by public transportation.
                  </p>
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all duration-300 border border-gray-200 shadow-sm flex items-center justify-center">
                      <span>Parking Info</span>
                    </button>
                    <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-sm flex items-center justify-center">
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "What insurance plans do you accept?",
              a: "We accept most major insurance plans. Please contact our office to verify your specific coverage."
            },
            {
              q: "How do I schedule an appointment?",
              a: "You can schedule an appointment by calling our office, using our online portal, or filling out the contact form on this page."
            },
            {
              q: "What should I bring to my first appointment?",
              a: "Please bring your insurance card, ID, medical history, and a list of current medications."
            },
            {
              q: "Do you offer telehealth services?",
              a: "Yes, we provide secure video consultations for eligible patients. Contact us to learn more."
            }
          ].map((faq, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md border border-pink-100 hover:border-pink-300 transition-all duration-300 transform hover:-translate-y-1"
            >
              <h4 className="font-bold text-gray-800 mb-2">{faq.q}</h4>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .fade-in-view {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }s
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Contact;