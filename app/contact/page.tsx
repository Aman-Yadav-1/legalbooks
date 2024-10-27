'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { HiPhone, HiBuildingOffice } from "react-icons/hi2";
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';

const ContactPage: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <h1 className="text-4xl font-bold text-green-600 mb-8 text-center">
          Get in Touch
        </h1>
        <div className="bg-white border-2 border-green-500 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-green-700">Contact Us</h2>
            <p className="mb-8 text-gray-600 leading-relaxed">
              We're here to help and answer any question you might have. Our team is always ready to assist you with any inquiries or concerns. We look forward to hearing from you!
            </p>
            <div className="space-y-6">
              <ContactItem 
                icon={<HiPhone className="w-8 h-8" />}
                text="+91 9440142156"
                href="tel:+919440142156"
                onHover={() => setHoveredItem('phone')}
                isHovered={hoveredItem === 'phone'}
              />
              <ContactItem 
                icon={<HiMail className="w-8 h-8" />}
                text="support@legalbooks.in"
                href="mailto:support@legalbooks.in"
                onHover={() => setHoveredItem('email')}
                isHovered={hoveredItem === 'email'}
              />
              <ContactItem 
                icon={<HiBuildingOffice className="w-8 h-8" />}
                text="Plot No 1- Sheshachalam Colony, West Marredpally, Hyderabad, Telangana - 500026"
                onHover={() => setHoveredItem('address')}
                isHovered={hoveredItem === 'address'}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ContactItem: React.FC<{ 
  icon: React.ReactNode; 
  text: string; 
  href?: string;
  onHover: () => void;
  isHovered: boolean;
}> = ({ icon, text, href, onHover, isHovered }) => {
  const content = (
    <motion.div 
      className={`flex items-start space-x-4 p-4 rounded-xl transition duration-300 ${
        isHovered ? 'bg-green-100 shadow-md' : 'bg-white'
      }`}
      whileHover={{ scale: 1.05 }}
      onHoverStart={onHover}
      onHoverEnd={() => onHover()}
    >
      <div className={`flex-shrink-0 ${isHovered ? 'text-green-600' : 'text-green-500'}`}>{icon}</div>
      <span className={`text-lg ${isHovered ? 'text-green-800' : 'text-gray-700'}`}>{text}</span>
    </motion.div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
};

export default ContactPage;