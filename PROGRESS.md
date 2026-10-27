# Travel Agency System - Daily Progress Log

**Course:** Software Engineering Lab (5th Semester)  
**Project:** Travel Services Aggregator / Hotel Booking System  
**Tech Stack:** React 18, Tailwind CSS, Vite, Vitest, HTML5 LocalStorage  

---

## 📅 Day 1: Project Setup & Module 1 (Tourist)

### Objectives
- Set up React + Vite project structure with Tailwind CSS configuration.
- Implement unified in-browser database abstraction layer (`src/services/db.js`) using HTML5 LocalStorage with pre-seeded hotel and booking records.
- Implement Module 1 (Tourist - Hotel Search and Booking):
  - **Screen 1 (Search & Book):** Keyword search (hotel name/city), maximum price filter, dynamic hotel card rendering, room availability indicators.
  - **Inline Booking Form:** Check-in date, check-out date, guest selector, live night & price calculation.
  - **Validation Rules Implemented:** V1 (guest name required), V2 (check-in today or later), V3 (check-out after check-in), V4 (guests 1–6), V5 (room availability $\ge 1$).
  - **Screen 2 (My Bookings):** Display list of reservations, status badges (`Requested`, `Confirmed`, `Payment Pending`, `Paid`), payment initiation/completion (V6), and booking cancellation with room release (V7).

### Key Files Created:
- `src/services/db.js`
- `src/services/touristService.js`
- `src/components/tourist/HotelSearch.jsx`
- `src/components/tourist/HotelCard.jsx`
- `src/components/tourist/BookingForm.jsx`
- `src/components/tourist/MyBookings.jsx`
- `src/components/common/Badge.jsx`

---

## 📅 Day 2: Module 2 (Hotel Owner - Booking Requests & Listings)

### Objectives
- Implement pure business logic service for hotel owners (`src/services/ownerService.js`).
- Build Module 2 screens:
  - **Screen 3 (Booking Requests):**
    - Filter incoming reservations with status `Requested` (US6).
    - Provide **Confirm** and **Reject** buttons. Rejecting safely releases the reserved room back to the hotel inventory.
    - Enforce validation rule **V8**: Only allowed when status is `Requested`; otherwise reject with `"Booking is no longer pending."`.
    - Filter reservations with status `Paid` (US9) with a **Mark completed** action.
  - **Screen 4 (Manage Listings):**
    - List current hotel listings with real-time room availability counts.
    - Provide **Remove listing** action (US8) guarded by **V12**: Block deletion if any booking for that hotel is in `Requested`, `Confirmed`, `Payment Pending`, or `Paid` with error `"Cannot remove a hotel with active bookings."`.
    - Provide **Add a listing** form (US7) guarded by **V9** (name/city non-blank $\rightarrow$ `"Fill all fields."`), **V10** (positive whole number $\rightarrow$ `"Price must be positive."`), and **V11** (whole number $\ge 1$ $\rightarrow$ `"Rooms must be at least 1."`).

### Key Files Created:
- `src/services/ownerService.js`
- `src/components/owner/BookingRequests.jsx`
- `src/components/owner/ManageListings.jsx`
- `src/components/owner/AddListingForm.jsx`
- `src/components/owner/OwnerView.jsx`

---

## 📅 Day 3: Integration, Role Switcher, Testing & QA

### Objectives
- Add top navigation role switcher (`Tourist` | `Hotel Owner`) in `Header.jsx` using React state without external router dependencies.
- Remove temporary Module 1 `"Dev: owner confirms"` helper button from Tourist view (as owner now performs real confirmations).
- Retain persistent **Reset data** functionality to reset `localStorage` to seeds.
- Add comprehensive **Vitest automated test suite**:
  - `tests/validation.test.js`: 19 tests verifying rules V8, V9, V10, V11, and V12.
  - `tests/integration.test.js`: 2 end-to-end tests validating:
    1. Tourist request $\rightarrow$ Owner confirm $\rightarrow$ Tourist payment $\rightarrow$ Owner mark completed.
    2. Owner adding a new listing $\rightarrow$ Instant visibility in Tourist search $\rightarrow$ Successful booking.
- Ensure 100% test pass rate (21/21 passed) and clean production build bundle (`vite build`).
- Dark mode toggle with persistent state in `localStorage`.

### Deliverables:
- `tests/validation.test.js`
- `tests/integration.test.js`
- `src/components/common/Header.jsx`
- `src/App.jsx`
- `PROGRESS.md`
