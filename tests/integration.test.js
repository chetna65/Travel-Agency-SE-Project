/**
 * tests/integration.test.js
 * Vitest tests covering the end-to-end integration flow:
 * Tourist request -> Owner confirm -> Tourist payment -> Owner mark completed.
 * Also tests newly added listings appearing in tourist search.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetDb,
  getHotels,
  getBookings,
} from '../src/services/db.js';
import {
  requestBooking,
  initiatePayment,
  processPayment,
  searchHotels,
} from '../src/services/touristService.js';
import {
  confirmBooking,
  markBookingCompleted,
  addListing,
  getPendingBookings,
} from '../src/services/ownerService.js';

describe('Integration Flow: Tourist & Hotel Owner', () => {
  beforeEach(() => {
    resetDb();
  });

  it('completes the full lifecycle: tourist request -> owner confirm -> tourist payment -> owner completed', () => {
    // ----------------------------------------------------
    // STEP 1: Tourist requests a booking at Sea Breeze Resort (hotel_id: 1)
    // ----------------------------------------------------
    const hotelsBefore = getHotels();
    const hotel1Before = hotelsBefore.find((h) => h.hotel_id === 1);
    const roomsBefore = hotel1Before.rooms_available;

    const requestRes = requestBooking({
      guestName: 'Ananya Sharma',
      checkIn: '2026-12-10',
      checkOut: '2026-12-13',
      guests: 2,
      hotelId: 1,
    });

    expect(requestRes.success).toBe(true);
    const booking = requestRes.booking;
    expect(booking.status).toBe('Requested');
    expect(booking.nights).toBe(3);
    expect(booking.total_amount).toBe(3 * 4200);

    // Hotel's available rooms should have decreased by 1
    const hotel1AfterRequest = getHotels().find((h) => h.hotel_id === 1);
    expect(hotel1AfterRequest.rooms_available).toBe(roomsBefore - 1);

    // Booking appears immediately in the owner's pending requests list
    const pendingList = getPendingBookings(getBookings());
    const foundPending = pendingList.find((b) => b.booking_id === booking.booking_id);
    expect(foundPending).toBeDefined();
    expect(foundPending.guest_name).toBe('Ananya Sharma');

    // ----------------------------------------------------
    // STEP 2: Owner confirms the booking (Requested -> Confirmed)
    // ----------------------------------------------------
    const confirmRes = confirmBooking(booking.booking_id);
    expect(confirmRes.success).toBe(true);
    expect(confirmRes.booking.status).toBe('Confirmed');

    // In tourist's view, the status is now Confirmed
    const touristBookingAfterConfirm = getBookings().find(
      (b) => b.booking_id === booking.booking_id
    );
    expect(touristBookingAfterConfirm.status).toBe('Confirmed');

    // ----------------------------------------------------
    // STEP 3: Tourist initiates and completes payment (Confirmed -> Payment Pending -> Paid)
    // ----------------------------------------------------
    const initPayRes = initiatePayment(booking.booking_id);
    expect(initPayRes.success).toBe(true);
    expect(initPayRes.booking.status).toBe('Payment Pending');

    const payRes = processPayment(booking.booking_id, booking.total_amount);
    expect(payRes.success).toBe(true);
    expect(payRes.booking.status).toBe('Paid');

    // In database, status is Paid
    const bookingAfterPay = getBookings().find(
      (b) => b.booking_id === booking.booking_id
    );
    expect(bookingAfterPay.status).toBe('Paid');

    // ----------------------------------------------------
    // STEP 4: Owner sees the paid booking and marks it Completed (Paid -> Completed)
    // ----------------------------------------------------
    const completeRes = markBookingCompleted(booking.booking_id);
    expect(completeRes.success).toBe(true);
    expect(completeRes.booking.status).toBe('Completed');

    // Final database state check
    const finalBooking = getBookings().find(
      (b) => b.booking_id === booking.booking_id
    );
    expect(finalBooking.status).toBe('Completed');
  });

  it('newly added owner listing immediately appears in tourist hotel search and can be booked', () => {
    // Owner adds a new listing
    const addRes = addListing({
      name: 'Shimla Pine Resort',
      city: 'Shimla',
      price: 4500,
      rooms: 6,
    });
    expect(addRes.success).toBe(true);
    const newHotelId = addRes.hotel.hotel_id;

    // Tourist searches for "Shimla"
    const currentHotels = getHotels();
    const searchResults = searchHotels(currentHotels, { query: 'Shimla' });
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].name).toBe('Shimla Pine Resort');
    expect(searchResults[0].rooms_available).toBe(6);

    // Tourist books the new hotel
    const bookingRes = requestBooking({
      guestName: 'Vikram',
      checkIn: '2026-11-25',
      checkOut: '2026-11-27',
      guests: 2,
      hotelId: newHotelId,
    });
    expect(bookingRes.success).toBe(true);

    // Verify rooms decremented from 6 to 5
    const updatedHotel = getHotels().find((h) => h.hotel_id === newHotelId);
    expect(updatedHotel.rooms_available).toBe(5);
  });
});
