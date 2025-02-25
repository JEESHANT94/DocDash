import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { motion, useAnimation, useTransform, useMotionValue } from 'framer-motion'

function Header() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const headerRef = useRef(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const rotateX = useTransform(mouseY, [-300, 300], [5, -5])
    const rotateY = useTransform(mouseX, [-300, 300], [-5, 5])

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (headerRef.current) {
                const rect = headerRef.current.getBoundingClientRect()
                const x = e.clientX - rect.left - rect.width / 2
                const y = e.clientY - rect.top - rect.height / 2
                mouseX.set(x)
                mouseY.set(y)
                setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
            }
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{ opacity: 0, y: 0, x: Math.random() * 100 + '%' }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: [-20, -120],
                        x: `${Math.random() * 100}%`
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                />
            ))}
        </div>
    )

    return (
        <motion.div 
            ref={headerRef}
            style={{ perspective: 2000 }}
            className="relative mx-4 my-18"
        >
            <motion.div
                style={{ rotateX, rotateY }}
                className="bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl border border-white/10"
            >
                <FloatingParticles />
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.1)_0%,transparent_50%)]"
                    style={{
                        '--mouse-x': `${mousePosition.x}px`,
                        '--mouse-y': `${mousePosition.y}px`
                    }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center gap-8"
                    >
                        <div className="space-y-4">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '40%' }}
                                className="h-1 bg-gradient-to-r from-white to-transparent"
                            />
                            <motion.h1 
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Book Appointment
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="block text-pink-100 mt-2"
                                >
                                    With Trusted Doctors
                                </motion.span>
                            </motion.h1>
                        </div>

                        <motion.div 
                            className="flex flex-col md:flex-row items-center gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <motion.div 
                                className="relative group"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50" />
                                <img 
                                    className="relative w-32 rounded-2xl" 
                                    src={assets.group_profiles} 
                                    alt="Doctor profiles" 
                                />
                                <motion.div 
                                    className="absolute -top-2 -right-2 bg-green-400 px-3 py-1 rounded-full text-xs font-medium"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Online
                                </motion.div>
                            </motion.div>
                            <p className="text-pink-50 text-lg font-light text-center md:text-left leading-relaxed">
                                Simply browse through the list of doctors and
                                <br className="hidden sm:block" />
                                book an appointment with the one you like.
                            </p>
                        </motion.div>

                        <motion.button 
                            className="group relative w-fit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-pink-200/80 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full text-pink-600 font-semibold shadow-xl">
                                Book Now
                                <motion.img 
                                    className="w-4"
                                    src={assets.arrow_icon}
                                    alt="Arrow"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>
                        </motion.button>
                    </motion.div>

                    <motion.div 
                        className="relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            animate={{
                                y: [-10, 10, -10],
                                rotate: [-1, 1, -1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative z-10"
                        >
                            <img 
                                className="w-full rounded-2xl shadow-2xl"
                                src={assets.header_img2}
                                alt="Doctor consultation"
                            />
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent rounded-2xl"
                                animate={{
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                        
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-2xl blur-3xl -z-10" />
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Header