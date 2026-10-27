/**
 * App.jsx
 * Main application component for the Travel Agency System.
 * Hosts role switching between Tourist (Module 1) and Hotel Owner (Module 2),
 * global dark mode state, toasts, and real-time synchronization with localStorage db.
 */

import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/common/Header.jsx';
import { Toast } from './components/common/Toast.jsx';
import { TouristView } from './components/tourist/TouristView.jsx';
import { OwnerView } from './components/owner/OwnerView.jsx';
import { getHotels, getBookings, resetDb } from './services/db.js';

export default function App() {
  // Role switcher state (Tourist | Hotel Owner) without router library
  const [activeRole, setActiveRole] = useState('tourist');

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('tas_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Database snapshot state
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('tas_dark_mode', String(darkMode));
    } catch (e) {
      // ignore
    }
  }, [darkMode]);

  // Synchronize state with localStorage database
  const refreshDb = useCallback(() => {
    setHotels(getHotels());
    setBookings(getBookings());
  }, []);

  // Initial load
  useEffect(() => {
    refreshDb();
  }, [refreshDb]);

  // Toast helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Reset database handler (kept as required)
  const handleResetData = () => {
    if (window.confirm('Reset all hotels and bookings back to initial seeds?')) {
      resetDb();
      refreshDb();
      showToast('Database reset to initial seed data.', 'success');
    }
  };

  // Tourist requested a new booking
  const handleBookingRequested = (newBooking) => {
    refreshDb();
    showToast(
      `Booking request #${newBooking.booking_id} submitted! Status: Requested.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Header with Role Switcher */}
      <Header
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onResetData={handleResetData}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeRole === 'tourist' ? (
          <TouristView
            hotels={hotels}
            bookings={bookings}
            onBookingRequested={handleBookingRequested}
            onDbUpdate={refreshDb}
            showToast={showToast}
          />
        ) : (
          <OwnerView
            hotels={hotels}
            bookings={bookings}
            onDbUpdate={refreshDb}
            showToast={showToast}
          />
        )}
      </main>

      {/* Toast Notification Banner */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        Travel Agency System · React + Tailwind + Vite · Modules 1 & 2
      </footer>
    </div>
  );
}
