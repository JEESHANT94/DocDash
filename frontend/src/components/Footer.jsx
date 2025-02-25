import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart, Linkedin, Github, Globe, ArrowUp } from 'lucide-react';

const Footer = () => {
  const socialIcons = [
    { icon: <Facebook size={18} />, delay: 0, href: "#" },
    { icon: <Twitter size={18} />, delay: 0.1, href: "#" },
    { icon: <Instagram size={18} />, delay: 0.2, href: "#" },
    { icon: <Youtube size={18} />, delay: 0.3, href: "#" },
    { icon: <Linkedin size={18} />, delay: 0.4, href: "#" },
    { icon: <Github size={18} />, delay: 0.5, href: "#" },
  ];

  const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Portfolio', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 bg-gradient-to-b from-pink-50 via-pink-100 to-pink-200">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-pink-300 opacity-10"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              x: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              width: Math.random() * 150 + 50,
              height: Math.random() * 150 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Wave SVG */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-full">
        <svg className="relative block w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                className="fill-pink-100"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent mb-3"
            >
              DocDash
            </motion.div>
            <motion.p 
              variants={floatingAnimation}
              animate="animate"
              className="text-gray-600 text-sm leading-relaxed mb-4"
            >
              Elevating healthcare through innovative solutions and compassionate care. 
              Your well-being is our priority.
            </motion.p>
            
            {/* Social Icons */}
            <div className="flex flex-wrap gap-2">
              {socialIcons.map((item, index) => (
                <motion.a
                  href={item.href}
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' 
                  }}
                  className="p-2 bg-white rounded-full shadow-md cursor-pointer text-pink-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300"
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-pink-600 mb-3">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 10, color: '#EC4899' }}
                  className="text-sm text-gray-600 hover:text-pink-500 cursor-pointer transition-colors duration-300"
                >
                  <a href={link.href} className="flex items-center gap-2">
                    <Globe size={14} />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-pink-600 mb-3">Get in Touch</h3>
            <ul className="space-y-2">
              {[
                { icon: <Phone size={16} />, text: '+1 234 567 890' },
                { icon: <Mail size={16} />, text: 'Lifeline@gmail.com' },
                { icon: <MapPin size={16} />, text: '123 Healthcare Ave, Medical City' }
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-2 text-sm text-gray-600 group"
                >
                  <span className="text-pink-500 group-hover:text-pink-600 transition-colors">
                    {item.icon}
                  </span>
                  <span className="group-hover:text-pink-500 transition-colors">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 p-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors duration-300"
        >
          <ArrowUp size={20} />
        </motion.button>

        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 pt-4 border-t border-pink-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-600 text-xs">
              © 2025 All Rights Reserved by Lifeline
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 text-xs text-gray-600"
            >
              Made with{' '}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                }}
              >
                <Heart size={14} className="text-pink-500" />
              </motion.div>
              {' '}by Lifeline Team
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;


{/*bit simpl eone */}
// import React from 'react';
// import { motion } from 'framer-motion';
// import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, ExternalLink } from 'lucide-react';

// const Footer = () => {
//   const socialIcons = [
//     { icon: <Facebook size={18} />, delay: 0, href: "#", color: "hover:bg-blue-500" },
//     { icon: <Twitter size={18} />, delay: 0.1, href: "#", color: "hover:bg-sky-500" },
//     { icon: <Instagram size={18} />, delay: 0.2, href: "#", color: "hover:bg-pink-500" },
//     { icon: <Linkedin size={18} />, delay: 0.3, href: "#", color: "hover:bg-blue-600" },
//   ];

//   const links = [
//     { name: 'Services', href: '#' },
//     { name: 'About Us', href: '#' },
//     { name: 'Contact', href: '#' },
//     { name: 'Careers', href: '#' },
//   ];

//   return (
//     <footer className="relative bg-gradient-to-b from-white to-pink-50">
//       {/* Animated Background Dots */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(3)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-2 h-2 rounded-full bg-pink-300 opacity-20"
//             animate={{
//               x: [0, 100, 0],
//               y: [0, -100, 0],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               delay: i * 2,
//               ease: "linear"
//             }}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row justify-between items-start gap-8">
//           {/* Brand Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="flex-1 max-w-sm"
//           >
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent mb-3"
//             >
//               Lifeline
//             </motion.div>
//             <p className="text-sm text-gray-600 leading-relaxed mb-4">
//               Pioneering healthcare excellence with innovative solutions and compassionate care.
//             </p>
//             <div className="flex gap-2">
//               {socialIcons.map((item, index) => (
//                 <motion.a
//                   href={item.href}
//                   key={index}
//                   initial={{ opacity: 0, scale: 0 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: item.delay, duration: 0.3 }}
//                   whileHover={{ y: -3, scale: 1.1 }}
//                   className={`p-2 rounded-full bg-white shadow-sm text-gray-600 ${item.color} hover:text-white transition-all duration-300`}
//                 >
//                   {item.icon}
//                 </motion.a>
//               ))}
//             </div>
//           </motion.div>

//           {/* Quick Links */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="flex-1"
//           >
//             <h3 className="text-sm font-semibold text-pink-600 mb-3">Quick Links</h3>
//             <ul className="space-y-2">
//               {links.map((link, index) => (
//                 <motion.li key={index} whileHover={{ x: 3 }}>
//                   <a 
//                     href={link.href}
//                     className="text-sm text-gray-600 hover:text-pink-500 flex items-center gap-1 transition-colors duration-300"
//                   >
//                     <ExternalLink size={12} />
//                     {link.name}
//                   </a>
//                 </motion.li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* Contact Info */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="flex-1"
//           >
//             <h3 className="text-sm font-semibold text-pink-600 mb-3">Contact</h3>
//             <ul className="space-y-2">
//               <motion.li whileHover={{ x: 3 }} className="flex items-center gap-2 text-sm text-gray-600">
//                 <Phone size={14} className="text-pink-500" />
//                 <span>+1 234 567 890</span>
//               </motion.li>
//               <motion.li whileHover={{ x: 3 }} className="flex items-center gap-2 text-sm text-gray-600">
//                 <Mail size={14} className="text-pink-500" />
//                 <span>contact@lifeline.com</span>
//               </motion.li>
//               <motion.li whileHover={{ x: 3 }} className="flex items-center gap-2 text-sm text-gray-600">
//                 <MapPin size={14} className="text-pink-500" />
//                 <span>123 Healthcare Ave</span>
//               </motion.li>
//             </ul>
//           </motion.div>
//         </div>

//         {/* Copyright */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="mt-8 pt-4 border-t border-pink-100"
//         >
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
//             <p>© 2025 Lifeline. All rights reserved.</p>
//             <motion.div
//               className="flex items-center gap-1"
//               whileHover={{ scale: 1.02 }}
//             >
//               Made with 
//               <motion.div
//                 animate={{ scale: [1, 1.2, 1] }}
//                 transition={{ duration: 1, repeat: Infinity }}
//               >
//                 <Heart size={12} className="text-pink-500 fill-pink-500" />
//               </motion.div>
//               by Lifeline Team
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;