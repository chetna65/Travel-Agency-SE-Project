/**
 * components/tourist/HotelSearch.jsx
 * Screen 1: Search and Book Hotel
 * Allows filtering by query (city or hotel name) and maximum price.
 */

import { useState, useMemo } from 'react';
import { searchHotels } from '../../services/touristService.js';
import { HotelCard } from './HotelCard.jsx';
import { EmptyState } from '../common/EmptyState.jsx';

export function HotelSearch({ hotels, onBookingRequested }) {
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredHotels = useMemo(() => {
    return searchHotels(hotels, { query, maxPrice });
  }, [hotels, query, maxPrice]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3">
        {/* Search by query */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city or hotel..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Max price filter */}
        <div className="sm:w-48 relative">
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">₹</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price ▾"
            className="w-full pl-7 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Clear Filters */}
        {(query || maxPrice) && (
          <button
            onClick={() => {
              setQuery('');
              setMaxPrice('');
            }}
            className="py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Hotel Cards Grid */}
      {filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.hotel_id}
              hotel={hotel}
              onBookingRequested={onBookingRequested}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No hotels match your search"
          description="Try adjusting your search terms or increasing the maximum price filter."
          action={
            (query || maxPrice) && (
              <button
                onClick={() => {
                  setQuery('');
                  setMaxPrice('');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Reset filters
              </button>
            )
          }
        />
      )}
    </div>
  );
}
