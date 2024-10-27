import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
}

interface UserDetails {
  id: number;
  email: string;
  name: string;
  role: string;
  role_id: number;
  profile_picture: string | null;
}

interface NotificationsProps {
  userDetails: UserDetails | null;
}

const Notifications: React.FC<NotificationsProps> = ({ userDetails }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [previousNotifications, setPreviousNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;
  const notificationRef = useRef<HTMLDivElement>(null);
  const pollingInterval = 30000; // Poll every 30 seconds
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const startPolling = () => {
      if (userDetails) {
        fetchNotifications();
        intervalIdRef.current = setInterval(fetchNotifications, pollingInterval);
      }
    };

    startPolling();

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [userDetails]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check for new notifications
    if (previousNotifications.length > 0) {
      const newNotifications = notifications.filter(
        notification => !previousNotifications.some(prev => prev.id === notification.id)
      );

      // Show toast for each new notification
      newNotifications.forEach(notification => {
        toast(notification.message, {
          duration: 5000,
          position: 'top-right',
          icon: '🔔',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      });
    }

    setPreviousNotifications(notifications);
  }, [notifications]);

  const fetchNotifications = async (retryCount = 0) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setError('No access token found. Please log in again.');
        return;
      }

      const response = await fetch('https://api.legalbooks.in/api/v1/notifications/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.results);
        setUnreadCount(data.results.filter((n: Notification) => !n.read).length);
        setError(null);
      } else if (response.status === 403) {
        if (retryCount < 3) {
          console.log('Attempting to refresh token...');
          await refreshToken();
          fetchNotifications(retryCount + 1);
        } else {
          setError('Unable to fetch notifications. Please try logging in again.');
        }
      } else {
        setError(`Error fetching notifications: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        setError('No refresh token found. Please log in again.');
        return;
      }

      const response = await fetch('https://api.legalbooks.in/api/v1/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
      } else {
        setError('Failed to refresh token. Please log in again.');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      setError('An error occurred while refreshing your session. Please log in again.');
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setError('No access token found. Please log in again.');
        return;
      }

      const response = await fetch(`https://api.legalbooks.in/api/v1/notifications/${id}/read/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => prev - 1);
      } else if (response.status === 403) {
        await refreshToken();
        markAsRead(id);
      } else {
        setError(`Error marking notification as read: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white focus:outline-none focus:text-white"
      >
        <FaBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-2">
            {error ? (
              <p className="px-4 py-2 text-sm text-red-500">{error}</p>
            ) : currentNotifications.length > 0 ? (
              <>
                {currentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-2 hover:bg-gray-100 ${notification.read ? 'opacity-50' : ''}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <p className="text-sm text-black">{notification.message}</p>
                    <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-blue-500 text-xs hover:text-blue-700 disabled:text-gray-400"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-xs text-black">
                    Page {currentPage} of {Math.ceil(notifications.length / notificationsPerPage)}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(notifications.length / notificationsPerPage)}
                    className="text-blue-500 text-xs hover:text-blue-700 disabled:text-gray-400"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </>
            ) : (
              <p className="px-4 py-2 text-sm text-black">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;