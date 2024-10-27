'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FaCalendarCheck, 
  FaBars,
  FaUserCircle,
  FaSignOutAlt
} from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { BsPersonPlusFill } from "react-icons/bs";
import { IoDocumentLock } from "react-icons/io5";
import { AiOutlineDollar } from "react-icons/ai";
import { RiAiGenerate  } from "react-icons/ri";

import Profile from './components/Profile';
import GenerateDocument from './components/GenerateDocument';
import MyDocuments from './components/MyDocuments';
import Leads from './components/Leads';
import MyConsultations from './components/MyConsultations';
import Payments from './components/Payments';
import Notifications from './components/Notifications';

interface UserDetails {
  id: number;
  email: string;
  name: string;
  role: string;
  role_id: number;
  profile_picture: string | null;
}

interface NavItem {
  icon: React.ReactNode;
  text: string;
  component: React.ComponentType<{ userDetails: UserDetails | null }>;
}

interface DashboardOverviewProps {
  userDetails: UserDetails | null;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState<React.ReactNode | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');
      const storedUserDetails = localStorage.getItem('user_details');

      if (!accessToken || !storedUserDetails) {
        toast.error('Please log in to access the dashboard', {
          duration: 3000,
          position: 'top-center',
        });
        router.push('/login');
        return false;
      }

      setUserDetails(JSON.parse(storedUserDetails));
      return true;
    };

    const isAuthenticated = checkAuth();
    
    if (isAuthenticated) {
      document.body.classList.add('overflow-hidden');
      const navbar = document.querySelector('nav');
      const footer = document.querySelector('footer');
      if (navbar) navbar.classList.add('hidden');
      if (footer) footer.classList.add('hidden');
      
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsProfileDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.body.classList.remove('overflow-hidden');
        if (navbar) navbar.classList.remove('hidden');
        if (footer) footer.classList.remove('hidden');
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [router]);

  useEffect(() => {
    if (userDetails) {
      setActiveComponent(<DashboardOverview userDetails={userDetails} />);
    }
  }, [userDetails]);

  // If no user details, don't render anything
  if (!userDetails) {
    return (
      <>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              padding: '16px',
            },
          }}
        />
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://api.legalbooks.in/api/v1/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (response.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_details');
        setUserDetails(null);
        router.push('/');
      } else {
        console.error('Logout failed:', response.status, response.statusText);
        const errorData = await response.text();
        console.error('Error details:', errorData);
        toast.error('Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const renderComponent = (Component: React.ComponentType<{ userDetails: UserDetails | null }>, index: number) => {
    setActiveComponent(<Component userDetails={userDetails} />);
    setSelectedItem(index);
    setIsSidebarOpen(false);
  };

  const navItems: NavItem[] = [
    { icon: <CgProfile />, text: 'My Profile', component: Profile },
    { icon: <RiAiGenerate />, text: 'Generate Document', component: GenerateDocument },
    { icon: <IoDocumentLock />, text: 'My Documents', component: MyDocuments },
    { icon: <BsPersonPlusFill />, text: 'Leads', component: Leads },
    { icon: <FaCalendarCheck />, text: 'My Consultations', component: MyConsultations },
    { icon: <AiOutlineDollar />, text: 'Payments', component: Payments },
  ];

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
          },
        }}
      />
      <header className="bg-blue-700 text-white p-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2 lg:hidden"
          >
            <FaBars />
          </button>
          <a href='/' className="text-xl font-bold">LegalBooks</a>
        </div>
        <input 
          type="text" 
          placeholder="Search ..." 
          className="hidden md:block w-1/2 p-1.5 rounded text-black"
        />
        <div className="flex items-center space-x-4">
          <Notifications userDetails={userDetails} />
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-blue-700 overflow-hidden"
            >
              {userDetails.profile_picture ? (
                <img src={userDetails.profile_picture} alt={userDetails.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(userDetails.name)
              )}
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                <button 
                  onClick={() => {
                    renderComponent(Profile, 0);
                    setIsProfileDropdownOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaUserCircle className="inline-block mr-2" />
                  Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FaSignOutAlt className="inline-block mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`bg-gray-800 text-white w-64 p-4 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static absolute inset-y-0 left-0 z-20`}>
          <div className="flex items-center space-x-2 mb-6">
            <div className="rounded-full bg-gray-600 w-8 h-8 flex items-center justify-center overflow-hidden">
              {userDetails.profile_picture ? (
                <img src={userDetails.profile_picture} alt={userDetails.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(userDetails.name)
              )}
            </div>
            <span className='text-sm'>{userDetails.name} Workspace</span>
          </div>

          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <button 
                  onClick={() => renderComponent(item.component, index)}
                  className={`flex items-center space-x-2 p-1.5 rounded hover:bg-gray-700 w-full text-left ${
                    selectedItem === index ? 'bg-gray-700' : ''
                  }`}
                >
                  {item.icon}
                  <span className='text-sm'>{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div>
            {activeComponent}
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ userDetails }) => (
  <div className='bg-white shadow rounded p-4 md:p-6'>
    <h1 className="text-xl font-bold mb-4">
      Welcome back, {userDetails?.name}
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard title="Active Cases" value="5"/>
      <DashboardCard title="Pending Documents" value="3" />
      <DashboardCard title="Upcoming Consultations" value="2" />
    </div>
  </div>
);

interface DashboardCardProps {
  title: string;
  value: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => (
  <div className="bg-gray-100 p-4 rounded shadow">
    <h2 className="text-sm font-semibold mb-2">{title}</h2>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;