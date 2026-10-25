/**
 * components/tourist/BookingForm.jsx
 * Booking form attached to a hotel card.
 * Enforces V1 to V5 with inline error messages.
 */

import { useState } from 'react';
import {
  calculateNights,
  getTodayDateString,
  requestBooking,
} from '../../services/touristService.js';

export function BookingForm({ hotel, onClose, onSuccess }) {
  const todayStr = getTodayDateString();

  const [guestName, setGuestName] = useState('');
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const nights = calculateNights(checkIn, checkOut);
  const total = nights * hotel.price_per_night;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    const res = requestBooking({
      guestName,
      checkIn,
      checkOut,
      guests,
      hotelId: hotel.hotel_id,
    });

    if (!res.success) {
      if (res.errors) {
        setErrors(res.errors);
      }
      setGeneralError(res.error || 'Failed to submit booking request.');
      return;
    }

    onSuccess(res.booking);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left transition"
    >
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
        Book stay at {hotel.name}
      </h4>

      {generalError && (
        <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          {generalError}
        </div>
      )}

      <div className="space-y-3">
        {/* Guest Name (V1) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Guest name
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="e.g. Asha"
            className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.guestName
                ? 'border-rose-400 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          />
          {errors.guestName && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.guestName}
            </p>
          )}
        </div>

        {/* Check-in & Check-out (V2, V3) */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.checkIn
                  ? 'border-rose-400 dark:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.checkIn && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.checkIn}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.checkOut
                  ? 'border-rose-400 dark:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.checkOut && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.checkOut}
              </p>
            )}
          </div>
        </div>

        {/* Guests selector (V4) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Guests (1 - 6)
          </label>
          <input
            type="number"
            min="1"
            max="6"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.guests
                ? 'border-rose-400 dark:border-rose-500'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          />
          {errors.guests && (
            <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.guests}
            </p>
          )}
        </div>

        {/* Price & Summary */}
        {nights > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>
              ₹{hotel.price_per_night.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              Total: ₹{total.toLocaleString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            Request booking
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-3 text-xs sm:text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
