"use client";

import React, { useState, useEffect, useRef } from "react";
import Checkboxes from "@/components/Checkboxes";
import GoogleLoginButton from "@/components/GoogleLoginButton";

interface LawyerRegistrationProps {
  userData?: UserData;
}

interface UserData {
  email?: string;
  picture?: string;
  name?: string;
}

interface State {
  id: number;
  name: string;
  cities: City[];
}

interface City {
  id: number;
  name: string;
  state: string;
}


interface Court {
  id: number;
  court_type: string;
  state: string;
  district: string;
  court: string;
}
type CourtType = string;
interface ApiResponse {
  data: {
    states: State[];
    court_types: CourtType[];
    courts: Court[];
    practices: Array<{
      id: number;
      practice_name: string;
      specializations: Array<{
        id: number;
        specialization_name: string;
      }>;
    }>;
  };
  msg: string;
  status: boolean;
  status_code: number;
}
interface Role {
  id: number;
  name: string;
}
interface FormData {
  aboutLawyer: string;
  photo: File | null;
  firstName: string;
  lastName: string;
  addressLine1: string;
  state: string;
  city: string;
  pinCode: string;
  gender: string;
  primaryAreaOfPractice: number;
  secondaryAreaOfPractices: number[];
  courtType: string;
  district: string;
  court: string;
  yearsOfPractice: string;
  monthsOfPractice: string;
  password: string;
  confirmPassword: string;
  email: string;
  emailOtp: string;
  mobileNumber: string;
  mobileOtp: string;
  role:string
}

export const LawyerRegistration: React.FC<LawyerRegistrationProps> = ({ userData }) =>  {
  const [formData, setFormData] = useState<FormData>({
    photo: null,
    firstName: "",
    lastName: "",
    addressLine1: "",
    state: "",
    city: "",
    pinCode: "",
    gender: "",
    primaryAreaOfPractice: 0,
    secondaryAreaOfPractices: [],
    courtType: "",
    district: "",
    court: "",
    yearsOfPractice: "",
    monthsOfPractice: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailOtp: "",
    mobileNumber: "",
    mobileOtp: "",
    aboutLawyer: "",
    role:""
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [statesData, setStatesData] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [courtTypes, setCourtTypes] = useState<string[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);
  const [courtTypeEntries, setCourtTypeEntries] = useState<Array<{
    courtType: string;
    state: string;
    district: string;
    court: string | null;
  }>>([
    { courtType: '', state: '', district: '', court: null }
  ]);
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [emailOtpFields, setEmailOtpFields] = useState(['', '', '', '']);
  const [mobileOtpFields, setMobileOtpFields] = useState(['', '', '', '']);
  const [showEmailOTP, setShowEmailOTP] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [showMobileOTP, setShowMobileOTP] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [areaSummary, setAreaSummary] = useState('');
  const [emailEditable, setEmailEditable] = useState(true);
  const [practices, setPractices] = useState<Array<{
    id: number;
    practice_name: string;
    specializations: Array<{
      id: number;
      specialization_name: string;
    }>;
  }>>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Current statesData:", statesData);
  }, [statesData]);

  useEffect(() => {
    console.log('Current practices:', practices);
  }, [practices]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fieldsResponse, rolesResponse] = await Promise.all([
          fetch('https://api.legalbooks.in/api/v1/register/fields?role=lawyer'),
          fetch('https://api.legalbooks.in/api/v1/roles')
        ]);
        const fieldsResult = await fieldsResponse.json();
        const rolesResult = await rolesResponse.json();
        
        setStates(fieldsResult.data.states);
        setPractices(fieldsResult.data.practices || []);
        setRoles(rolesResult);
        
        const lawyerRole = rolesResult.find((role: Role) => role.name === 'lawyer');
        if (lawyerRole) {
          setSelectedRole(lawyerRole.id);
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
  
    if (name === 'state') {
      const selectedState = statesData.find(state => state.id.toString() === value);
      if (selectedState) {
        setCities(selectedState.cities);
        setFormData(prev => ({ ...prev, city: '' })); 
      } else {
        setCities([]);
      }
    }
    if (name === 'pinCode') {
      const newPinCode = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: newPinCode }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    } else if (name === "confirmPassword") {
      if (value !== formData.password) {
        setConfirmPasswordError("Passwords do not match.");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
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
  const handleAreaofPractice = () => {
    setShowAreaModal(true);
  };
  const handleAreaSubmit = (selectedPractices: number[], summary: string) => {
    setFormData(prev => ({
      ...prev,
      secondaryAreaOfPractices: selectedPractices
    }));
    setAreaSummary(summary);
    setShowAreaModal(false);
  };
  const handleSelection = (selected: string[]) => {
    setSelectedAreas(selected);
  };

  const validatePassword = (password: string): string => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    } else if (!(hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    return "";
  };
  const handleEmailOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOtpInput(e.target.value);
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
      document.getElementById(`${type}-otp-${index + 1}`)?.focus();
    }
    
    setFormData(prev => ({
      ...prev,
      [type === 'email' ? 'emailOtp' : 'mobileOtp']: newOtpFields.join('')
    }));
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

  const handleCourtTypeChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const courtType = e.target.value.toLowerCase();
    const newCourtTypeEntries = [...courtTypeEntries];
    newCourtTypeEntries[index] = { courtType, state: '', district: '', court: '' };
    setCourtTypeEntries(newCourtTypeEntries);
  };

  const handleStateChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    const newCourtTypeEntries = [...courtTypeEntries];
    newCourtTypeEntries[index] = { ...newCourtTypeEntries[index], state, district: '', court: '' };
    setCourtTypeEntries(newCourtTypeEntries);
  };
  
  
