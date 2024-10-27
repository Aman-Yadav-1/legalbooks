"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, onClick }) => (
  <Link href={href}>
    <span
      className="text-black hover:text-green-500 transition-colors duration-300 cursor-pointer block py-2"
      onClick={onClick}
    >
      {label}
    </span>
  </Link>
);

interface ButtonProps {
  label: string;
  primary?: boolean;
  href?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, primary, href, onClick }) => {
  const content = (
    <button
      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
        primary
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-white text-black border border-black hover:text-green-500"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userDetails = localStorage.getItem("user_details");
    if (userDetails) {
      setUser(JSON.parse(userDetails));
    }
  }, []);

  const navLinks = [
    { href: "/lawyers-directory", label: "Lawyers Directory" },
    { href: "/legal-free-consultation", label: "Free Legal Consultation" },
    { href: "/contact", label: "Contact Us" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_details");
    setUser(null);
    
    if (pathname === '/dashboard') {
      router.push('/');
    }
    
    window.dispatchEvent(new Event('userLoggedOut'));
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-bold text-black">
              LegalBooks
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <Button label="Sign up" primary href="/registration" />
            {user ? (
              <div className="relative flex items-center space-x-4">
                <button onClick={toggleProfileDropdown} className="flex items-center space-x-2">
                  <FaUser className="text-gray-600" />
                  <span>{user.name}</span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link href="/dashboard">
                      <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button label="Log in" href="/login" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="flex flex-col space-y-4 py-4">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} onClick={toggleMenu} />
            ))}
            <Button label="Sign up" primary href="/registration" onClick={toggleMenu} />
            {user ? (
              <>
                <Link href="/dashboard">
                  <span className="block py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</span>
                </Link>
                <Button label="Logout" onClick={handleLogout} />
              </>
            ) : (
              <Button label="Log in" href="/login" onClick={toggleMenu} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;