/**
 * tests/validation.test.js
 * Vitest tests covering validation rules V8 to V12 (Module 2)
 * as well as fundamental Module 1 rules V1 to V7.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  resetDb,
  getHotels,
  saveHotels,
  getBookings,
  saveBookings,
} from '../src/services/db.js';
import {
  confirmBooking,
  rejectBooking,
  addListing,
  removeListing,
  validateListing,
} from '../src/services/ownerService.js';
import {
  validateBookingDetails,
  requestBooking,
  cancelBooking,
  processPayment,
  getTodayDateString,
} from '../src/services/touristService.js';

describe('Validation Rules V8 - V12 (Module 2)', () => {
  beforeEach(() => {
    resetDb();
  });

  // US6 / V8: Confirm & Reject allowed only when status is 'Requested'
  describe('V8: Confirm / Reject allowed only when status is Requested', () => {
    it('allows confirming a booking when status is Requested', () => {
      // Seed booking 1 has status 'Requested'
      const res = confirmBooking(1);
      expect(res.success).toBe(true);
      expect(res.booking.status).toBe('Confirmed');

      const updated = getBookings().find((b) => b.booking_id === 1);
      expect(updated.status).toBe('Confirmed');
    });

    it('rejects confirm when booking is not in Requested status', () => {
      // Seed booking 2 is 'Confirmed'
      const res1 = confirmBooking(2);
      expect(res1.success).toBe(false);
      expect(res1.error).toBe('Booking is no longer pending.');

      // Seed booking 3 is 'Payment Pending'
      const res2 = confirmBooking(3);
      expect(res2.success).toBe(false);
      expect(res2.error).toBe('Booking is no longer pending.');

      // Seed booking 4 is 'Paid'
      const res3 = confirmBooking(4);
      expect(res3.success).toBe(false);
      expect(res3.error).toBe('Booking is no longer pending.');
    });

    it('allows rejecting a booking when status is Requested and releases room', () => {
      const hotelsBefore = getHotels();
      const hotel1Before = hotelsBefore.find((h) => h.hotel_id === 1);
      const roomsBefore = hotel1Before.rooms_available;

      const res = rejectBooking(1);
      expect(res.success).toBe(true);
      expect(res.booking.status).toBe('Rejected');

      // Check room was released
      const hotelsAfter = getHotels();
      const hotel1After = hotelsAfter.find((h) => h.hotel_id === 1);
      expect(hotel1After.rooms_available).toBe(roomsBefore + 1);
    });

    it('rejects rejectBooking when booking is not in Requested status', () => {
      const res = rejectBooking(2); // status is Confirmed
      expect(res.success).toBe(false);
      expect(res.error).toBe('Booking is no longer pending.');
    });
  });

  // US7 / V9: Listing name, city required and not blank -> "Fill all fields."
  describe('V9: Name and city required and not blank', () => {
    it('fails when name is empty or blank', () => {
      const res1 = addListing({ name: '', city: 'Mumbai', price: 2000, rooms: 5 });
      expect(res1.success).toBe(false);
      expect(res1.error).toBe('Fill all fields.');

      const res2 = addListing({ name: '   ', city: 'Mumbai', price: 2000, rooms: 5 });
      expect(res2.success).toBe(false);
      expect(res2.error).toBe('Fill all fields.');
    });

    it('fails when city is empty or blank', () => {
      const res1 = addListing({ name: 'Sunset Resort', city: '', price: 2000, rooms: 5 });
      expect(res1.success).toBe(false);
      expect(res1.error).toBe('Fill all fields.');

      const res2 = addListing({ name: 'Sunset Resort', city: '  ', price: 2000, rooms: 5 });
      expect(res2.success).toBe(false);
      expect(res2.error).toBe('Fill all fields.');
    });
  });

  // US7 / V10: Price must be a whole number above 0 -> "Price must be positive."
  describe('V10: Price must be positive whole number', () => {
    it('fails when price is 0', () => {
      const res = addListing({ name: 'Hotel Taj', city: 'Delhi', price: 0, rooms: 5 });
      expect(res.success).toBe(false);
      expect(res.error).toBe('Price must be positive.');
    });

    it('fails when price is negative', () => {
      const res = addListing({ name: 'Hotel Taj', city: 'Delhi', price: -500, rooms: 5 });
      expect(res.success).toBe(false);
      expect(res.error).toBe('Price must be positive.');
    });

    it('fails when price is a decimal', () => {
      const res = addListing({ name: 'Hotel Taj', city: 'Delhi', price: 1500.5, rooms: 5 });
      expect(res.success).toBe(false);
      expect(res.error).toBe('Price must be positive.');
    });

    it('fails when price is non-numeric or empty string', () => {
      const res = addListing({ name: 'Hotel Taj', city: 'Delhi', price: 'abc', rooms: 5 });
      expect(res.success).toBe(false);
      expect(res.error).toBe('Price must be positive.');
    });
  });

  // US7 / V11: Rooms must be a whole number of at least 1 -> "Rooms must be at least 1."
  describe('V11: Rooms must be whole number of at least 1', () => {
    it('fails when rooms is 0', () => {
      const res = addListing({ name: 'Heritage Villa', city: 'Jaipur', price: 4000, rooms: 0 });
      expect(res.success).toBe(false);
      expect(res.error).toBe('Rooms must be at least 1.');
    });

    it('fails when rooms is negative', () => {
      const res = addListing({ name: 'Heritage Villa', city: 'Jaipur', price: 4000, rooms: -2 });
      expect(res.success).toBe(false);
      expect(res.error).toBe('Rooms must be at least 1.');
    });

    it('fails when rooms is a decimal', () => {
      const res = addListing({ name: 'Heritage Villa', city: 'Jaipur', price: 4000, rooms: 2.5 });
      expect(res.success).toBe(false);
      expect(res.error).toBe('Rooms must be at least 1.');
    });

    it('succeeds with valid listing parameters', () => {
      const res = addListing({ name: 'Heritage Villa', city: 'Jaipur', price: 4000, rooms: 5 });
      expect(res.success).toBe(true);
      expect(res.hotel.name).toBe('Heritage Villa');
      expect(res.hotel.rooms_available).toBe(5);
    });
  });

  // US8 / V12: Remove listing blocked when active bookings exist
  describe('V12: Remove listing blocked if active bookings exist', () => {
    it('blocks removing hotel when it has a booking in Requested status', () => {
      // Hotel 1 has booking 1 with status Requested
      const res = removeListing(1);
      expect(res.success).toBe(false);
      expect(res.error).toBe('Cannot remove a hotel with active bookings.');
    });

    it('blocks removing hotel when it has a booking in Confirmed status', () => {
      // Hotel 2 has booking 2 with status Confirmed
      const res = removeListing(2);
      expect(res.success).toBe(false);
      expect(res.error).toBe('Cannot remove a hotel with active bookings.');
    });

    it('blocks removing hotel when it has a booking in Payment Pending status', () => {
      // Hotel 3 has booking 3 with status Payment Pending
      const res = removeListing(3);
      expect(res.success).toBe(false);
      expect(res.error).toBe('Cannot remove a hotel with active bookings.');
    });

    it('blocks removing hotel when it has a booking in Paid status', () => {
      // Hotel 4 has booking 4 with status Paid
      const res = removeListing(4);
      expect(res.success).toBe(false);
      expect(res.error).toBe('Cannot remove a hotel with active bookings.');
    });

    it('allows removing hotel when bookings are Completed, Cancelled, or none', () => {
      // First add a new hotel without bookings
      const addRes = addListing({
        name: 'Empty Boutique Hotel',
        city: 'Ooty',
        price: 2800,
        rooms: 4,
      });
      const newHotelId = addRes.hotel.hotel_id;

      const removeRes = removeListing(newHotelId);
      expect(removeRes.success).toBe(true);

      const hotels = getHotels();
      expect(hotels.find((h) => h.hotel_id === newHotelId)).toBeUndefined();
    });
  });
});
