'use client'
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';

interface UserDetails {
  id: number;
  email: string;
  name: string;
  role: string;
  role_id: number;
  profile_picture: string;
}

interface AuthResponse {
  refresh: string;
  access: string;
  user_details: UserDetails;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserDetails | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const userDetails = JSON.parse(localStorage.getItem('user_details') || '{}');
      setUserData(userDetails);
    }
  }, []);

  const toggleEdit = (): void => {
    setIsEditing(!isEditing);
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 bg-gray-50 min-h-screen">
      <div className="md:flex no-wrap md:-mx-2">
        {/* Left Side */}
        <div className="w-full md:w-3/12 md:mx-2">
          <div className="bg-white p-3 border-t-4 border-green-400 rounded-lg shadow-lg">
            <div className="image overflow-hidden rounded-lg">
              <img 
                className="h-48 w-full object-cover mx-auto transition-transform duration-300 hover:scale-105"
                src={userData.profile_picture}
                alt={userData.name}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`;
                }}
              />
            </div>
            <h1 className="text-gray-900 font-bold text-xl leading-8 my-3">{userData.name}</h1>
            <div className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 p-3 rounded transition-colors duration-200">
              <p className="font-semibold text-sm mb-1">About</p>
              <p className="text-sm">Professional {userData.role} with expertise in legal consultation and representation.</p>
            </div>
            <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 rounded-lg shadow-md mt-3 divide-y divide-gray-200">
              <li className="flex items-center py-3 px-4">
                <span className="text-sm font-medium">Status</span>
                <span className="ml-auto">
                  <span className="bg-green-500 py-1 px-2 rounded-full text-white text-xs">
                    {userData.role.toUpperCase()}
                  </span>
                </span>
              </li>
              <li className="flex items-center py-3 px-4">
                <span className="text-sm font-medium">Role ID</span>
                <span className="ml-auto text-sm">{userData.role_id}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-9/12 mx-2 h-64">
          {/* About Section */}
          <div className="bg-white p-3 rounded-lg shadow-lg mb-4">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
              <span className="text-green-500">
                <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span className="tracking-wide text-lg">About</span>
              <button 
                onClick={toggleEdit} 
                className="ml-auto text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                <FaEdit className="h-5 w-5" />
              </button>
            </div>
            <div className="text-gray-700">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Name</div>
                  <div className="px-4 py-2">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={userData.name}
                        className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                      />
                    ) : userData.name}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2 font-semibold">Email</div>
                  <div className="px-4 py-2">
                    {isEditing ? (
                      <input 
                        type="email" 
                        defaultValue={userData.email}
                        className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                      />
                    ) : (
                      <a href={`mailto:${userData.email}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                        {userData.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Areas */}
          <div className="bg-white p-3 rounded-lg shadow-lg mb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                  <span className="text-green-500">
                    <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  <span className="tracking-wide text-lg">Primary Practice Areas</span>
                </div>
                <ul className="list-inside space-y-2">
                  <li className="text-teal-600 text-sm bg-teal-50 rounded-lg p-2 hover:bg-teal-100 transition-colors duration-200">
                    Criminal Law
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                  <span className="text-green-500">
                    <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path fill="#fff" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </span>
                  <span className="tracking-wide text-lg">Secondary Practice Areas</span>
                </div>
                <ul className="list-inside space-y-2">
                  {['Civil Law', 'Family Law', 'Corporate Law'].map((practice) => (
                    <li key={practice} className="text-teal-600 text-sm bg-teal-50 rounded-lg p-2 hover:bg-teal-100 transition-colors duration-200">
                      {practice}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Courts */}
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
              <span className="text-green-500">
                <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </span>
              <span className="tracking-wide text-lg">Courts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Supreme Court', 'High Court', 'District Court'].map((court) => (
                <span 
                  key={court}
                  className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full
                           hover:bg-green-200 transition-colors duration-200 cursor-default"
                >
                  {court}
                </span>
              ))}
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg
                         hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg
                         hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;