import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { FaEye, FaPlus, FaChevronDown } from 'react-icons/fa';
import { XIcon } from 'lucide-react';

interface Consultation {
  id: string;
  created_at: string;
  city: number;
  specializations: number[];
  content: string;
  email: string;
  mobile: string;
}

interface UserDetails {
  id: number;
  email: string;
  name: string;
  role: string;
  role_id: number;
  profile_picture: string;
}

interface AuthData {
  refresh: string;
  access: string;
  user_details: UserDetails;
}

const API_URL = 'https://api.legalbooks.in/api/v1/consultations/';

const getAuthData = (): AuthData | null => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const userDetailsString = localStorage.getItem('user_details');
  
  if (accessToken && refreshToken && userDetailsString) {
    try {
      const userDetails = JSON.parse(userDetailsString);
      return {
        access: accessToken,
        refresh: refreshToken,
        user_details: userDetails
      };
    } catch (error) {
      console.error('Error parsing user details:', error);
    }
  }
  return null;
};

const DetailPopup: React.FC<{ consultation: Consultation; onClose: () => void }> = ({ consultation, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Consultation Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-gray-700"><span className="font-medium text-gray-900">ID:</span> {consultation.id}</p>
          <p className="text-gray-700"><span className="font-medium text-gray-900">Date:</span> {format(new Date(consultation.created_at), 'MMMM dd, yyyy')}</p>
          <p className="text-gray-700"><span className="font-medium text-gray-900">Email:</span> {consultation.email}</p>
          <p className="text-gray-700"><span className="font-medium text-gray-900">Mobile:</span> {consultation.mobile}</p>
          <div>
            <p className="font-medium text-gray-900 mb-2">Content:</p>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{consultation.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateConsultationForm: React.FC<{ onClose: () => void; onSubmit: (consultation: Partial<Consultation>) => void }> = ({ onClose, onSubmit }) => {
  const [newConsultation, setNewConsultation] = useState<Partial<Consultation>>({
    specializations: [],
    content: '',
    email: '',
    mobile: '',
    city: 2
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewConsultation(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (specializationId: number) => {
    setNewConsultation(prev => ({
      ...prev,
      specializations: prev.specializations?.includes(specializationId)
        ? prev.specializations.filter(id => id !== specializationId)
        : [...(prev.specializations || []), specializationId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newConsultation);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const specializationOptions = [1,2,3,4,5,6,7,8,9,10,11,17,21,22,23,40,100];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Create New Consultation</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={newConsultation.email}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input
                type="tel"
                name="mobile"
                id="mobile"
                value={newConsultation.mobile}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              id="content"
              name="content"
              rows={4}
              value={newConsultation.content}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div ref={dropdownRef}>
            <label htmlFor="specializations" className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
            <div className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {newConsultation.specializations?.length
                  ? `${newConsultation.specializations.length} selected`
                  : 'Select specializations'}
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {specializationOptions.map((value) => (
                    <div
                      key={value}
                      className={`${
                        newConsultation.specializations?.includes(value) ? 'bg-indigo-100' : ''
                      } cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50`}
                      onClick={() => handleSpecializationChange(value)}
                    >
                      Specialization {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const MyConsultations: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    const storedAuthData = getAuthData();
    console.log('Stored auth data:', storedAuthData);
    
    if (storedAuthData) {
      setAuthData(storedAuthData);
      fetchConsultations(storedAuthData.access);
    } else {
      setError('No authentication data found. Please ensure you are logged in.');
    }
    setLoading(false);
  }, []);

  const fetchConsultations = async (accessToken: string) => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setConsultations(data.results);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('Failed to fetch consultations. Please try again later.');
    }
  };

  const handleSubmit = async (newConsultation: Partial<Consultation>) => {
    if (!authData) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access}`,
        },
        body: JSON.stringify(newConsultation),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData) || `HTTP error! status: ${response.status}`);
      }

      const createdConsultation = await response.json();
      setConsultations([createdConsultation, ...consultations]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating consultation:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  if (!authData) {
    return <div className="min-h-screen bg-white flex items-center justify-center">No authentication data available. Please log in again.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Consultations</h1>
                <div className="text-sm text-gray-600 mt-1">
                  Welcome, <span className="font-medium">{authData.user_details.name}</span> ({authData.user_details.role})
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <FaPlus className="h-5 w-5 mr-2" aria-hidden="true" />
                Add Consultation
              </button>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {consultations.map((consultation) => (
                <div 
                  key={consultation.id} 
                  className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 transition duration-150 ease-in-out hover:border-indigo-500"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-medium text-lg text-gray-900">#{consultation.id.slice(0, 8)}</div>
                      <div className="text-sm text-gray-500">{format(new Date(consultation.created_at), 'MMM dd, yyyy')}</div>
                    </div>
                    <div className="mb-4 flex justify-between">
                      <div className="text-sm text-gray-600">{consultation.email}</div>
                      <div className="text-sm text-gray-600">{consultation.mobile}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Content:</div>
                      <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{consultation.content}</div>
                    </div>
                    <button 
                      onClick={() => setSelectedConsultation(consultation)}
                      className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                      <FaEye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
      </div>
      {showAddForm && (
        <CreateConsultationForm onClose={() => setShowAddForm(false)} onSubmit={handleSubmit} />
      )}
      {selectedConsultation && (
        <DetailPopup consultation={selectedConsultation} onClose={() => setSelectedConsultation(null)} />
      )}
    </div>
  );
};

export default MyConsultations;