/**
 * components/tourist/HotelCard.jsx
 * Hotel card displaying hotel details, room count, price,
 * and toggling the booking form.
 */

import { useState } from 'react';
import { BookingForm } from './BookingForm.jsx';

export function HotelCard({ hotel, onBookingRequested }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const isSoldOut = hotel.rooms_available <= 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header: Title & City */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {hotel.name}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              📍 {hotel.city}
            </p>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              isSoldOut
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {isSoldOut ? 'Sold out' : `${hotel.rooms_available} rooms left`}
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            ₹{hotel.price_per_night.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/ night</span>
        </div>
      </div>

      {/* Booking Form or Toggle Button */}
      <div className="mt-4">
        {isBookingOpen ? (
          <BookingForm
            hotel={hotel}
            onClose={() => setIsBookingOpen(false)}
            onSuccess={(booking) => {
              setIsBookingOpen(false);
              onBookingRequested(booking);
            }}
          />
        ) : (
          <button
            onClick={() => setIsBookingOpen(true)}
            disabled={isSoldOut}
            className={`w-full py-2 px-4 rounded-xl text-sm font-semibold transition ${
              isSoldOut
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20'
            }`}
          >
            {isSoldOut ? 'No rooms available' : 'Book room'}
          </button>
        )}
      </div>
    </div>
  );
}
