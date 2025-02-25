import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { assets } from '../assets/assets'
const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 transition-transform hover:scale-105">
            <img onClick={() => navigate('/')} className="w-44" src={assets.logo3} alt="logo" /> 
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/"
              className={({ isActive }) => `
                relative py-2 text-sm font-medium transition-colors
                ${isActive ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}
                after:absolute after:left-0 after:bottom-0 after:h-0.5 
                after:w-full after:origin-left after:scale-x-0 
                after:bg-pink-500 after:transition-transform
                hover:after:scale-x-100
              `}
            >
              Home
            </NavLink>
            <NavLink 
              to="/doctors"
              className={({ isActive }) => `
                relative py-2 text-sm font-medium transition-colors
                ${isActive ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}
                after:absolute after:left-0 after:bottom-0 after:h-0.5 
                after:w-full after:origin-left after:scale-x-0 
                after:bg-pink-500 after:transition-transform
                hover:after:scale-x-100
              `}
            >
              All Doctors
            </NavLink>
            <NavLink 
              to="/contact"
              className={({ isActive }) => `
                relative py-2 text-sm font-medium transition-colors
                ${isActive ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}
                after:absolute after:left-0 after:bottom-0 after:h-0.5 
                after:w-full after:origin-left after:scale-x-0 
                after:bg-pink-500 after:transition-transform
                hover:after:scale-x-100
              `}
            >
              Contact
            </NavLink>
            <NavLink 
              to="/about"
              className={({ isActive }) => `
                relative py-2 text-sm font-medium transition-colors
                ${isActive ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}
                after:absolute after:left-0 after:bottom-0 after:h-0.5 
                after:w-full after:origin-left after:scale-x-0 
                after:bg-pink-500 after:transition-transform
                hover:after:scale-x-100
              `}
            >
              About
            </NavLink>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <img 
                    className="w-8 h-8 rounded-full ring-2 ring-pink-500 ring-offset-2 transition-all group-hover:ring-offset-4" 
                    src={assets.profile_pic} 
                    alt="user" 
                  />
                  <ChevronDown className="w-4 h-4 text-gray-600 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-lg shadow-lg opacity-0 scale-95 transition-all duration-200 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
                  <div className="py-2">
                    <button 
                      onClick={() => navigate('/profile')}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors text-left"
                    >
                      My Profile
                    </button>
                    <button 
                      onClick={() => navigate('/my-appointments')}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors text-left"
                    >
                      My Appointments
                    </button>
                    <button 
                      onClick={() => setToken(false)}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-pink-500 text-white px-6 py-2 rounded-full font-medium 
                          transition-all duration-300 ease-out hover:bg-pink-600 
                          hover:shadow-lg hover:shadow-pink-500/30 
                          active:scale-95"
              >
                Create Account
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-pink-500 hover:bg-pink-50 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`
        md:hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive ? 'bg-pink-50 text-pink-500' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive ? 'bg-pink-50 text-pink-500' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
              }`
            }
          >
            All Doctors
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive ? 'bg-pink-50 text-pink-500' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
              }`
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive ? 'bg-pink-50 text-pink-500' : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
              }`
            }
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;