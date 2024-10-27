"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowDropDown } from "react-icons/md";

interface Role {
  name: string;
}

interface UserData {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export function RegistrationOptions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch roles
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://api.legalbooks.in/api/v1/roles');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError("Failed to load roles. Please try again later.");
      }
    };

    // Retrieve user data from localStorage
    const storedUserData = localStorage.getItem('tempUserData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    fetchRoles();
  }, []);

  const handleRegister = () => {
    if (selectedRole) {
      // Store userData in localStorage
      if (userData) {
        localStorage.setItem('registrationUserData', JSON.stringify(userData));
      }
      
      // Use router.push with the selectedRole
      router.push(`registration/${selectedRole}`);
      
      // Clear the temporary stored data
      localStorage.removeItem('tempUserData');
    } else {
      setError("Please select an option");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">LegalBooks</h1>
        <p className="text-center text-gray-500 mb-6">India's Largest Legal Platform</p>
        <div className="p-8 rounded-lg bg-gray-50 shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register as</h2>
          <div className="mb-4 relative">
            <select
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 p-3 text-gray-700 hover:border-green-500 transition duration-200 ease-in-out appearance-none"
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setError("");
              }}
              defaultValue=""
            >
              <option value="" disabled>Select your role</option>
              {roles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <MdArrowDropDown className="text-gray-700" />
            </div>
          </div>
          {error && (
            <p className="text-red-600 text-sm text-center mb-4">{error}</p>
          )}
          <div className="text-center">
            <button
              id="registerButton"
              className="bg-green-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}