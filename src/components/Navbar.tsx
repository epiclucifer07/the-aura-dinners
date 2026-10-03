import React, { useState } from 'react';
import { Calendar, BookmarkCheck, Menu as MenuIcon, X, MapPin } from 'lucide-react';
import { Currency } from '../types/restaurant';
import { CURRENCY_RATES } from '../data/restaurantData';

interface NavbarProps {
  onOpenReservation: (preselectedCityId?: string) => void;
  onOpenBookings: () => void;
  onOpenTastingPlan: () => void;
  savedDishCount: number;
  bookingsCount: number;
  selectedCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReservation,
  onOpenBookings,
  onOpenTastingPlan,
  savedDishCount,
  bookingsCount,
  selectedCurrency,
  onCurrencyChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Global Cities', href: '#cities' },
    { label: 'Culinary Menu', href: '#menu' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Accolades', href: '#reviews' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          className="group flex flex-col items-start"
          aria-label="Aura Dining Homepage"
        >
          <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors">
            AURA
          </span>
          <span className="text-[9px] tracking-[0.35em] text-neutral-400 uppercase -mt-1 font-sans">
            Dining
          </span>
        </a>

        {/* Zone 2: 4–6 nav links, single-line text with subtle hover */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-medium text-neutral-600">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-red-700 transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-red-700 hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1–2 primary actions with currency & signature red button */}
        <div className="flex items-center gap-3">
          {/* Currency Selector (Minimal) */}
          <div className="hidden lg:flex items-center text-xs text-neutral-500 border border-neutral-200 rounded px-2 py-1">
            <span className="text-[10px] uppercase text-neutral-400 mr-1.5 font-medium">Curr:</span>
            <select
              value={selectedCurrency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="bg-transparent text-neutral-800 font-semibold focus:outline-none cursor-pointer"
              aria-label="Select pricing currency"
            >
              {(Object.keys(CURRENCY_RATES) as Currency[]).map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* Tasting Plan button if items saved */}
          {savedDishCount > 0 && (
            <button
              onClick={onOpenTastingPlan}
              className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              title="View your curated tasting course"
              aria-label={`View tasting course with ${savedDishCount} dishes`}
            >
              <BookmarkCheck className="w-5 h-5 text-red-700" />
              <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold tabular-nums">
                {savedDishCount}
              </span>
            </button>
          )}

          {/* Look up bookings button */}
          <button
            onClick={onOpenBookings}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded transition-colors whitespace-nowrap"
            aria-label="Manage or look up your reservations"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-red-50 text-red-700 rounded text-[10px] font-bold tabular-nums">
                {bookingsCount}
              </span>
            )}
          </button>

          {/* Primary Action: Signature Red Button */}
          <button
            onClick={() => onOpenReservation()}
            className="px-5 py-2.5 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white text-xs tracking-wider uppercase font-semibold rounded shadow-sm hover:shadow transition-all whitespace-nowrap"
          >
            Reserve Table
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 hover:text-neutral-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-neutral-800 hover:text-red-700 tracking-wider uppercase py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>Display Currency</span>
              <select
                value={selectedCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="border border-neutral-200 rounded px-2 py-1 bg-neutral-50"
              >
                {(Object.keys(CURRENCY_RATES) as Currency[]).map((curr) => (
                  <option key={curr} value={curr}>
                    {CURRENCY_RATES[curr].label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookings();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-neutral-800 border border-neutral-300 rounded"
            >
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>Lookup My Bookings ({bookingsCount})</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full py-3 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider rounded"
            >
              Reserve Table Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
