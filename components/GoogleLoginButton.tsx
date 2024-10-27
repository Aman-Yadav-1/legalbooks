"use client";

import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';

interface GoogleAuthButtonProps {
  mode: 'login' | 'register';
}

const GoogleLoginButton: React.FC<GoogleAuthButtonProps> = ({ mode }) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const redirectUri = encodeURIComponent("https://legal-books.vercel.app/api/auth/callback/google");
    const scopes = encodeURIComponent("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid");
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=384283838773-n75keilq31fi11ja15vb0gmrja2kol61.apps.googleusercontent.com&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&state=${mode}`;

    window.location.href = googleAuthUrl;
  };

  if (!isClient) {
    return null;
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full border-2 border-black mb-4 py-3 px-4 rounded-md flex items-center justify-center bg-white hover:bg-gray-100 transition duration-300 shadow-sm"
      disabled={isLoading}
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      {isLoading ? `${mode === 'login' ? 'Logging in' : 'Registering'}...` : `Continue with Google`}
    </button>
  );
};

export default GoogleLoginButton;
