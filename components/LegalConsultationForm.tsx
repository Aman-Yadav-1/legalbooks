'use client'
import React, { useState, useEffect, useRef } from "react";
import Checkboxes from "@/components/Checkboxes";
interface Practice {
  id: number;
  practice_name: string;
  specializations: {
    id: number;
    specialization_name: string;
  }[];
}
interface Practice {
  id: number;
  practice_name: string;
  specializations: {
    id: number;
    specialization_name: string;
  }[];
}

const LegalConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    state: '',
    city: '',
    primaryAreaOfPractice: '',
    secondaryAreaOfPractices: [] as number[],
    phoneNumber: '',
    email: '',
    description: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    state: '',
    city: '',
    primaryAreaOfPractice: '',
    phoneNumber: '',
    email: '',
  });

  const [statesData, setStatesData] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [areaSummary, setAreaSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStatesAndCities();
    fetchPracticeAreas();

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowAreaModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchStatesAndCities = async () => {
    try {
      const response = await fetch('https://api.legalbooks.in/api/v1/register/fields?role=lawyer');
      const data = await response.json();
      if (data.status && Array.isArray(data.data.states)) {
        setStatesData(data.data.states);
      }
    } catch (error) {
      console.error('Error fetching states and cities:', error);
      setError('Failed to fetch states and cities');
    }
  };

  const fetchPracticeAreas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.legalbooks.in/api/v1/register/fields?role=lawyer');
      const data = await response.json();
      setApiResponse(data); // Store the full API response for debugging
      
      if (data.status && data.data && Array.isArray(data.data.practices)) {
        setPractices(data.data.practices);
      } else {
        setError('Invalid data structure received from API');
        console.error('Invalid API response structure:', data);
      }
    } catch (error) {
      console.error('Error fetching practice areas:', error);
      setError('Failed to fetch practice areas');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'state') {
      const selectedState = statesData.find(state => state.name === value);
      setCities(selectedState ? selectedState.cities : []);
    }

    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePrimaryAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAreaofPractice = () => {
    setShowAreaModal(true);
  };

  const handleAreaSubmit = (selected: number[], summary: string) => {
    setFormData(prev => ({ ...prev, secondaryAreaOfPractices: selected }));
    setAreaSummary(summary);
    setShowAreaModal(false);
  };

  const [showArea, setShowArea] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showMobileOTP, setShowMobileOTP] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [mobileOtpInput, setMobileOtpInput] = useState(Array(4).fill(''));
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [practiceAreas, setPracticeAreas] = useState<Practice[]>([]);
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<number[]>([]);
  useEffect(() => {
    fetchStatesAndCities();
  }, []);

  useEffect(() => {
    if (showArea) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showArea]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else {
      newErrors.firstName = '';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else {
      newErrors.lastName = '';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
      isValid = false;
    } else {
      newErrors.state = '';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
      isValid = false;
    } else {
      newErrors.city = '';
    }


    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
      isValid = false;
    } else {
      newErrors.phoneNumber = '';
    }
  
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }
  
    setErrors(newErrors);
    return isValid;
  };


  const handleSelection = (selected: number[], summary: string) => {
    setSelectedPracticeAreas(selected);
    setFormData(prev => ({ ...prev, practiceArea: summary }));
    setShowArea(false);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setSubmissionMessage('Form submitted successfully!');
      
      setFormData({
        title: '',
        firstName: '',
        lastName: '',
        state: '',
        city: '',
        primaryAreaOfPractice: '',
        secondaryAreaOfPractices: [] as number[],
        phoneNumber: '',
        email: '',
        description: ''
      });
      
      setSelectedAreas([]);
      setMobileOtpVerified(false);
      setEmailOtpVerified(false);
      setMobileOtpInput(Array(4).fill(''));
      setEmailOtpInput('');
      
      setTimeout(() => {
        setSubmissionMessage('');
      }, 5000);
    } else {
      console.log('Form has errors');
    }
  };

  const handleSendOTP = async (type: 'mobile' | 'email') => {
    if (type === 'mobile') {
      setShowMobileOTP(true);
      // Simulate OTP sent for mobile
      console.log('Mobile OTP sent');
    } else {
      try {
        const response = await fetch('https://api.legalbooks.in/api/v1/auth/otp/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entity: formData.email,
            entity_type: "email",
            request_type: "register"
          }),
        });
        const data = await response.json();
        if (data.status) {
          setShowEmailOTP(true);
          console.log('Email OTP sent');
        } else {
          console.error('Failed to send email OTP');
        }
      } catch (error) {
        console.error('Error sending email OTP:', error);
      }
    }
  };

  const handleMobileOtpChange = (index: number, value: string) => {
    const newOtpInput = [...mobileOtpInput];
    newOtpInput[index] = value.slice(0, 1);
    setMobileOtpInput(newOtpInput);

    if (value && index < 3) {
      const nextInput = document.querySelector(`input[name="mobileOtp${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleEmailOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOtpInput(e.target.value);
  };
  const handleCloseModal = () => {
    setShowAreaModal(false);
  };
  const handleVerifyOTP = async (type: 'mobile' | 'email') => {
    if (type === 'mobile') {
      setMobileOtpVerified(true);
      setShowMobileOTP(false);
    } else {
      try {
        const response = await fetch('https://api.legalbooks.in/api/v1/auth/otp/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entity: formData.email,
            entity_type: "email",
            request_type: "register",
            otp: parseInt(emailOtpInput)
          }),
        });
        const data = await response.json();
        if (data.status) {
          setEmailOtpVerified(true);
          setShowEmailOTP(false);
        } else {
          console.error('Failed to verify email OTP');
        }
      } catch (error) {
        console.error('Error verifying email OTP:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-xl rounded-md">
      <div className="p-10 m-4 border border-gray-700 rounded-md">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">
        Schedule Free Legal Consultation
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name*
          </label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              className="border border-gray-300 rounded-md p-2 w-full sm:w-auto"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            >
              <option value="">Title</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
            </select>
            <div className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="First Name"
                className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 w-full`}
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Last Name"
                className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 w-full`}
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>
        </div>

        {/* State and City Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/City*
          </label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="w-full sm:w-1/2">
              <select
                className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your state</option>
                {statesData.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
            <div className="w-full sm:w-1/2">
              <select
                className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>
        </div>

        {/* Primary Area of Practice */}
        <div className="mb-4">
          <label htmlFor="primaryAreaOfPractice" className="block text-sm font-medium text-gray-700">
            Primary Area of Practice*
          </label>
          <select
            id="primaryAreaOfPractice"
            name="primaryAreaOfPractice"
            className={`form-select bg-gray-50 w-full ${errors.primaryAreaOfPractice ? 'border-red-500' : ''}`}
            onChange={handlePrimaryAreaChange}
            value={formData.primaryAreaOfPractice}
            required
          >
            <option value="">Select Primary Area</option>
            {practices.map((practice) => (
              <option key={practice.id} value={practice.id}>
                {practice.practice_name}
              </option>
            ))}
          </select>
          {errors.primaryAreaOfPractice && <p className="text-red-500 text-xs mt-1">{errors.primaryAreaOfPractice}</p>}
        </div>

         {/* Secondary Areas of Practice */}
         <div className="mb-4">
            <button
              type="button"
              onClick={handleAreaofPractice}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Add Secondary Area of Practice
            </button>
            {formData.secondaryAreaOfPractices.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-sm">Selected Secondary Areas:</p>
                <p className="text-xs">{areaSummary}</p>
              </div>
            )}
          </div>

        {/* Update the Custom Modal */}
        {showAreaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Select Secondary Areas of Practice</h2>
              {isLoading ? (
                <p>Loading practice areas...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : practices.length === 0 ? (
                <p>No practice areas available. Please try again later.</p>
              ) : (
                <Checkboxes
                options={practices}
                selected={formData.secondaryAreaOfPractices}
                onChange={(selected) => setFormData(prev => ({ ...prev, secondaryAreaOfPractices: selected }))}
                onSubmit={handleAreaSubmit}
                maxDisplayed={5}
                primaryAreaOfPractice={parseInt(formData.primaryAreaOfPractice)}
                onClose={() => setShowAreaModal(false)}
              />
              )}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            placeholder="Enter a brief description of your legal issue"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        {/* Mobile Number and Email Section */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full sm:w-[30%]">
          <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">Mobile Number*</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                +91
              </span>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="rounded-none rounded-r-lg border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                placeholder="Enter mobile number"
              />
            </div>
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>
          
          {/* OTP Button for Mobile */}
          <div>
            <button
              type="button"
              onClick={() => handleSendOTP("mobile")}
              className="px-3 py-2 bg-gray-800 text-white hover:border hover:bg-white hover:text-black rounded-md whitespace-nowrap"
            >
              Send OTP
            </button>
          </div>

          {showMobileOTP && (
            <div className="w-full mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Mobile OTP
              </label>
              <div className="flex space-x-2">
                {mobileOtpInput.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`mobileOtp${index}`}
                    value={digit}
                    onChange={(e) => handleMobileOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center border border-gray-300 rounded-md"
                    maxLength={1}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleVerifyOTP('mobile')}
                className="mt-2 px-3 py-2 bg-gray-800 text-white hover:border hover:bg-white hover:text-black rounded-md"
              >
                Verify Mobile OTP
              </button>
            </div>
          )}

          {mobileOtpVerified && (
            <div className="text-green-500 text-sm mt-2">
              Mobile OTP verified
            </div>
          )}

          {/* Email */}
          <div className="w-full sm:w-[30%]">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          {/* OTP Button for Email */}
          <div>
            <button
              type="button"
              onClick={() => handleSendOTP("email")}
              className="px-3 py-2 bg-gray-800 text-white hover:border hover:bg-white hover:text-black rounded-md whitespace-nowrap"
            >
              Send OTP
            </button>
          </div>

          {showEmailOTP && (
            <div className="w-full mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Email OTP
              </label>
              <input
                type="text"
                value={emailOtpInput}
                onChange={handleEmailOtpChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter 4-digit OTP"
                maxLength={4}
              />
              <button
                type="button"
                onClick={() => handleVerifyOTP('email')}
                className="mt-2 px-3 py-2 bg-gray-800 text-white hover:border hover:bg-white hover:text-black rounded-md"
              >
                Verify Email OTP
              </button>
            </div>
          )}

          {emailOtpVerified && (
            <div className="text-green-500 text-sm mt-2">
              Email OTP verified
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-2 w-full bg-black text-white rounded-md"
          >
            Submit
          </button>
        </div>
        {submissionMessage && (
          <div className="mb-4 text-green-500 text-center">{submissionMessage}</div>
        )}
      </form>
      </div>
    </div>
  );
};

export default LegalConsultationForm;