const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const cityId = e.target.value;
  setFormData(prev => ({ ...prev, city: cityId }));
};

const handlePrimaryAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const practiceId = parseInt(e.target.value, 10);
  setFormData(prev => ({ 
    ...prev, 
    primaryAreaOfPractice: practiceId,
    secondaryAreaOfPractices: [practiceId, ...prev.secondaryAreaOfPractices.filter(id => id !== practiceId)]
  }));
};

const handleDistrictChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
  const district = e.target.value;
  const newCourtTypeEntries = [...courtTypeEntries];
  newCourtTypeEntries[index] = { ...newCourtTypeEntries[index], district, court: '' };
  setCourtTypeEntries(newCourtTypeEntries);
};

const handleCourtChange = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
  const courtId = e.target.value;
  const newCourtTypeEntries = [...courtTypeEntries];
  newCourtTypeEntries[index] = { ...newCourtTypeEntries[index], court: courtId };
  setCourtTypeEntries(newCourtTypeEntries);
};
const handleCloseModal = () => {
  setShowAreaModal(false);
};
const addCourtTypeEntry = () => {
  setCourtTypeEntries([...courtTypeEntries, { courtType: '', state: '', district: '', court: '' }]);
};
const handleChangeEmail = () => {
  setEmailEditable(true);
  setEmailOtpSent(false);
  setShowEmailOTP(false);
  setEmailOtpVerified(false);
};
const removeCourtTypeEntry = (index: number) => {
  if (courtTypeEntries.length > 1) {
    const newCourtTypeEntries = courtTypeEntries.filter((_, i) => i !== index);
    setCourtTypeEntries(newCourtTypeEntries);
  }
};
const validateForm = (): boolean => {
  const newErrors: Partial<FormData> = {};
  if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
  if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
  if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
  if (!formData.state) newErrors.state = "State is required";
  if (!formData.city) newErrors.city = "City is required";
  if (!formData.pinCode) newErrors.pinCode = "Pin code is required";
  if (!formData.primaryAreaOfPractice) newErrors.primaryAreaOfPractice = 0;
  if (!formData.yearsOfPractice && !formData.monthsOfPractice) newErrors.yearsOfPractice = "Years or months of practice is required";
  if (!courtTypeEntries.some(entry => entry.court)) {
    newErrors.court = "Please select a court";
  }
  if (!formData.yearsOfPractice && !formData.monthsOfPractice) newErrors.yearsOfPractice = "Years or months of practice is required";
  if (!formData.aboutLawyer.trim()) newErrors.aboutLawyer = "About lawyer is required";
  if (!formData.password) newErrors.password = "Password is required";
  if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
  if (!formData.email) newErrors.email = "Email is required";
  if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
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
  data.append('role', formData.role);
  data.append('first_name', formData.firstName);
  data.append('last_name', formData.lastName);
  data.append('email', formData.email);
  data.append('mobile', formData.mobileNumber);
  data.append('address', formData.addressLine1);
  data.append('state', formData.state);
  data.append('city', formData.city);
  data.append('pincode', formData.pinCode);
  
  const totalExperienceMonths = 
    (parseInt(formData.yearsOfPractice) * 12 + parseInt(formData.monthsOfPractice));
  data.append('experience_years', Math.floor(totalExperienceMonths / 12).toString());
  data.append('experience_months', (totalExperienceMonths % 12).toString());
  
  data.append('about', formData.aboutLawyer);
  
  
  data.append('primary_area_of_practice', formData.primaryAreaOfPractice.toString());
  data.append('secondary_area_of_practices', JSON.stringify(formData.secondaryAreaOfPractices));
  
  // Handle courts
  const selectedCourt = courtTypeEntries.find(entry => entry.court);
  if (selectedCourt && selectedCourt.court) {
    data.append('courts', selectedCourt.court);
  } else {
    setSubmitError("Please select a court");
    return;
  }

  data.append('login_type', 'email');
  data.append('password', formData.password);

  if (formData.photo) {
    data.append('photo', formData.photo);
  }
  
Array.from(data.entries()).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

  try {
    const response = await fetch("https://api.legalbooks.in/api/v1/user/register", {
      method: "POST",
      body: data,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const responseText = await response.text();
    console.log('Response text:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.log('Failed to parse response as JSON');
    }

    console.log('Parsed result:', result);

    if (response.ok && result && result.status) {
      setRegistrationSuccess(true);
      console.log("Registration successful:", result.data.success);
    } else {
      console.error('Registration failed:', result);
      setSubmitError(result && result.msg ? result.msg : "Registration failed. Please try again.");
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
            Register as Lawyer
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
                Name
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-input md:1/2 bg-gray-50 flex-1 ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="First Name"
                  onChange={handleInputChange}
                  value={formData.firstName}
                  required
                />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-input md:1/2 bg-gray-50 flex-1 ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  value={formData.lastName}
                  required
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
                <option key={practice.id} value={practice.id.toString()}>
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

            {/* Court Type Selection */}
            <div className="mb-4 border-2 border-black p-4 rounded">
              <h3 className="text-lg font-semibold mb-4">Enter Court Type</h3>
              {courtTypeEntries.map((entry, index) => (
                <div key={index} className="mb-4">
                  <select
                    value={entry.courtType}
                    onChange={(e) => handleCourtTypeChange(index, e)}
                    className="form-select bg-gray-50 w-[70%] mb-2"
                    required
                  >
                    <option value="">Select Court Type</option>
                    {courtTypes.map((courtType) => (
                      <option key={courtType} value={courtType.toLowerCase()}>
                        {courtType}
                      </option>
                    ))}
                  </select>
                  
                  {entry.courtType && (
                    <>
                      {entry.courtType === 'districtcourt' && (
                        <>
                          <select
                            value={entry.state}
                            onChange={(e) => handleStateChange(index, e)}
                            className="form-select bg-gray-50 w-[70%] mb-2"
                            required
                          >
                            <option value="">Select State</option>
                            {statesData.map((state) => (
                              <option key={state.id} value={state.name}>
                                {state.name}
                              </option>
                            ))}
                          </select>
                          {entry.state && (
                            <select
                              value={entry.district}
                              onChange={(e) => handleDistrictChange(index, e)}
                              className="form-select bg-gray-50 w-[70%] mb-2"
                              required
                            >
                              <option value="">Select District</option>
                              {cities
                                .filter(city => city.state === entry.state)
                                .map((city) => (
                                  <option key={city.id} value={city.name}>
                                    {city.name}
                                  </option>
                                ))}
                            </select>
                          )}
                        </>
                      )}
                      
                      {entry.courtType === 'districtcommission' && (
                        <select
                          value={entry.state}
                          onChange={(e) => handleStateChange(index, e)}
                          className="form-select bg-gray-50 w-[70%] mb-2"
                          required
                        >
                          <option value="">Select State</option>
                          {statesData.map((state) => (
                            <option key={state.id} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      <select
                        value={entry.court || ''}
                        onChange={(e) => handleCourtChange(index, e)}
                        className="form-select bg-gray-50 w-[70%]"
                        required
                      >
                        <option value="">Select Court</option>
                        {courts
                          .filter(court => {
                            if (entry.courtType === 'supremecourt') {
                              return court.court_type.toLowerCase() === 'supremecourt';
                            } else if (entry.courtType === 'highcourt') {
                              return court.court_type.toLowerCase() === 'highcourt';
                            } else if (entry.courtType === 'districtcourt') {
                              return court.court_type.toLowerCase() === 'districtcourt' && 
                                    court.state === entry.state && 
                                    court.district === entry.district;
                            } else if (entry.courtType === 'districtcommission') {
                              return court.court_type.toLowerCase() === 'districtcommission' && 
                                    court.state === entry.state;
                            } else if (['nclt', 'statecommission'].includes(entry.courtType)) {
                              return court.court_type.toLowerCase() === entry.courtType;
                            }
                            return false;
                          })
                          .map((court) => (
                            <option key={court.id} value={court.id}>
                              {court.court}
                            </option>
                          ))}
                      </select>
                    </>
                  )}

                  <div className="mt-2">
                    {index === courtTypeEntries.length - 1 && (
                      <button type="button" onClick={addCourtTypeEntry} className="bg-green-500 text-white px-2 py-1 w-[10%] rounded mr-2">+</button>
                    )}
                    {courtTypeEntries.length > 1 && (
                      <button type="button" onClick={() => removeCourtTypeEntry(index)} className="bg-red-500 text-white px-2 py-1 rounded">-</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Years of Practice */}
            <div className="mb-4">
              <label
                htmlFor="yearsOfPractice"
                className="block text-sm font-medium text-gray-700"
              >
                Years of Practice*
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="yearsOfPractice"
                  name="yearsOfPractice"
                  className={`form-input flex-1 ${errors.yearsOfPractice ? 'border-red-500' : ''}`}
                  placeholder="Years"
                  onChange={handleInputChange}
                  value={formData.yearsOfPractice}
                />
                <input
                  type="number"
                  id="monthsOfPractice"
                  name="monthsOfPractice"
                  className={`form-input flex-1 ${errors.monthsOfPractice ? 'border-red-500' : ''}`}
                  placeholder="Months"
                  onChange={handleInputChange}
                  value={formData.monthsOfPractice}
                />
              </div>
              {errors.yearsOfPractice && <p className="text-red-500 text-xs mt-1">{errors.yearsOfPractice}</p>}
            </div>

            {/* About Lawyer */}
            <div className="mb-4">
              <label
                htmlFor="aboutLawyer"
                className="block text-sm font-medium text-gray-700"
              >
                About Lawyer*
              </label>
              <textarea
                id="aboutLawyer"
                name="aboutLawyer"
                className={`form-textarea border bg-gray-50 w-full ${errors.aboutLawyer ? 'border-red-500' : ''}`}
                rows={4}
                onChange={handleInputChange}
                value={formData.aboutLawyer}
                required
              ></textarea>
              {errors.aboutLawyer && <p className="text-red-500 text-xs mt-1">{errors.aboutLawyer}</p>}
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
                className={`form-input bg-gray-50 w-full ${
                  passwordError ? "border-red-500" : ""
                }`}
                onChange={handleInputChange}
                value={formData.password}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-xs italic">{passwordError}</p>
              )}
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
                className={`form-input bg-gray-50 w-full ${
                  confirmPasswordError ? "border-red-500" : ""
                }`}
                onChange={handleInputChange}
                value={formData.confirmPassword}
                required
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-xs italic">{confirmPasswordError}</p>
              )}
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
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
              >
                Register
              </button>
            </div>

            {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}

            <div className="text-center mt-4">
              <a href="../registration" className="text-gray-600 hover:underline">
                Other registration options
              </a>
            </div>   
          </form>
          {registrationSuccess && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                Registration successful! You can now log in.
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default LawyerRegistration;