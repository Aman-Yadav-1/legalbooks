'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface ApiResponse {
  data?: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };
  msg: string;
  status: boolean;
  status_code: number;
}

const GoogleCallbackContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [userData, setUserData] = useState<ApiResponse['data'] | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!searchParams) {
        console.error('Search params are not available');
        router.push('/login');
        return;
      }

      const code = searchParams.get('code');
      const state = searchParams.get('state') || 'login'; 
      console.log('Query parameters:', { code, state });

      if (!code) {
        console.error('Authorization code is missing');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('https://api.legalbooks.in/api/v1/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, request_type: state }),
        });
    
        const data: ApiResponse = await response.json();
        console.log('API response data:', data);
    
        if (data.status_code === 400) {
          // Don't redirect immediately, wait for potential follow-up response
          console.log('Received 400 status, waiting for follow-up...');
          return;
        }
        if (data.status_code === 200 && data.msg === "You have an account already registered with this email.") {
          setUserData(data.data);
          setShowPrompt(true);
          setLoading(false);
          return;
        }

        if (data.status_code === 200 && state === 'login') {
          // Case 1: Login with existing account
          toast.success(data.msg || 'User logged in successfully.');
          router.push('/dashboard');
        } else if (data.status_code === 400 && data.msg === "You are not registered with this email.") {
          // Case 2: Login with non-existing account
          toast.error(data.msg || 'You are not registered with this email.');
          router.push('/registration');
        } else if (data.status_code === 200 && state === 'register' && data.msg === "You have an account already registered with this email.") {
          // Case 3: Register with existing account
          setUserData(data.data);
          setShowPrompt(true);
          setLoading(false);
          return; // Early return to wait for user action
        } else if (data.status_code === 201 && state === 'firm_register') {
          toast.success(data.msg || 'Email verified successfully');
          if (data.data) {
            router.push(`/firm-registration?userData=${encodeURIComponent(JSON.stringify(data.data))}`);
          } else {
            router.push('/firm-registration');
          }
          if (data.data) {
            router.push(`/registration?userData=${encodeURIComponent(JSON.stringify(data.data))}`);
          } else {
            router.push('/registration');
          }
        } else {
          console.error('Unexpected status code or request type:', data.status_code, state);
          toast.error('An unexpected error occurred');
          router.push('/login');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred during authentication.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  const handleChoice = (choice: 'dashboard' | 'registration') => {
    if (choice === 'dashboard') {
      router.push('/dashboard');
    } else {
      router.push(`/registration?`);
    }
  };

  if (loading) {
    return <div>Processing authentication...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Processing authentication...
        </div>
      ) : showPrompt && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Account Already Exists
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            You have an account already registered with this email. What would you like to do?
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleChoice('dashboard')}
              className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => handleChoice('registration')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Complete Registration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
const GoogleCallbackPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
};
export default GoogleCallbackPage;
