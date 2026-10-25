/**
 * services/db.js
 * LocalStorage database abstraction layer for Travel Agency System.
 * Handles persistence for both Tourist (Module 1) and Hotel Owner (Module 2).
 */

const STORAGE_KEYS = {
  HOTELS: 'tas_hotels',
  BOOKINGS: 'tas_bookings',
};

// Initial default seed hotels
export const INITIAL_HOTELS = [
  {
    hotel_id: 1,
    name: 'Sea Breeze Resort',
    city: 'Goa',
    price_per_night: 4200,
    rooms_available: 5,
  },
  {
    hotel_id: 2,
    name: 'Pink City Haveli',
    city: 'Jaipur',
    price_per_night: 3100,
    rooms_available: 3,
  },
  {
    hotel_id: 3,
    name: 'Backwater Stay',
    city: 'Alleppey',
    price_per_night: 3500,
    rooms_available: 4,
  },
  {
    hotel_id: 4,
    name: 'Ganga View Inn',
    city: 'Rishikesh',
    price_per_night: 2200,
    rooms_available: 6,
  },
];

// Initial default seed bookings
export const INITIAL_BOOKINGS = [
  {
    booking_id: 1,
    hotel_id: 1,
    guest_name: 'Asha',
    check_in: '2026-11-12',
    check_out: '2026-11-14',
    guests: 2,
    nights: 2,
    total_amount: 8400,
    status: 'Requested',
  },
  {
    booking_id: 2,
    hotel_id: 2,
    guest_name: 'Ravi',
    check_in: '2026-11-20',
    check_out: '2026-11-22',
    guests: 2,
    nights: 2,
    total_amount: 6200,
    status: 'Confirmed',
  },
  {
    booking_id: 3,
    hotel_id: 3,
    guest_name: 'Kiran',
    check_in: '2026-11-15',
    check_out: '2026-11-17',
    guests: 2,
    nights: 2,
    total_amount: 7000,
    status: 'Payment Pending',
  },
  {
    booking_id: 4,
    hotel_id: 4,
    guest_name: 'Sunil',
    check_in: '2026-11-10',
    check_out: '2026-11-12',
    guests: 2,
    nights: 2,
    total_amount: 4400,
    status: 'Paid',
  },
];

// In-memory fallback for non-browser / test environments
const memoryStorage = {};

/**
 * Helper to get item from localStorage or memoryStorage
 */
function getItem(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    // Fallback if localStorage throws SecurityError
  }
  return memoryStorage[key] || null;
}

/**
 * Helper to set item into localStorage or memoryStorage
 */
function setItem(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (e) {
    // Fallback if localStorage throws SecurityError
  }
  memoryStorage[key] = value;
}

/**
 * Fetch all hotels from database. Initializes seeds if empty.
 */
export function getHotels() {
  const data = getItem(STORAGE_KEYS.HOTELS);
  if (!data) {
    saveHotels(INITIAL_HOTELS);
    return JSON.parse(JSON.stringify(INITIAL_HOTELS));
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse hotels from storage:', err);
    return JSON.parse(JSON.stringify(INITIAL_HOTELS));
  }
}

/**
 * Save hotels array to database.
 */
export function saveHotels(hotels) {
  setItem(STORAGE_KEYS.HOTELS, JSON.stringify(hotels));
}

/**
 * Fetch all bookings from database. Initializes seeds if empty.
 */
export function getBookings() {
  const data = getItem(STORAGE_KEYS.BOOKINGS);
  if (!data) {
    saveBookings(INITIAL_BOOKINGS);
    return JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse bookings from storage:', err);
    return JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
  }
}

/**
 * Save bookings array to database.
 */
export function saveBookings(bookings) {
  setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

/**
 * Reset database back to initial seed data.
 */
export function resetDb() {
  saveHotels(INITIAL_HOTELS);
  saveBookings(INITIAL_BOOKINGS);
}
