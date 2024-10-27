"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { useRouter } from "next/navigation";

interface State {
  id: number;
  name: string;
  cities: City[];
}

interface City {
  id: number;
  name: string;
}

interface FormData {
  photo: File | null;
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  state: string;
  city: string;
  pinCode: string;
  gender: string;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
  emailOtp: string;
  mobileOtp: string;
  role: string;
}

const INITIAL_FORM_DATA: FormData = {
  photo: null,
  firstName: "",
  lastName: "",
  email: "",
  addressLine1: "",
  state: "",
  city: "",
  pinCode: "",
  gender: "",
  password: "",
  confirmPassword: "",
  mobileNumber: "",
  emailOtp: "",
  mobileOtp: "",
  role: "",
};

export default function VisitorRegistration() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [showMobileOTP, setShowMobileOTP] = useState(false);
  const [mobileOtpFields, setMobileOtpFields] = useState(['', '', '', '']);
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [emailOtpFields, setEmailOtpFields] = useState(['', '', '', '']);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [emailEditable, setEmailEditable] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data..."); // Debug log
      try {
        const storedUserData = localStorage.getItem('registrationUserData');
        
        if (storedUserData) {
          const { role } = JSON.parse(storedUserData);
          setFormData((prev) => ({ ...prev, role }));
        }
  
        const response = await fetch(`https://api.legalbooks.in/api/v1/register/fields?role=visitor`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
  
        if (result.status && result.data && result.data.states) {
          setStates(result.data.states);
        } else {
          console.error('Invalid API response structure:', result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    const selectedState = states.find(state => state.id.toString() === stateId);
    setFormData(prev => ({ ...prev, state: stateId, city: '' }));
    setCities(selectedState ? selectedState.cities : []);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
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
    
    if (type === 'email') {
      setEmailOtpInput(newOtpFields.join(''));
    }
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      console.log("Validation failed: First name is required");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      console.log("Validation failed: Last name is required");
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      console.log("Validation failed: Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      console.log("Validation failed: Invalid email format");
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
      console.log("Validation failed: Address is required");
    }
    if (!formData.state) {
      newErrors.state = "State is required";
      console.log("Validation failed: State is required");
    }
    if (!formData.city) {
      newErrors.city = "City is required";
      console.log("Validation failed: City is required");
    }
    if (!formData.pinCode) {
      newErrors.pinCode = "Pin code is required";
      console.log("Validation failed: Pin code is required");
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      console.log("Validation failed: Password is required");
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      console.log("Validation failed: Password must be at least 8 characters long");
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      console.log("Validation failed: Password requirements not met");
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      console.log("Validation failed: Passwords do not match");
    }
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
      console.log("Validation failed: Mobile number is required");
    }
    
    setErrors(newErrors);
    console.log("All validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit button clicked");
    
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
  
    console.log("Preparing data for submission");
    const data = new FormData();
    data.append('role', formData.role);
    data.append('first_name', formData.firstName);
    data.append('last_name', formData.lastName);
    data.append('email', formData.email);
    data.append('mobile', formData.mobileNumber);
    data.append('address', formData.addressLine1);
    data.append('state', formData.state);
    data.append('city', formData.city);
    data.append('pincode', formData.pinCode);
    data.append('gender', formData.gender);
    data.append('login_type', 'email');
    data.append('password', formData.password);
  
    if (formData.photo) {
      data.append('photo', formData.photo);
    }
    
    try {
      console.log("Sending registration request");
      const response = await fetch("https://api.legalbooks.in/api/v1/user/register", {
        method: "POST",
        body: data,
      });
      
      const result = await response.json();
      console.log("Registration response:", result);
  
      if (response.ok && result.status) {
        console.log("Registration successful");
        setRegistrationSuccess(true);
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setSubmitError('');
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
            Register as Visitor
          </h2>


          <form onSubmit={handleSubmit}>
            {/* Photo upload */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={
                    formData.photo
                      ? URL.createObjectURL(formData.photo)
                      : "https://via.placeholder.com/150"
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
            </div>

            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                Name*
              </label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-input bg-gray-50 flex-1 ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="First Name"
                  onChange={handleInputChange}
                  value={formData.firstName}
                  required
                />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-input bg-gray-50 flex-1 ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  value={formData.lastName}
                  required
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
                placeholder="Address Line 1"
                onChange={handleInputChange}
                value={formData.addressLine1}
                required
              />
              {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}

              {/* State and City dropdowns */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/City*
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="w-full sm:w-1/2">
                      <select
                        className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                        name="state"
                        value={formData.state}
                        onChange={handleStateChange}
                        required
                      >
                        <option value="">Select your state</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id.toString()}>
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
                        disabled={!formData.state}
                      >
                        <option value="">Select your city</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id.toString()}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                  </div>
                </div>
            </div>

            {/* Pin Code */}
            <div className="mb-4">
              <label
                htmlFor="pinCode"
                className="block text-sm font-medium text-gray-700"
              >
                Pin Code*
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

            

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
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

            {/* Confirm Password */}
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
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

            {submitError && (
              <div className="mb-4 text-red-500 text-center">{submitError}</div>
            )}

          <div className="text-center">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 w-full rounded-md hover:bg-gray-800 transition duration-300"
              >
                Register
              </button>
            </div>

            {submitError && (
              <div className="mb-4 text-red-500 text-center">{submitError}</div>
            )}

            <div className="text-center mt-4">
              <a href="../registration" className="text-gray-600 hover:underline">
                Other registration options
              </a>
            </div> 
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
}
