import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useSpring } from 'framer-motion';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const bannerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const springX = useSpring(0, { stiffness: 300, damping: 30 });
  const springY = useSpring(0, { stiffness: 300, damping: 30 });
  const controls = useAnimation();
  const navigate = useNavigate();

  // Gradient animation for the banner background
  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        background: [
          'linear-gradient(45deg, #ff69b4, #9370db)',
          'linear-gradient(225deg, #ff1493, #8a2be2)',
          'linear-gradient(45deg, #ff69b4, #9370db)'
        ],
        transition: { duration: 5, repeat: Infinity }
      });
    }, 0);
    return () => clearInterval(interval);
  }, []);

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (bannerRef.current) {
        const rect = bannerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        springX.set(x);
        springY.set(y);
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle effect for hover animation
  const ParticleEffect = () => {
    return Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          x: [0, (i % 2 ? 100 : -100) * Math.random()],
          y: [0, -100 * Math.random()],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ));
  };

  return (
    <motion.div
      ref={bannerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='relative my-20 md:mx-10 min-h-[600px] cursor-none'
    >
      <motion.div
        animate={controls}
        className='relative overflow-hidden rounded-3xl shadow-2xl backdrop-blur-3xl'
      >
        {/* Custom Cursor */}
        <motion.div
          className="w-8 h-8 border-2 border-white rounded-full fixed pointer-events-none z-50 mix-blend-difference"
          animate={{
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: isHovered ? 1.5 : 1
          }}
          transition={{ type: "spring", mass: 0.1 }}
        />

        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-40 h-40 border border-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <motion.div className='relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 min-h-[600px]'>
          <motion.div className='relative z-10 space-y-8 flex flex-col justify-center'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='space-y-6'
            >
              <div className='relative'>
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px #ff69b4',
                      '0 0 40px #9370db',
                      '0 0 20px #ff69b4'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className='absolute -left-4 top-0 w-1 h-20 bg-gradient-to-b from-pink-400 to-purple-400'
                />
                <h2 className='text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 leading-tight'>
                  Book Your
                  <br />
                  <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300'>
                    Appointment
                  </span>
                </h2>
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className='text-2xl text-white/90 font-light tracking-wide'
              >
                100+ Elite Medical Experts
              </motion.p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className='relative group w-fit'
            >
              <motion.div
                className='absolute inset-0 rounded-full opacity-70 group-hover:opacity-100 blur-xl'
                animate={{
                  background: [
                    'linear-gradient(45deg, #ff69b4, #9370db)',
                    'linear-gradient(225deg, #ff1493, #8a2be2)',
                    'linear-gradient(45deg, #ff69b4, #9370db)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                className='relative block px-10 py-5 bg-white/10 backdrop-blur-md rounded-full text-white font-semibold text-lg border border-white/20 shadow-xl transform transition-all duration-300'
              >
                Create Account
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className='inline-block ml-2'
                >
                  →
                </motion.span>
              </span>
              <ParticleEffect />
            </motion.button>
          </motion.div>

          <motion.div
            className='relative hidden md:flex items-center justify-center'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className='relative z-10'
            >
              <motion.img
                className='w-full max-w-lg mx-auto drop-shadow-2xl'
                src={assets.appointment_img}
                alt="Doctor"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))'
                }}
              />
              
              <motion.div
                className='absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl'
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Interactive Background Effect */}
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 mix-blend-overlay'
          style={{
            backgroundPosition: springX.get() * 100 + "% " + springY.get() * 100 + "%"
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Banner;