/**
 * components/owner/OwnerView.jsx
 * Wrapper component for the Hotel Owner role interface.
 * Hosts tabs for Booking Requests (Screen 3) and Manage Listings (Screen 4).
 */

import { useState } from 'react';
import { BookingRequests } from './BookingRequests.jsx';
import { ManageListings } from './ManageListings.jsx';
import { getPendingBookings } from '../../services/ownerService.js';

export function OwnerView({
  hotels,
  bookings,
  onDbUpdate,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'listings'
  const pendingCount = getPendingBookings(bookings).length;

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition -mb-px flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>🛎️ Booking Requests</span>
          {pendingCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition -mb-px flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>🏨 Manage Listings</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
            {hotels.length}
          </span>
        </button>
      </div>

      {/* Active Tab Screen */}
      {activeTab === 'requests' ? (
        <BookingRequests
          bookings={bookings}
          hotels={hotels}
          onUpdate={onDbUpdate}
          showToast={showToast}
        />
      ) : (
        <ManageListings
          hotels={hotels}
          onUpdate={onDbUpdate}
          showToast={showToast}
        />
      )}
    </div>
  );
}
