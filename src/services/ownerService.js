/**
 * services/ownerService.js
 * Pure functions and service methods for Module 2: Booking Requests and Listings (Hotel Owner role).
 * Enforces validation rules V8 through V12.
 */

import { getHotels, saveHotels, getBookings, saveBookings } from './db.js';

/**
 * Filter bookings to find those with status 'Requested'.
 * Pure function: takes bookings array, returns filtered array.
 */
export function getPendingBookings(bookings = []) {
  return bookings.filter((b) => b.status === 'Requested');
}

/**
 * Filter bookings to find those with status 'Paid'.
 * Pure function: takes bookings array, returns filtered array.
 */
export function getPaidBookings(bookings = []) {
  return bookings.filter((b) => b.status === 'Paid');
}

/**
 * Owner confirms a pending booking request.
 * Rule V8: Allowed only when status is 'Requested'.
 * Otherwise returns error: "Booking is no longer pending."
 * Transitions status: 'Requested' -> 'Confirmed'.
 */
export function confirmBooking(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.booking_id === Number(bookingId));

  if (!booking) {
    return { success: false, error: 'Booking not found.' };
  }

  // V8 check
  if (booking.status !== 'Requested') {
    return { success: false, error: 'Booking is no longer pending.' };
  }

  booking.status = 'Confirmed';
  saveBookings(bookings);

  return { success: true, booking };
}

/**
 * Owner rejects a pending booking request.
 * Rule V8: Allowed only when status is 'Requested'.
 * Otherwise returns error: "Booking is no longer pending."
 * Transitions status: 'Requested' -> 'Rejected' and releases the room.
 */
export function rejectBooking(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.booking_id === Number(bookingId));

  if (!booking) {
    return { success: false, error: 'Booking not found.' };
  }

  // V8 check
  if (booking.status !== 'Requested') {
    return { success: false, error: 'Booking is no longer pending.' };
  }

  // Release the reserved room back to the hotel
  const hotels = getHotels();
  const hotel = hotels.find((h) => h.hotel_id === booking.hotel_id);
  if (hotel) {
    hotel.rooms_available += 1;
    saveHotels(hotels);
  }

  booking.status = 'Rejected';
  saveBookings(bookings);

  return { success: true, booking };
}

/**
 * Owner marks a paid booking as completed (US9).
 * Transitions status: 'Paid' -> 'Completed'.
 */
export function markBookingCompleted(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.booking_id === Number(bookingId));

  if (!booking) {
    return { success: false, error: 'Booking not found.' };
  }

  if (booking.status !== 'Paid') {
    return { success: false, error: 'Only paid bookings can be marked completed.' };
  }

  booking.status = 'Completed';
  saveBookings(bookings);

  return { success: true, booking };
}

/**
 * Validate listing inputs against rules V9, V10, V11.
 * Returns { valid: boolean, error?: string, errors: Object }
 */
export function validateListing({ name, city, price, rooms }) {
  const errors = {};

  // V9: name and city required and not blank
  const isNameBlank = !name || typeof name !== 'string' || !name.trim();
  const isCityBlank = !city || typeof city !== 'string' || !city.trim();
  if (isNameBlank || isCityBlank) {
    errors.general = 'Fill all fields.';
    if (isNameBlank) errors.name = 'Fill all fields.';
    if (isCityBlank) errors.city = 'Fill all fields.';
  }

  // V10: price must be a whole number above 0
  const numPrice = Number(price);
  if (
    price === '' ||
    price === null ||
    price === undefined ||
    isNaN(numPrice) ||
    !Number.isInteger(numPrice) ||
    numPrice <= 0
  ) {
    errors.price = 'Price must be positive.';
  }

  // V11: rooms must be a whole number of at least 1
  const numRooms = Number(rooms);
  if (
    rooms === '' ||
    rooms === null ||
    rooms === undefined ||
    isNaN(numRooms) ||
    !Number.isInteger(numRooms) ||
    numRooms < 1
  ) {
    errors.rooms = 'Rooms must be at least 1.';
  }

  const valid = Object.keys(errors).length === 0;
  // Use V9 > V10 > V11 precedence for primary single error message
  const primaryError = errors.general || errors.price || errors.rooms;

  return {
    valid,
    error: primaryError,
    errors,
  };
}

/**
 * Add a new hotel listing (US7).
 * Pure validation + DB update.
 */
export function addListing({ name, city, price, rooms }) {
  const validation = validateListing({ name, city, price, rooms });
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      errors: validation.errors,
    };
  }

  const hotels = getHotels();
  const nextId = hotels.length > 0
    ? Math.max(...hotels.map((h) => h.hotel_id)) + 1
    : 1;

  const newHotel = {
    hotel_id: nextId,
    name: name.trim(),
    city: city.trim(),
    price_per_night: Number(price),
    rooms_available: Number(rooms),
  };

  hotels.push(newHotel);
  saveHotels(hotels);

  return { success: true, hotel: newHotel };
}

/**
 * Check if a hotel can be removed (Rule V12).
 * Blocked when any booking for that hotel is:
 * 'Requested', 'Confirmed', 'Payment Pending', or 'Paid'.
 * Returns { allowed: boolean, error?: string }
 */
export function canRemoveHotel(hotelId, bookings = []) {
  const activeStatuses = ['Requested', 'Confirmed', 'Payment Pending', 'Paid'];
  const hasActiveBooking = bookings.some(
    (b) => b.hotel_id === Number(hotelId) && activeStatuses.includes(b.status)
  );

  if (hasActiveBooking) {
    return {
      allowed: false,
      error: 'Cannot remove a hotel with active bookings.',
    };
  }

  return { allowed: true };
}

/**
 * Remove an existing hotel listing (US8).
 * Enforces Rule V12.
 */
export function removeListing(hotelId) {
  const hotels = getHotels();
  const hotelIndex = hotels.findIndex((h) => h.hotel_id === Number(hotelId));

  if (hotelIndex === -1) {
    return { success: false, error: 'Hotel not found.' };
  }

  const bookings = getBookings();
  const check = canRemoveHotel(hotelId, bookings);
  if (!check.allowed) {
    return { success: false, error: check.error };
  }

  hotels.splice(hotelIndex, 1);
  saveHotels(hotels);

  return { success: true };
}
