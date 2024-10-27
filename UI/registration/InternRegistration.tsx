"use client";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import React, { useState, useEffect } from "react";

// Define the interface for your data
interface StateData {
  id: string;
  state: string;
  cities: { id: string; city: string }[];
}

export default function InternRegistration() {
  const [formData, setFormData] = useState({
    photo: null as File | null,
    firstName: "",
    lastName: "",
    addressLine1: "",
    state: "",
    city: "",
    pinCode: "",
    gender: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    mobileOtp: "",
  });

  // Use the defined interface for the data state
  const [data, setData] = useState<StateData[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState<{ id: string; city: string }[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.legalbooks.in/api/v1/register/fields?role=lawyer"
      );
      const result = await response.json();
      
      setData(result.data.states);
    };

    fetchData();
  }, []);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    const selectedData = data.find((item) => item.state === state);
    setCities(selectedData ? selectedData.cities : []);
    setFormData((prev) => ({
      ...prev,
      state,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSendOTP = async () => {
    setOtpSent(true);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if (key === "secondaryAreaOfPractices") {
          data.append(key, JSON.stringify(value));
        } else if (key === "photo" && value instanceof File) {
          data.append(key, value);
        } else {
          data.append(key, value.toString());
        }
      }
    });

    try {
      const response = await fetch("/api/register-lawyer", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        console.log("Registration successful");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="registration-container mx-auto py-12 flex flex-col md:flex-row items-center">
        <div className="company-info md:w-1/3 p-8">
          <h1 className="text-3xl font-bold mb-2">LegalBooks</h1>
          <p className="text-lg">India's Largest Legal Platform</p>
          <br />
          {/* Use the GoogleLoginButton component */}
          <GoogleLoginButton mode={"register"} />
        </div>

        <div className="registration-form md:w-2/3 bg-white p-8 rounded shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Register as Intern
          </h2>

          <form onSubmit={handleSubmit}>
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
                  className="form-input bg-gray-50 flex-1"
                  placeholder="First Name"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input bg-gray-50 flex-1"
                  placeholder="Last Name"
                  onChange={handleInputChange}
                />
              </div>
            </div>

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
                className="form-input bg-gray-50 w-full mb-2"
                placeholder="Address Line 1"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-6">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="state"
                >
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={selectedState}
                  onChange={handleStateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select your state</option>
                  {data &&
                    data.map((item) => (
                      <option key={item.id} value={item.state}>
                        {item.state}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="city"
                >
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  disabled={!selectedState}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select your city</option>
                  {cities &&
                    cities.map((city) => (
                      <option key={city.id} value={city.city}>
                        {city.city}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="pinCode"
                className="block w-1/3 text-sm font-medium text-gray-700"
              >
                Pin Code
              </label>
              <div className="flex space-x-1">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    id={`pinCode-${index}`}
                    name="pinCode"
                    maxLength={1}
                    className="form-input bg-gray-50 w-12 h-12 text-center p-2 border border-gray-300 rounded-md"
                    onChange={handleInputChange}
                    required
                  />
                ))}
              </div>
            </div>
            

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input bg-gray-50 w-full"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input bg-gray-50 w-full"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                className="form-input bg-gray-50 w-full"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <button
                type="button"
                onClick={handleSendOTP}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Send OTP
              </button>
              {otpSent && (
              <div className="mb-4">
              <label
                htmlFor="mobileOtp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter OTP
              </label>
              <div className="flex space-x-1">
                {[...Array(4)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    id={`mobileOtp-${index}`}
                    name="mobileOtp"
                    maxLength={1}
                    className="form-input bg-gray-50 w-12 h-12 text-center p-2 border border-gray-300 rounded-md"
                    onChange={handleInputChange}
                  />
                ))}
              </div>
            </div>
            )}
            </div>

            <div className="mb-6">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                required
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700"
              >
                I agree to the <a href="#">Terms and Conditions</a>
              </label>
            </div>

            <button
              type="submit"
              className="bg-black w-full text-white px-4 py-2 rounded"
            >
              Register
            </button>
            <div className="text-center">
              <a
                href="../registration"
                className="text-gray-600 hover:text-gray-400"
              >
                Other registration options
              </a>
            </div>
          </form>

          {showPopup && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-lg font-bold mb-4">Registration Successful</h3>
                <p>Your registration was successful. You can now log in.</p>
                <button
                  onClick={togglePopup}
                  className="mt-4 bg-black text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
