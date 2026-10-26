/**
 * components/owner/BookingRequests.jsx
 * Screen 3: Booking Requests (Hotel Owner)
 * Implements US6 (confirm/reject pending bookings, V8) and US9 (mark paid bookings completed).
 */

import {
  getPendingBookings,
  getPaidBookings,
  confirmBooking,
  rejectBooking,
  markBookingCompleted,
} from '../../services/ownerService.js';
import { StatusBadge } from '../common/Badge.jsx';
import { EmptyState } from '../common/EmptyState.jsx';

export function BookingRequests({ bookings, hotels, onUpdate, showToast }) {
  const pendingBookings = getPendingBookings(bookings);
  const paidBookings = getPaidBookings(bookings);

  // Helper to get hotel name
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

  // US6: Confirm booking (V8)
  const handleConfirm = (bookingId) => {
    const res = confirmBooking(bookingId);
    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }
    showToast(`Booking #${bookingId} confirmed successfully!`, 'success');
    onUpdate();
  };

  // US6: Reject booking (V8)
  const handleReject = (bookingId) => {
    const res = rejectBooking(bookingId);
    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }
    showToast(`Booking #${bookingId} rejected and room released.`, 'success');
    onUpdate();
  };

  // US9: Mark completed
  const handleMarkCompleted = (bookingId) => {
    const res = markBookingCompleted(bookingId);
    if (!res.success) {
      showToast(res.error, 'error');
      return;
    }
    showToast(`Booking #${bookingId} marked as completed.`, 'success');
    onUpdate();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* SECTION 1: Pending Booking Requests */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Pending Requests</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-extrabold">
                {pendingBookings.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Confirm or reject incoming tourist requests (status Requested).
            </p>
          </div>
        </div>

        {pendingBookings.length > 0 ? (
          <div className="space-y-3">
            {pendingBookings.map((b) => (
              <div
                key={b.booking_id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-300 dark:hover:border-slate-600"
              >
                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                      #{b.booking_id}
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {getHotelName(b.hotel_id)}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {b.guest_name}
                    </span>{' '}
                    · {b.guests} {b.guests === 1 ? 'guest' : 'guests'} ·{' '}
                    {formatDateRange(b.check_in, b.check_out)} ·{' '}
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{b.total_amount.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Actions: Confirm / Reject */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleConfirm(b.booking_id)}
                    className="flex-1 sm:flex-none py-1.5 px-3.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                  >
                    Confirm booking
                  </button>
                  <button
                    onClick={() => handleReject(b.booking_id)}
                    className="flex-1 sm:flex-none py-1.5 px-3.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition"
                  >
                    Reject booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No pending requests"
            description="When a tourist requests a room, it will appear here for your confirmation."
          />
        )}
      </section>

      {/* SECTION 2: Paid Bookings (US9) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Paid Bookings</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold">
                {paidBookings.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completed payment received. Mark bookings completed after guest checkout.
            </p>
          </div>
        </div>

        {paidBookings.length > 0 ? (
          <div className="space-y-3">
            {paidBookings.map((b) => (
              <div
                key={b.booking_id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
              >
                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                      #{b.booking_id}
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {getHotelName(b.hotel_id)}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {b.guest_name}
                    </span>{' '}
                    · {formatDateRange(b.check_in, b.check_out)} ·{' '}
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{b.total_amount.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Action: Mark Completed */}
                <button
                  onClick={() => handleMarkCompleted(b.booking_id)}
                  className="py-1.5 px-3.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                >
                  Mark completed
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No paid bookings"
            description="Bookings paid by tourists will be listed here ready to be completed."
          />
        )}
      </section>
    </div>
  );
}
