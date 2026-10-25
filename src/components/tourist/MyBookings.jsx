/**
 * components/tourist/MyBookings.jsx
 * Screen 2: My Bookings (Tourist view)
 * Shows the list of tourist bookings with actions: Make Payment, Pay, and Cancel.
 * (Note: The Dev owner confirm helper is removed as Module 2 owner confirms directly).
 */

import { useState } from 'react';
import {
  initiatePayment,
  processPayment,
  cancelBooking,
} from '../../services/touristService.js';
import { StatusBadge } from '../common/Badge.jsx';
import { EmptyState } from '../common/EmptyState.jsx';

export function MyBookings({ bookings, hotels, onUpdate, showToast }) {
  const [payingBookingId, setPayingBookingId] = useState(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Helper to get hotel name by ID
  const getHotelName = (hotelId) => {
    const hotel = hotels.find((h) => h.hotel_id === hotelId);
    return hotel ? hotel.name : `Hotel #${hotelId}`;
  };

  // Format date helper
  const formatDateRange = (inStr, outStr) => {
    try {
      const d1 = new Date(inStr);
      const d2 = new Date(outStr);
      const m1 = d1.toLocaleString('default', { month: 'short' });
      const m2 = d2.toLocaleString('default', { month: 'short' });
      if (m1 === m2) {
        return `${d1.getDate()} to ${d2.getDate()} ${m1}`;
      }
      return `${d1.getDate()} ${m1} to ${d2.getDate()} ${m2}`;
    } catch {
      return `${inStr} to ${outStr}`;
    }
  };

  // Step 1: Tourist clicks "Make payment" on Confirmed booking
  const handleInitiatePayment = (bookingId) => {
    const res = initiatePayment(bookingId);
    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }
    showToast('Payment initiated. Proceed with payment.', 'success');
    onUpdate();
  };

  // Open inline payment modal/box for Payment Pending
  const handleOpenPaymentPrompt = (booking) => {
    setPayingBookingId(booking.booking_id);
    setPaymentAmountInput(String(booking.total_amount));
    setPaymentError('');
  };

  // Step 2: Tourist completes payment
  const handleConfirmPayment = (booking) => {
    const res = processPayment(booking.booking_id, paymentAmountInput);
    if (!res.success) {
      setPaymentError(res.error);
      return;
    }
    setPayingBookingId(null);
    showToast(`Payment of ₹${booking.total_amount.toLocaleString()} successful!`, 'success');
    onUpdate();
  };

  // Tourist cancels booking (V7)
  const handleCancelBooking = (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    const res = cancelBooking(bookingId);
    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }
    showToast('Booking cancelled and room released.', 'success');
    onUpdate();
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          My Bookings
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} total
        </span>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'Confirmed';
            const isPaymentPending = booking.status === 'Payment Pending';
            const isRequested = booking.status === 'Requested';
            const canCancel = isRequested || isConfirmed || isPaymentPending;
            const isPayingThis = payingBookingId === booking.booking_id;

            return (
              <div
                key={booking.booking_id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
              >
                {/* Booking Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                      #{booking.booking_id}
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {getHotelName(booking.hotel_id)}
                    </span>
                    <StatusBadge status={booking.status} />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {booking.guest_name}
                    </span>{' '}
                    · {formatDateRange(booking.check_in, booking.check_out)} · {booking.nights}{' '}
                    {booking.nights === 1 ? 'night' : 'nights'} ·{' '}
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{booking.total_amount.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Actions & Inline Payment */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* Confirmed -> Make Payment */}
                  {isConfirmed && (
                    <button
                      onClick={() => handleInitiatePayment(booking.booking_id)}
                      className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                    >
                      Make payment
                    </button>
                  )}

                  {/* Payment Pending -> Pay ₹X */}
                  {isPaymentPending && !isPayingThis && (
                    <button
                      onClick={() => handleOpenPaymentPrompt(booking)}
                      className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition"
                    >
                      Pay ₹{booking.total_amount.toLocaleString()}
                    </button>
                  )}

                  {/* Payment Pending inline form */}
                  {isPaymentPending && isPayingThis && (
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-left">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={paymentAmountInput}
                          onChange={(e) => setPaymentAmountInput(e.target.value)}
                          placeholder="Amount"
                          className="w-24 px-2 py-1 text-xs rounded border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900"
                        />
                        <button
                          onClick={() => handleConfirmPayment(booking)}
                          className="py-1 px-2.5 rounded text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700"
                        >
                          Confirm Pay
                        </button>
                        <button
                          onClick={() => setPayingBookingId(null)}
                          className="py-1 px-2 rounded text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          ✕
                        </button>
                      </div>
                      {paymentError && (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                          {paymentError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Cancel Booking */}
                  {canCancel && (
                    <button
                      onClick={() => handleCancelBooking(booking.booking_id)}
                      className="py-1.5 px-3 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No bookings yet"
          description="Find a hotel and book your stay to see your reservations here."
        />
      )}
    </div>
  );
}
