import React, { useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { Heart, Award, UserCheck, Clock } from 'lucide-react';

const About = () => {
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) observer.observe(imageRef.current);
    if (textRef.current) observer.observe(textRef.current);

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-24 overflow-hidden px-4">
      {/* Title */}
      <div className="relative text-center mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-pink-500 to-gray-900 bg-clip-text text-transparent animate-pulse">
          About <span className="text-pink-500">Us</span>
        </h2>
        <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-400/20 rounded-full blur-xl"></div>
      </div>

      {/* Image + Text */}
      <div className="my-10 flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
        <div
          ref={imageRef}
          className="w-full max-w-xs sm:max-w-sm md:max-w-[460px] mx-auto md:mx-0 opacity-0 translate-x-[-50px] transition-all duration-1000 ease-out"
          style={{ animationDelay: '0.2s' }}
        >
          <img
            className="w-full rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-500 border-4 border-pink-200"
            src={assets.about_image}
            alt="Medical professionals"
          />
        </div>

        <div
          ref={textRef}
          className="flex flex-col justify-center md:w-2/4 opacity-0 translate-x-[50px] transition-all duration-1000 ease-out space-y-6"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="bg-pink-50/50 p-6 rounded-lg border-l-4 border-pink-400 shadow-md">
            <p className="text-gray-700 leading-relaxed">
              We are a team of compassionate healthcare professionals dedicated to providing exceptional care that enhances the quality of life for our patients. Our integrated approach combines medical expertise with genuine human connection.
            </p>
          </div>

          <div className="bg-pink-50/50 p-6 rounded-lg border-l-4 border-pink-400 shadow-md">
            <p className="text-gray-700 leading-relaxed">
              Our mission is to revolutionize healthcare delivery through innovation and personalization, making quality care accessible to everyone while maintaining the highest standards of medical excellence.
            </p>
          </div>

          <div className="bg-pink-50/50 p-6 rounded-lg border-l-4 border-pink-400 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center md:justify-start">
              <Heart className="text-pink-500 mr-2" size={20} />
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To be recognized as the premier healthcare provider, known for our commitment to clinical excellence, patient-centered care, and continuous innovation in medical practices and technology.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold relative inline-block">
            WHY <span className="text-pink-500">CHOOSE US</span>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 items-center">
          {[
            {
              icon: <Clock size={36} />,
              title: 'Efficiency',
              text: 'Our streamlined processes ensure minimal wait times and maximum care quality, respecting your time while delivering exceptional healthcare services.',
            },
            {
              icon: <Award size={36} />,
              title: 'Excellence',
              text: 'We uphold the highest standards in healthcare, combining cutting-edge technology with compassionate care to exceed expectations in treatment outcomes.',
            },
            {
              icon: <UserCheck size={36} />,
              title: 'Personalization',
              text: 'Every treatment plan is tailored to your unique needs, ensuring that you receive care that’s specifically designed for your health journey.',
            },
          ].map((card, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group border border-pink-200 rounded-lg p-8 flex flex-col gap-5 hover:bg-pink-400 hover:text-white transition-all text-gray-600 duration-500 cursor-pointer opacity-0 translate-y-[30px] text-center md:text-left"
              style={{ animationDelay: `${0.2 * (index + 1)}s` }}
            >
              <div className="text-pink-500 group-hover:text-white transition-colors duration-300 mb-2 mx-auto md:mx-0">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">
                {card.title}
              </h3>
              <p className="group-hover:text-white transition-colors duration-300">
                {card.text}
              </p>
              <div className="w-0 group-hover:w-full h-1 bg-white transition-all duration-500 mt-auto"></div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
        }
      `}</style>
    </div>
  );
};

export default About;
