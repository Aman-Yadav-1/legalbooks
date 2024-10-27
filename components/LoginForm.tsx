"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleLoginButton from "./GoogleLoginButton";

interface UserDetails {
  id: number;
  email: string;
  name: string;
  role: string;
  role_id: number;
  profile_picture: string | null;
}

interface TokenResponse {
  refresh: string;
  access: string;
  user_details: UserDetails;
}

interface LoginFormProps {
  onLoginSuccess?: (userData: {
    id: number;
    name: string;
    email: string;
  }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mode, setMode] = useState("email");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const BASE_URL = "https://api.legalbooks.in/api/v1";

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const actionParam = urlParams.get("action");
    if (actionParam === "mobile-login") {
      setMode("mobile");
    } else if (actionParam === "forgot-password") {
      setMode("reset");
    } else if (pathname === "/login") {
      setMode("email");
    }
  }, [pathname]);

  const handleLoginSuccess = (userData: UserDetails) => {
    setIsAuthenticated(true);
    if (onLoginSuccess) {
      onLoginSuccess({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      });
    }
    
    if (pathname === "/") {
      router.push('/dashboard');
    } else {
      router.refresh();
    }
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post<TokenResponse>(`${BASE_URL}/token/create`, { email, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user_details", JSON.stringify(response.data.user_details));
      setFeedbackMessage("Login successful!");
      setIsError(false);
      setIsLoading(false);
      handleLoginSuccess(response.data.user_details);
    } catch (error) {
      console.error("Error logging in:", error);
      setFeedbackMessage("Invalid email or password. Please try again.");
      setIsError(true);
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/auth/otp/generate`, {
        entity: mobileNumber,
        entity_type: "mobile",
        request_type: "login"
      });
      setOtpSent(true);
      setFeedbackMessage("OTP sent successfully. Please check your mobile.");
      setIsError(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setFeedbackMessage("Error sending OTP. Please try again.");
      setIsError(true);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");
    try {
      const response = await axios.post(`${BASE_URL}/auth/login/mobile`, {
        entity: mobileNumber,
        otp: otpString
      });
      setOtpVerified(true);
      setFeedbackMessage("OTP verified successfully.");
      setIsError(false);
      
      // Only redirect to dashboard if user is on root path
      if (pathname === "/") {
        router.push('/dashboard');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setFeedbackMessage("Invalid OTP. Please try again.");
      setIsError(true);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setFeedbackMessage("Passwords do not match. Please try again.");
      setIsError(true);
      return;
    }
    try {
      await axios.post(`${BASE_URL}/auth/reset-password`, {
        email,
        password,
        confirm_password: confirmPassword
      });
      setFeedbackMessage("Password reset successfully. Please log in with your new password.");
      setIsError(false);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      setFeedbackMessage("An error occurred while resetting the password. Please try again.");
      setIsError(true);
    }
  };

  const renderEmailLoginForm = () => (
    <>
      <GoogleLoginButton mode={"login"} />

      <button
        className="w-full mb-6 py-3 px-4 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
        onClick={() => {
          if (pathname === "/") {
            router.push("/login?action=mobile-login");
          } else {
            setMode("mobile");
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        Continue with Mobile Number
      </button>

      <div className="flex items-center mb-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm sm:text-base">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-500" />
            ) : (
              <FaEye className="text-gray-500" />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 text-sm sm:text-base"
        >
          Log In
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            if (pathname === "/") {
              router.push("/login?action=forgot-password");
            } else {
              setMode("reset");
            }
          }}
          className="text-black hover:text-green-500 text-sm sm:text-base"
        >
          Forgot your password?
        </button>
      </div>
      <p className="text-sm sm:text-base mt-5 text-center text-gray-600">
        Don't have an account?{" "}
        <Link href="/registration" className="text-green-500 font-semibold hover:text-green-700 transition duration-300">
          Sign Up
        </Link>
      </p>
    </>
  );

  const renderMobileLoginForm = () => (
    <>
      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 text-sm sm:text-base"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="flex justify-between">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 text-sm sm:text-base"
          >
            Verify OTP
          </button>
        </form>
      )}
      {otpVerified && pathname === "/" && (
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full mt-4 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
        >
          Continue to Dashboard
        </button>
      )}
    </>
  );

  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
        />
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <FaEyeSlash className="text-gray-500" />
          ) : (
            <FaEye className="text-gray-500" />
          )}
        </div>
      </div>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
        />
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
        >
          {showConfirmPassword ? (
            <FaEyeSlash className="text-gray-500" />
          ) : (
            <FaEye className="text-gray-500" />
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 text-sm sm:text-base"
      >
        Reset Password
      </button>
    </form>
  );

  return (
    <div className="xl:w-4/12 sm:w-full md:w-full max-w-sm mx-auto px-4 sm:px-6 md:max-w-md lg:max-w-lg xl:max-w-xl mb-6 mt-10">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          {mode === "email" ? "Log In" : mode === "mobile" ? "Mobile Login" : "Reset Password"}
        </h1>

        {feedbackMessage && (
          <div 
            className={`mb-4 p-3 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          >
            {feedbackMessage}
          </div>
        )}

        {mode === "email" && (
          <>
            <GoogleLoginButton mode={"login"} />

            <button
              className="w-full mb-6 py-3 px-4 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
              onClick={() => {
                if (pathname === "/") {
                  router.push("/login?action=mobile-login");
                } else {
                  setMode("mobile");
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Continue with Mobile Number
            </button>

            <div className="flex items-center mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm sm:text-base">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 text-sm sm:text-base ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  if (pathname === "/") {
                    router.push("/login?action=forgot-password");
                  } else {
                    setMode("reset");
                  }
                }}
                className="text-black hover:text-green-500 text-sm sm:text-base"
              >
                Forgot your password?
              </button>
            </div>
            <p className="text-sm sm:text-base mt-5 text-center text-gray-600">
              Don't have an account?{" "}
              <Link href="/registration" className="text-green-500 font-semibold hover:text-green-700 transition duration-300">
                Sign Up
              </Link>
            </p>
          </>
        )}

        {mode === "mobile" && renderMobileLoginForm()}
        {mode === "reset" && renderResetPasswordForm()}

        {(mode === "mobile" || mode === "reset") && pathname === "/login" && (
          <button
            onClick={() => setMode("email")}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800 transition duration-300 text-sm sm:text-base"
          >
            <FaArrowLeft className="mr-2" /> Go back to email login
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginForm;