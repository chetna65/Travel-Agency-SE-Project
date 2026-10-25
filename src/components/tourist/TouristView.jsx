/**
 * components/tourist/TouristView.jsx
 * Wrapper component for the Tourist role interface.
 * Hosts tabs for Search & Book (Screen 1) and My Bookings (Screen 2).
 */

import { useState } from 'react';
import { HotelSearch } from './HotelSearch.jsx';
import { MyBookings } from './MyBookings.jsx';

export function TouristView({
  hotels,
  bookings,
  onBookingRequested,
  onDbUpdate,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'bookings'

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('search')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition -mb-px ${
            activeTab === 'search'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          🏨 Search & Book
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition -mb-px flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>📋 My Bookings</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
            {bookings.length}
          </span>
        </button>
      </div>

      {/* Active Tab Screen */}
      {activeTab === 'search' ? (
        <HotelSearch
          hotels={hotels}
          onBookingRequested={(booking) => {
            onBookingRequested(booking);
            setActiveTab('bookings'); // auto navigate to bookings view
          }}
        />
      ) : (
        <MyBookings
          bookings={bookings}
          hotels={hotels}
          onUpdate={onDbUpdate}
          showToast={showToast}
        />
      )}
    </div>
  );
}
