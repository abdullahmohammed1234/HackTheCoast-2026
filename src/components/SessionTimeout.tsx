'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SESSION_TIMEOUT_WARNING = 2 * 60 * 1000; // Show warning 2 minutes before timeout
const SESSION_CHECK_INTERVAL = 30000; // Check every 30 seconds

export default function SessionTimeout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown

  const extendSession = useCallback(() => {
    // Update the session activity timestamp
    localStorage.setItem('sessionActivity', Date.now().toString());
    setShowWarning(false);
    setCountdown(120);
    toast.success('Session extended');
  }, []);

  const logout = useCallback(() => {
    // Clear session and redirect to login
    localStorage.removeItem('sessionActivity');
    router.push('/login?expired=true');
    toast.error('Session expired. Please log in again.');
  }, [router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const updateActivity = () => {
      localStorage.setItem('sessionActivity', Date.now().toString());
    };

    // Set initial activity time
    localStorage.setItem('sessionActivity', Date.now().toString());

    // Listen for user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // Check interval
    const checkInterval = setInterval(() => {
      const lastActivity = parseInt(localStorage.getItem('sessionActivity') || '0', 10);
      const timeSinceActivity = Date.now() - lastActivity;
      
      // Total session timeout is 15 minutes (900000ms)
      const totalTimeout = 15 * 60 * 1000;
      const remainingTime = totalTimeout - timeSinceActivity;

      if (remainingTime <= SESSION_TIMEOUT_WARNING && remainingTime > 0) {
        setShowWarning(true);
        setCountdown(Math.floor(remainingTime / 1000));
      } else if (remainingTime <= 0) {
        logout();
      }
    }, SESSION_CHECK_INTERVAL);

    // Countdown timer for the warning modal
    const countdownInterval = setInterval(() => {
      if (showWarning) {
        setCountdown((prev) => {
          if (prev <= 1) {
            logout();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(checkInterval);
      clearInterval(countdownInterval);
    };
  }, [status, showWarning, logout]);

  if (status !== 'authenticated' || !showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Session Expiring</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your session will expire in <span className="font-semibold text-red-600">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span> minutes due to inactivity.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Click "Extend Session" to stay logged in, or you will be automatically logged out.
          </p>
          <div className="flex gap-3">
            <button
              onClick={logout}
              className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Log Out
            </button>
            <button
              onClick={extendSession}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Extend Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
