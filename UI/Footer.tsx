"use client" 

import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa"
import Link from "next/link"

const data = [
  [
    { text: "About Us", link: "/" },
    { text: "Reviews", link: "/reviews" },
    { text: "Pricing", link: "/pricing" },
  ],
  [
    { text: "Help Docs", link: "/help" },
    { text: "Contact Us", link: "/contact" },
  ],
  [
    { text: "Document Generation", link: "/dashboard" },
    { text: "Free Legal Consultation", link: "/legal-free-consultation" },
    { text: "Lawyers Directory", link: "/lawyers-directory" },
    // { text: "Legal Forum", link: "/legal-forum" },
  ],
]

export default function FooterClient() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Section 1 */}
          <div>
            <h4 className="font-bold text-xl mb-4">LegalBooks</h4>
            <ul className="space-y-3">
              {data[0].map((item, idx) => (
                <li key={idx}>
                  <div 
                    className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out"
                    onClick={() => window.location.href = item.link}
                  >
                    {item.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Section 2 */}
          <div>
            <h4 className="font-bold text-xl mb-4">Resources</h4>
            <ul className="space-y-3">
              {data[1].map((item, idx) => (
                <li key={idx}>
                  <div 
                    className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out"
                    onClick={() => window.location.href = item.link}
                  >
                    {item.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Section 3 */}
          <div>
            <h4 className="font-bold text-xl mb-4">Features</h4>
            <ul className="space-y-3">
              {data[2].map((item, idx) => (
                <li key={idx}>
                  <div 
                    className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out"
                    onClick={() => window.location.href = item.link}
                  >
                    {item.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Section 4 */}
          <div>
            <h4 className="font-bold text-xl mb-4">Coming Soon</h4>
            <ul className="space-y-3">
              <li>
                <div 
                  className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out"
                >
                  Case Management System
                </div>
              </li>
              <li>
                <div 
                  className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out"
                >
                  Legal AI Research
                </div>
              </li>
            </ul>
          </div>
          {/* Section 5 */}
          <div>
            <h4 className="font-bold text-xl mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <div 
                  className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out"
                  onClick={() => window.location.href = "tel:+91923415xxxx"}
                >
                  +91 9440142156
                </div>
              </li>
              <li>
                <div 
                  className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out"
                  onClick={() => window.location.href = "mailto:support@legalbooks.in"}
                >
                  support@legal-books.vercel.app
                </div>
              </li>
              <li>
                <address className="text-gray-300 justify-evenly hover:text-white text-sm not-italic leading-relaxed">
                  Plot No 1- Sheshachalam Colony,
                  West Marredpally, Hyderabad,
                  Telangana - 500026
                </address>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center space-x-5">
          <Link href="/policies/privacy-policy">
            <span className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out">
              Privacy Policy
            </span>
          </Link>
          <Link href="/policies/refunds-and-cancellations">
            <span className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out">
              Refund Policy
            </span>
          </Link>
          <Link href="/policies/terms-and-conditions">
            <span className="cursor-pointer text-gray-300 hover:text-white text-sm transition duration-300 ease-in-out">
              Terms & Conditions
            </span>
          </Link>
        </div>
        
        <div className="mt-5 flex justify-center space-x-6">
          <div 
            className="cursor-pointer text-gray-300 hover:text-white transition duration-300 ease-in-out"
            onClick={() => window.location.href = "#"}
          >
            <FaTwitter size={20} />
          </div>
          <div 
            className="cursor-pointer text-gray-300 hover:text-white transition duration-300 ease-in-out"
            onClick={() => window.location.href = "#"}
          >
            <FaInstagram size={20} />
          </div>
          <div 
            className="cursor-pointer text-gray-300 hover:text-white transition duration-300 ease-in-out"
            onClick={() => window.location.href = "#"}
          >
            <FaFacebookF size={20} />
          </div>
          <div 
            className="cursor-pointer text-gray-300 hover:text-white transition duration-300 ease-in-out"
            onClick={() => window.location.href = "#"}
          >
            <FaLinkedinIn size={20} />
          </div>
        </div>
        <div className="mt-5 mb-[-1%] text-center text-gray-400 text-sm">
          &copy; 2024 Infrawide Projects Private Limited. All rights reserved.
        </div>
      </div>
    </footer>
  )
}