'use client'
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Checkboxes from "@/components/Checkboxes";

interface State {
  id: number;
  name: string;
  cities: City[];
}

interface City {
  id: number;
  name: string;
}

interface Practice {
  id: number;
  practice_name: string;
}

interface FormData {
  photo: File | null;
  firmName: string;
  addressLine1: string;
  state: string;
  city: string;
  pinCode: string;
  primaryAreaOfPractice: number;
  secondaryAreaOfPractices: number[];
  yearsOfPractice: string;
  monthsOfPractice: string;
  aboutUs: string;
  password: string;
  confirmPassword: string;
  email: string;
  emailOtp: string;
  mobileNumber: string;
  mobileOtp: string;
}
interface Practice {
  id: number;
  practice_name: string;
  specializations: Specialization[];
}

interface Specialization {
  id: number;
  specialization_name: string;
}
interface UserData {
  email?: string;
  picture?: string;
  name?: string;
}

interface FirmRegistrationProps {
  userData?: UserData;
}
interface Role {
  id: number;
  name: string;
}

export const FirmRegistration: React.FC<FirmRegistrationProps> = ({ userData }) => {
  const [formData, setFormData] = useState<FormData>({
    photo: null,
    firmName: "",
    addressLine1: "",
    state: "",
    pinCode: "",
    city: "",
    primaryAreaOfPractice: 0,
    secondaryAreaOfPractices: [],
    yearsOfPractice: "",
    monthsOfPractice: "",
    aboutUs: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailOtp: "",
    mobileNumber: "",
    mobileOtp: "",
  });

  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [showMobileOTP, setShowMobileOTP] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [emailOtpFields, setEmailOtpFields] = useState(['', '', '', '']);
  const [mobileOtpFields, setMobileOtpFields] = useState(['', '', '', '']);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [areaSummary, setAreaSummary] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const [emailEditable, setEmailEditable] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fieldsResponse, rolesResponse] = await Promise.all([
          fetch('https://api.legalbooks.in/api/v1/register/fields?role=firm'),
          fetch('https://api.legalbooks.in/api/v1/roles')
        ]);
        const fieldsResult = await fieldsResponse.json();
        const rolesResult = await rolesResponse.json();
        
        setStates(fieldsResult.data.states);
        setPractices(fieldsResult.data.practices || []);
        setRoles(rolesResult);
        
        // Set the default role to 'firm' if it exists
        const firmRole = rolesResult.find((role: Role) => role.name === 'firm');
        if (firmRole) {
          setSelectedRole(firmRole.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  
    if (userData) {
      setFormData(prev => ({
        ...prev,
        email: userData.email || '',
        photo: userData.picture ? new File([userData.picture], 'profile.jpg', { type: 'image/jpeg' }) : null,
        firmName: userData.name || '',
      }));
    }
  }, [userData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'pinCode') {
      const newPinCode = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: newPinCode }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    setFormData(prev => ({ ...prev, state: stateId, city: '' }));
    const selectedState = states.find(state => state.id.toString() === stateId);
    setCities(selectedState ? selectedState.cities : []);
  };

  const handlePrimaryAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const practiceId = parseInt(e.target.value, 10);
    setFormData(prev => ({ 
      ...prev, 
      primaryAreaOfPractice: practiceId,
      secondaryAreaOfPractices: [practiceId, ...prev.secondaryAreaOfPractices.filter(id => id !== practiceId)]
    }));
  };

  const handleAreaofPractice = () => {
    setShowAreaModal(true);
  };

  const handleSelection = (selected: string[]) => {
    setSelectedAreas(selected);
  };

  const handleAreaSubmit = (selectedPractices: number[], summary: string) => {
    setFormData(prev => ({
      ...prev,
      secondaryAreaOfPractices: selectedPractices
    }));
    setAreaSummary(summary);
    setShowAreaModal(false);
  };

  const handleSendOTP = async (type: 'mobile' | 'email') => {
    if (type === 'mobile' && !formData.mobileNumber.trim()) {
      setErrors(prev => ({ ...prev, mobileNumber: "Mobile number is required to send OTP" }));
      return;
    }

    try {
      const response = await fetch('https://api.legalbooks.in/api/v1/auth/otp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity: type === 'email' ? formData.email : formData.mobileNumber,
          entity_type: type,
          request_type: "register"
        }),
      });
      const data = await response.json();
      if (response.ok && data.status) {
        if (type === 'email') {
          setShowEmailOTP(true);
          setEmailOtpSent(true);
          setEmailEditable(false);
          console.log('Email OTP sent');
        } else {
          // Simulate successful mobile OTP verification
          setMobileOtpSent(true);
          setMobileOtpVerified(true);
          console.log('Mobile OTP verification simulated');
        }
      } else {
        console.error(`Failed to send ${type} OTP:`, data.msg);
        setErrors(prev => ({ ...prev, [type === 'email' ? 'email' : 'mobileNumber']: data.msg || `Failed to send ${type} OTP, only 10 digits allowed` }));
      }
    } catch (error) {
      console.error(`Error sending ${type} OTP:`, error);
      setErrors(prev => ({ ...prev, [type === 'email' ? 'email' : 'mobileNumber']: `Error sending ${type} OTP` }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowAreaModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOtpChange = (index: number, value: string, type: 'email' | 'mobile') => {
    const newOtpFields = type === 'email' ? [...emailOtpFields] : [...mobileOtpFields];
    newOtpFields[index] = value;
    
    if (type === 'email') {
      setEmailOtpFields(newOtpFields);
    } else {
      setMobileOtpFields(newOtpFields);
    }
    
    if (value && index < 3) {
      const nextInput = document.getElementById(`${type}-otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [type === 'email' ? 'emailOtp' : 'mobileOtp']: newOtpFields.join('')
    }));
  };

  const handleChangeEmail = () => {
    setEmailEditable(true);
    setEmailOtpSent(false);
    setShowEmailOTP(false);
    setEmailOtpVerified(false);
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
          setErrors(prev => ({...prev, emailOtp: "Failed to verify email OTP"}));
        }
      } catch (error) {
        console.error('Error verifying email OTP:', error);
        setErrors(prev => ({...prev, emailOtp: "Error verifying email OTP"}));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firmName.trim()) newErrors.firmName = "Firm name is required";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.primaryAreaOfPractice) newErrors.primaryAreaOfPractice = 0;
    if (!formData.yearsOfPractice && !formData.monthsOfPractice) newErrors.yearsOfPractice = "Years or months of practice is required";
    if (!formData.aboutUs.trim()) newErrors.aboutUs = "About the firm is required";
    if (!formData.pinCode) newErrors.pinCode = "Pin code is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters long";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    if (!emailOtpVerified) newErrors.emailOtp = "Email OTP verification is required";
    if (!mobileOtpVerified) newErrors.mobileOtp = "Mobile OTP verification is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleEmailOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOtpInput(e.target.value);
  };
  const handleCloseModal = () => {
    setShowAreaModal(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    if (!emailOtpVerified || !mobileOtpVerified) {
      setSubmitError("Please verify both email and mobile OTPs");
      return;
    }
    const data = new FormData();
    if (selectedRole !== null) {
      data.append('role', selectedRole.toString());
    }
    data.append('name', formData.firmName);
    data.append('email', formData.email);
    data.append('mobile', formData.mobileNumber);
    data.append('address', formData.addressLine1);
    data.append('state', formData.state);
    data.append('city', formData.city);
    data.append('primary_area_of_practice', formData.primaryAreaOfPractice.toString());
    data.append('secondary_area_of_practices', JSON.stringify(formData.secondaryAreaOfPractices));
    data.append('years_of_practice', formData.yearsOfPractice);
    data.append('months_of_practice', formData.monthsOfPractice);
    data.append('about_us', formData.aboutUs);
    data.append('password', formData.password);
    data.append('pincode', formData.pinCode);
  
    if (formData.photo) {
      data.append('photo', formData.photo);
    }
    
    try {
      const response = await fetch("https://api.legalbooks.in/api/v1/user/register", {
        method: "POST",
        body: data,
      });
      
      const result = await response.json();
  
      if (response.ok && result.status) {
        setRegistrationSuccess(true);
        setFormData({
          photo: null,
          firmName: "",
          addressLine1: "",
          state: "",
          pinCode:"",
          city: "",
          primaryAreaOfPractice: 0,
          secondaryAreaOfPractices: [],
          yearsOfPractice: "",
          monthsOfPractice: "",
          aboutUs: "",
          password: "",
          confirmPassword: "",
          email: "",
          emailOtp: "",
          mobileNumber: "",
          mobileOtp: "",
        });
        setErrors({});
        setSubmitError('');
        console.log("Registration successful:", result.data.success);
      } else {
        console.error('Registration failed:', result);
        setSubmitError(result.msg ? result.msg : "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="registration-container mx-auto py-12 flex flex-col md:flex-row items-center">
        <div className="company-info md:w-1/3 p-8">
          <h1 className="text-3xl font-bold mb-2">LegalBooks</h1>
          <p className="text-lg">India's Largest Legal Platform</p>
          <br />
          <GoogleLoginButton mode={"register"} />
        </div>

        <div className="registration-form md:w-2/3 bg-white p-8 rounded shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Register as Firm
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Photo upload */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={
                    formData.photo instanceof File
                      ? URL.createObjectURL(formData.photo)
                      : userData?.picture || "https://via.placeholder.com/150"
                  }
                  alt="Profile Photo"
                  width={128}
                  height={128}
                  className="rounded-full"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("photoInput")?.click()}
                  className="absolute bottom-0 right-0 bg-green-100 text-green-600 p-2 rounded-full"
                >
                  Upload Photo
                </button>
                <input
                  type="file"
                  id="photoInput"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  accept="image/*"
                />
              </div>
              {userData && (
                <p className="text-sm text-gray-500 mt-2">Profile picture from Google</p>
              )}
            </div>

            {/* Firm Name */}
            <div className="mb-4">
              <label
                htmlFor="firmName"
                className="block text-sm font-medium text-gray-700"
              >
                Firm Name*
              </label>
              <input
                type="text"
                id="firmName"
                name="firmName"
                className={`form-input bg-gray-50 w-full ${errors.firmName ? 'border-red-500' : ''}`}
                onChange={handleInputChange}
                value={formData.firmName}
                required
              />
              {errors.firmName && <p className="text-red-500 text-xs mt-1">{errors.firmName}</p>}
            </div>

            {/* Address */}
            <div className="mb-4">
              <label
                htmlFor="addressLine1"
                className="block text-sm font-medium text-gray-700"
              >
                Address*
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                className={`form-input bg-gray-50 w-full mb-2 ${errors.addressLine1 ? 'border-red-500' : ''}`}
                onChange={handleInputChange}
                value={formData.addressLine1}
                required
              />
              {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
            </div>

            {/* State and City */}
            <div className="flex mb-4">
              <div className="w-1/2 mr-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State*
                </label>
                <select
                  id="state"
                  name="state"
                  className={`form-select bg-gray-50 w-full ${errors.state ? 'border-red-500' : ''}`}
                  onChange={handleStateChange}
                  value={formData.state}
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id.toString()}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
              <div className="w-1/2 ml-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City*
                </label>
                <select
                  id="city"
                  name="city"
                  className={`form-select bg-gray-50 w-full ${errors.city ? 'border-red-500' : ''}`}
                  onChange={handleInputChange}
                  value={formData.city}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id.toString()}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>
            {/* Pin Code */}
            <div className="mb-4">
              <label
                htmlFor="pinCode"
                className="block text-sm font-medium text-gray-700"
              >
                Pin Code
              </label>
              <input
                type="text"
                id="pinCode"
                name="pinCode"
                maxLength={6}
                className={`form-input bg-gray-50 w-full ${errors.pinCode ? 'border-red-500' : ''}`}
                onChange={handleInputChange}
                value={formData.pinCode}
                required
              />
              {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
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
                  <Checkboxes
                    options={practices}
                    selected={formData.secondaryAreaOfPractices}
                    onChange={(selected) => setFormData(prev => ({ ...prev, secondaryAreaOfPractices: selected }))}
                    onSubmit={handleAreaSubmit}
                    maxDisplayed={5}
                    primaryAreaOfPractice={formData.primaryAreaOfPractice}
                    onClose={handleCloseModal}
                  />
                </div>
              </div>
            )}

            {/* Years and Months of Practice */}
            <div className="flex mb-4">
              <div className="w-1/2 mr-2">
                <label htmlFor="yearsOfPractice" className="block text-sm font-medium text-gray-700">
                  Years of Practice
                </label>
                <input
                  type="number"
                  id="yearsOfPractice"
                  name="yearsOfPractice"
                  className={`form-input bg-gray-50 w-full ${errors.yearsOfPractice ? 'border-red-500' : ''}`}
                  onChange={handleInputChange}
                  value={formData.yearsOfPractice}
                  min="0"
                />
              </div>
              <div className="w-1/2 ml-2">
                <label htmlFor="monthsOfPractice" className="block text-sm font-medium text-gray-700">
                  Months of Practice
                </label>
                <input
                  type="number"
                  id="monthsOfPractice"
                  name="monthsOfPractice"
                  className={`form-input bg-gray-50 w-full ${errors.monthsOfPractice ? 'border-red-500' : ''}`}
                  onChange={handleInputChange}
                  value={formData.monthsOfPractice}
                  min="0"
                  max="11"
                />
              </div>
            </div>
            {(errors.yearsOfPractice || errors.monthsOfPractice) && (
              <p className="text-red-500 text-xs mt-1">Years or months of practice is required</p>
            )}

            {/* About Us */}
            <div className="mb-4">
              <label htmlFor="aboutUs" className="block text-sm font-medium text-gray-700">
                About the Firm*
              </label>
              <textarea
                id="aboutUs"
                name="aboutUs"
                className={`form-textarea bg-gray-50 w-full ${errors.aboutUs ? 'border-red-500' : ''}`}
                onChange={handleInputChange}
                value={formData.aboutUs}
                required
              />
              {errors.aboutUs && <p className="text-red-500 text-xs mt-1">{errors.aboutUs}</p>}
            </div>

            {/* Password and Confirm Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password*
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input bg-gray-50 w-full ${errors.password ? 'border-red-500' : ''}`}
                onChange={handleInputChange}
                value={formData.password}
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password*
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input bg-gray-50 w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                onChange={handleInputChange}
                value={formData.confirmPassword}
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email*
              </label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input w-full flex-1 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Email"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                  disabled={!emailEditable}
                />
                <button
                  type="button"
                  className={`btn btn-primary ${emailEditable ? 'bg-black' : 'bg-gray-400'} text-white text-sm max-w-[20%] rounded-md flex-1`}
                  onClick={() => handleSendOTP('email')}
                  disabled={!emailEditable}
                >
                  {emailOtpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              {emailOtpSent && (
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="text-blue-500 text-sm mt-1 hover:underline"
                >
                  Change email
                </button>
              )}
            </div>

            {showEmailOTP && (
              <div className="w-full mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Email OTP
                </label>
                <input
                  type="text"
                  value={emailOtpInput}
                  onChange={(e) => setEmailOtpInput(e.target.value)}
                  className="w-1/4 mr-2 border border-gray-300 rounded-md p-1"
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                />
                <button
                  type="button"
                  onClick={() => handleVerifyOTP('email')}
                  className="mt-2 px-2 py-1.5 text-sm bg-gray-800 text-white hover:border hover:border-black hover:bg-white hover:text-black rounded-md"
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

            {/* Mobile Number */}
            <div className="mb-4 mt-8">
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number*
              </label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  className={`form-input flex-1 ${errors.mobileNumber ? 'border-red-500' : ''}`}
                  placeholder="Mobile Number"
                  onChange={handleInputChange}
                  value={formData.mobileNumber}
                  required
                />
                <button
                  type="button"
                  className="btn btn-primary bg-black text-white rounded-md text-sm max-w-[20%] px-4 py-2"
                  onClick={() => handleSendOTP('mobile')}
                >
                  {mobileOtpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
            </div>

            {showMobileOTP && (
              <div className="mb-4">
                <label
                  htmlFor="mobileOtp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter Mobile OTP
                </label>
                <div className="flex space-x-2">
                  {mobileOtpFields.map((field, index) => (
                    <input
                      key={index}
                      type="text"
                      id={`mobile-otp-${index}`}
                      maxLength={1}
                      value={field}
                      onChange={(e) => handleOtpChange(index, e.target.value, 'mobile')}
                      className="form-input bg-gray-50 w-12 h-12 text-center p-2 border border-gray-300 rounded-md"
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

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
              >
                Register
              </button>
            </div>

            {/* Error Message */}
            {submitError && (
              <p className="text-red-500 text-sm mt-4 text-center">{submitError}</p>
            )}
            <div className="text-center mt-4">
              <a href="../registration" className="text-gray-600 hover:underline">
                Other registration options
              </a>
            </div>   
            {/* Success Message */}
            {registrationSuccess && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                Registration successful! You can now log in.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FirmRegistration;