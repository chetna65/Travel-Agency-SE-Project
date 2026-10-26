/**
 * components/owner/AddListingForm.jsx
 * Screen 4: Add a listing form for Hotel Owner (US7).
 * Enforces rules V9, V10, V11 with inline validation errors.
 */

import { useState } from 'react';
import { addListing } from '../../services/ownerService.js';

export function AddListingForm({ onListingAdded, showToast }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [rooms, setRooms] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    const res = addListing({
      name,
      city,
      price,
      rooms,
    });

    if (!res.success) {
      if (res.errors) {
        setErrors(res.errors);
      }
      setGeneralError(res.error || 'Failed to add listing.');
      return;
    }

    // Reset fields on success
    setName('');
    setCity('');
    setPrice('');
    setRooms('');
    setErrors({});
    setGeneralError('');

    showToast(`Hotel "${res.hotel.name}" listed successfully!`, 'success');
    onListingAdded(res.hotel);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        Add a listing
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        List a new property for tourists to search and book.
      </p>

      {/* Top Banner Error if general (e.g. Fill all fields) */}
      {generalError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hotel Name (V9) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Hotel name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mountain View Retreat"
              className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name
                  ? 'border-rose-400 dark:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* City (V9) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Manali"
              className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city
                  ? 'border-rose-400 dark:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.city}
              </p>
            )}
          </div>

          {/* Price per night (V10) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 3500"
              className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price
                  ? 'border-rose-400 dark:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.price}
              </p>
            )}
          </div>

          {/* Rooms available (V11) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Rooms
            </label>
            <input
              type="number"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              placeholder="e.g. 4"
              className={`w-full px-3 py-2 text-sm rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.rooms
                  ? 'border-rose-400 dark:border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.rooms && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.rooms}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition"
        >
          Add listing
        </button>
      </form>
    </div>
  );
}
