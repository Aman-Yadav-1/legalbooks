"use client";
import React, { useState, useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import LegalConsultationForm from "@/components/LegalConsultationForm";

export default function Forms() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userDetails = localStorage.getItem("user_details");
      setIsLoggedIn(!!userDetails);
    };

    checkLoginStatus();

    const handleLogout = () => {
      setIsLoggedIn(false);
    };

    window.addEventListener('userLoggedOut', handleLogout);
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('userLoggedOut', handleLogout);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  return (
    <div>
      <div className="flex my-10 justify-center items-center flex-wrap mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl">
        {!isLoggedIn && <LoginForm onLoginSuccess={function (userData: { id: number; name: string; email: string; }): void {
          throw new Error("Function not implemented.");
        } } />}
        <LegalConsultationForm />
      </div>
    </div>
  );
}