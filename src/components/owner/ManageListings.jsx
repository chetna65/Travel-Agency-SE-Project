/**
 * components/owner/ManageListings.jsx
 * Screen 4: Manage Listings (Hotel Owner)
 * Lists all existing properties with removal (enforcing V12) and embeds AddListingForm.
 */

import { useState } from 'react';
import { removeListing } from '../../services/ownerService.js';
import { AddListingForm } from './AddListingForm.jsx';
import { EmptyState } from '../common/EmptyState.jsx';

export function ManageListings({ hotels, onUpdate, showToast }) {
  const [removeErrors, setRemoveErrors] = useState({});

  const handleRemove = (hotelId, hotelName) => {
    // Clear previous error for this hotel
    setRemoveErrors((prev) => ({ ...prev, [hotelId]: null }));

    const res = removeListing(hotelId);
    if (!res.success) {
      setRemoveErrors((prev) => ({ ...prev, [hotelId]: res.error }));
      showToast(res.error, 'error');
      return;
    }

    showToast(`Removed "${hotelName}" successfully.`, 'success');
    onUpdate();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* SECTION 1: Existing Listings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Your Listings</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold">
                {hotels.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage existing hotel properties or remove inactive listings.
            </p>
          </div>
        </div>

        {hotels.length > 0 ? (
          <div className="space-y-3">
            {hotels.map((hotel) => {
              const err = removeErrors[hotel.hotel_id];

              return (
                <div
                  key={hotel.hotel_id}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2 transition hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Hotel Details */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                          {hotel.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          · {hotel.city}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{hotel.price_per_night.toLocaleString()}
                        </span>{' '}
                        ·{' '}
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {hotel.rooms_available} available
                        </span>
                      </p>
                    </div>

                    {/* Remove Button (V12) */}
                    <button
                      onClick={() => handleRemove(hotel.hotel_id, hotel.name)}
                      className="self-start sm:self-center py-1.5 px-3.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 transition"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Inline Error for V12 */}
                  {err && (
                    <div className="mt-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
                      ⚠️ {err}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No hotel listings yet"
            description="Use the form below to add your first hotel listing."
          />
        )}
      </section>

      {/* SECTION 2: Add Listing Form (US7) */}
      <section>
        <AddListingForm
          onListingAdded={() => onUpdate()}
          showToast={showToast}
        />
      </section>
    </div>
  );
}
