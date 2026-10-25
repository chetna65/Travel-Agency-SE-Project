/**
 * services/touristService.js
 * Pure functions for Module 1: Hotel Search and Booking (Tourist role).
 * Enforces validation rules V1 through V7.
 */

import { getHotels, saveHotels, getBookings, saveBookings } from './db.js';

/**
 * Filter hotels by search query (name or city) and optional maxPrice.
 * Pure function: takes hotels array and filter options, returns filtered array.
 */
export function searchHotels(hotels = [], { query = '', maxPrice = '' } = {}) {
  const q = query.trim().toLowerCase();
  const max = maxPrice !== '' ? Number(maxPrice) : null;

  return hotels.filter((hotel) => {
    const matchesQuery =
      !q ||
      hotel.name.toLowerCase().includes(q) ||
      hotel.city.toLowerCase().includes(q);

    const matchesPrice = max === null || isNaN(max) || hotel.price_per_night <= max;

    return matchesQuery && matchesPrice;
  });
}

/**
 * Calculate the number of nights between check-in and check-out.
 */
export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = outDate.getTime() - inDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Format a Date object to YYYY-MM-DD in local time.
 */
export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validate booking form inputs against rules V1-V5.
 * Returns { valid: boolean, errors: Object }
 */
export function validateBookingDetails({ guestName, checkIn, checkOut, guests, hotel }) {
  const errors = {};
  const todayStr = getTodayDateString();

  // V1: Guest name required, not blank
  if (!guestName || typeof guestName !== 'string' || !guestName.trim()) {
    errors.guestName = 'Enter the guest name.';
  }

  // V2: Check-in required, today or later
  if (!checkIn) {
    errors.checkIn = 'Check-in cannot be in the past.';
  } else if (checkIn < todayStr) {
    errors.checkIn = 'Check-in cannot be in the past.';
  }

  // V3: Check-out required, after check-in (at least 1 night)
  if (!checkOut) {
    errors.checkOut = 'Check-out must be after check-in.';
  } else if (checkIn && checkOut <= checkIn) {
    errors.checkOut = 'Check-out must be after check-in.';
  }

  // V4: Guests whole number from 1 to 6
  const numGuests = Number(guests);
  if (!guests || !Number.isInteger(numGuests) || numGuests < 1 || numGuests > 6) {
    errors.guests = 'Guests must be between 1 and 6.';
  }

  // V5: Room available is at least 1
  if (!hotel || hotel.rooms_available < 1) {
    errors.hotel = 'No rooms available.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Request a new booking (Tourist).
 * Decreases available rooms for the hotel and creates a booking with status 'Requested'.
 */
export function requestBooking({ guestName, checkIn, checkOut, guests, hotelId }) {
  const hotels = getHotels();
  const hotel = hotels.find((h) => h.hotel_id === Number(hotelId));

  if (!hotel) {
    return { success: false, error: 'Hotel not found.' };
  }

  const validation = validateBookingDetails({
    guestName,
    checkIn,
    checkOut,
    guests,
    hotel,
  });

  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    return { success: false, error: firstError, errors: validation.errors };
  }

  const nights = calculateNights(checkIn, checkOut);
  const totalAmount = nights * hotel.price_per_night;

  // Reserve the room: reduce rooms_available by 1
  hotel.rooms_available -= 1;
  saveHotels(hotels);

  // Create booking
  const bookings = getBookings();
  const newBookingId = bookings.length > 0
    ? Math.max(...bookings.map((b) => b.booking_id)) + 1
    : 1;

  const newBooking = {
    booking_id: newBookingId,
    hotel_id: hotel.hotel_id,
    guest_name: guestName.trim(),
    check_in: checkIn,
    check_out: checkOut,
    guests: Number(guests),
    nights,
    total_amount: totalAmount,
    status: 'Requested',
  };

  bookings.push(newBooking);
  saveBookings(bookings);

  return { success: true, booking: newBooking };
}

/**
 * Tourist initiates payment on a Confirmed booking.
 * Transitions status: 'Confirmed' -> 'Payment Pending'.
 */
export function initiatePayment(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.booking_id === Number(bookingId));

  if (!booking) {
    return { success: false, error: 'Booking not found.' };
  }

  if (booking.status !== 'Confirmed') {
    return { success: false, error: 'Only confirmed bookings can initiate payment.' };
  }

  booking.status = 'Payment Pending';
  saveBookings(bookings);

  return { success: true, booking };
}

/**
 * Tourist makes payment.
 * Rule V6: Allowed only when status is 'Payment Pending' and amount equals total.
 * Error: "Payment amount does not match."
 */
export function processPayment(bookingId, amount) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.booking_id === Number(bookingId));

  if (!booking) {
    return { success: false, error: 'Booking not found.' };
  }

  if (booking.status !== 'Payment Pending' || Number(amount) !== booking.total_amount) {
    return { success: false, error: 'Payment amount does not match.' };
  }

  booking.status = 'Paid';
  saveBookings(bookings);

  return { success: true, booking };
}

/**
 * Tourist cancels a booking.
 * Rule V7: Allowed only in 'Requested', 'Confirmed' or 'Payment Pending'.
 * Error: "This booking cannot be cancelled."
 * Releases the reserved room back to the hotel.
 */
export function cancelBooking(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.booking_id === Number(bookingId));

  if (!booking) {
    return { success: false, error: 'Booking not found.' };
  }

  const cancellableStatuses = ['Requested', 'Confirmed', 'Payment Pending'];
  if (!cancellableStatuses.includes(booking.status)) {
    return { success: false, error: 'This booking cannot be cancelled.' };
  }

  // Release the room
  const hotels = getHotels();
  const hotel = hotels.find((h) => h.hotel_id === booking.hotel_id);
  if (hotel) {
    hotel.rooms_available += 1;
    saveHotels(hotels);
  }

  booking.status = 'Cancelled';
  saveBookings(bookings);

  return { success: true, booking };
}
