'use client'
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FirmRegistration } from '@/UI/registration/FirmRegistration';

function RegisterContent() {
  const [userData, setUserData] = useState({});
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const userDataParam = searchParams.get('userData');
      if (userDataParam) {
        try {
          const parsedUserData = JSON.parse(decodeURIComponent(userDataParam));
          setUserData(parsedUserData);
        } catch (error) {
          console.error('Error parsing userData:', error);
        }
      }
    }
  }, [searchParams]);

  return <FirmRegistration userData={userData} />;
}

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}