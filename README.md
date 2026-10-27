# Travel Agency System (React + Tailwind CSS + Vite)

A modern, responsive Travel Agency System implementing **Sprint 1 (Module 1: Hotel Search & Booking for Tourist; Module 2: Booking Requests & Listings for Hotel Owner)**.

## Features

### Role Switching
- Seamless toggle in the header between **Tourist** and **Hotel Owner** roles using pure React state (no routing library required).

### Module 1: Tourist
- **Hotel Search & Filter:** Search by hotel name or city, with optional maximum price filter.
- **Hotel Booking:** Request bookings with guest name, check-in, check-out, and guest count.
- **My Bookings:** View reservations with status badges, initiate payment for confirmed bookings, pay matching total amounts, and cancel active bookings.
- **Validation Rules:** V1 to V7 enforced with inline messages and toasts.

### Module 2: Hotel Owner
- **Booking Requests (US6, US9):**
  - **Pending Requests:** View bookings with status `Requested`. Confirm (-> `Confirmed`) or Reject (-> `Rejected`, releasing the room). Rule V8: returns `"Booking is no longer pending."` if already acted upon.
  - **Paid Bookings:** View bookings with status `Paid` and mark them completed (-> `Completed`).
- **Manage Listings (US7, US8):**
  - **Add a Listing:** Add new hotels with fields `name`, `city`, `price per night`, and `rooms`.
    - Rules:
      - V9: Name & city required and not blank -> `"Fill all fields."`
      - V10: Price must be a whole number above 0 -> `"Price must be positive."`
      - V11: Rooms must be a whole number of at least 1 -> `"Rooms must be at least 1."`
  - **Remove a Listing:** Remove inactive hotels.
    - Rule V12: Blocked if any booking for that hotel is `Requested`, `Confirmed`, `Payment Pending`, or `Paid` -> `"Cannot remove a hotel with active bookings."`

### Shared Architecture & Persistence
- Both roles read from and write to a single centralized `localStorage` database via `services/db.js`.
- Any booking requested by the Tourist appears in the Hotel Owner's requests immediately.
- Any decision made by the Owner immediately updates the Tourist's booking status.
- Newly added hotel listings by the Owner instantly appear in the Tourist's hotel search.
- Includes a global **Reset data** button and a **Dark mode** toggle.

## Running the Application

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Run the Vitest test suite
```bash
npm test
```

### 4. Build for production
```bash
npm run build
```
