import React, { useState } from 'react';
import { Calendar, BookmarkCheck, Menu as MenuIcon, X, MapPin, User, LogOut, ShieldCheck, Phone, Check } from 'lucide-react';
import { Currency } from '../types/restaurant';
import { CURRENCY_RATES } from '../data/restaurantData';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenReservation: (preselectedCityId?: string) => void;
  onOpenBookings: () => void;
  onOpenTastingPlan: () => void;
  onOpenPhoneVerification: () => void;
  savedDishCount: number;
  bookingsCount: number;
  selectedCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReservation,
  onOpenBookings,
  onOpenTastingPlan,
  onOpenPhoneVerification,
  savedDishCount,
  bookingsCount,
  selectedCurrency,
  onCurrencyChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { currentUser, userProfile, signInWithGoogle, signOut, phoneVerified, verifiedPhone } = useAuth();

  const navLinks = [
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Global Cities', href: '#cities' },
    { label: 'Culinary Menu', href: '#menu' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Accolades', href: '#reviews' },
  ];

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e: any) {
      if (e.code !== 'auth/popup-closed-by-user') {
        alert('Could not complete Google Sign-in: ' + e.message);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          className="group flex flex-col items-start"
          aria-label="Aura Dining Homepage"
        >
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] font-bold text-neutral-950 group-hover:text-red-700 transition-colors">
              AURA
            </span>
            <span className="font-serif text-base sm:text-lg italic font-normal text-neutral-500 group-hover:text-neutral-700 transition-colors">
              Dining
            </span>
          </div>
          <span className="text-[9px] tracking-[0.35em] text-neutral-400 uppercase -mt-1 font-sans font-semibold">
            Haute Cuisine
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

        {/* Zone 3: 1–2 primary actions with currency, Google Auth & signature red button */}
        <div className="flex items-center gap-3">
          {/* Currency Selector (Minimal) */}
          <div className="hidden xl:flex items-center text-xs text-neutral-500 border border-neutral-200 rounded px-2 py-1">
            <span className="text-[10px] uppercase text-neutral-400 mr-1.5 font-bold">Curr:</span>
            <select
              value={selectedCurrency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="bg-transparent text-neutral-800 font-bold focus:outline-none cursor-pointer"
              aria-label="Select pricing currency"
            >
              {(Object.keys(CURRENCY_RATES) as Currency[]).map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* Google Auth or User Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-100 transition-colors border border-neutral-200"
                aria-label="User account menu"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Patron'}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
                {phoneVerified && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-2 -mt-3 ring-2 ring-white" title="Phone Number Verified" />
                )}
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-xl p-4 z-50 animate-fadeIn space-y-3"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="pb-3 border-b border-neutral-100">
                    <div className="font-serif text-base font-bold text-neutral-900 truncate">
                      {currentUser.displayName || 'Aura Patron'}
                    </div>
                    <div className="text-xs text-neutral-500 truncate">
                      {currentUser.email}
                    </div>
                  </div>

                  {/* Phone Status */}
                  <div className="p-2.5 bg-neutral-50 rounded border border-neutral-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Phone Verification</span>
                      {phoneVerified ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold text-[11px]">Pending</span>
                      )}
                    </div>

                    {phoneVerified && verifiedPhone ? (
                      <span className="font-mono text-neutral-800 text-[11px] font-medium block">
                        {verifiedPhone}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenPhoneVerification();
                        }}
                        className="w-full mt-1.5 py-1 px-2 bg-red-50 hover:bg-red-100 text-red-800 rounded text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
                        <span>Verify Mobile Number</span>
                      </button>
                    )}
                  </div>

                  {/* Quick Bookings Link */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenBookings();
                    }}
                    className="w-full text-left py-1.5 text-xs text-neutral-700 hover:text-neutral-900 font-medium flex items-center justify-between"
                  >
                    <span>My Table Reservations</span>
                    <span className="text-neutral-400 font-mono text-[11px]">{bookingsCount}</span>
                  </button>

                  {/* Sign Out */}
                  <button
                    onClick={async () => {
                      setProfileDropdownOpen(false);
                      await signOut();
                    }}
                    className="w-full text-left pt-2 border-t border-neutral-100 text-xs text-red-700 hover:text-red-900 font-semibold flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 hover:border-neutral-400 rounded text-xs font-bold transition-colors shadow-2xs whitespace-nowrap"
              title="Sign in with Google to sync your dining reservations"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Google Sign-In</span>
            </button>
          )}

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
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded transition-colors whitespace-nowrap"
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
            className="px-5 py-2.5 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white text-xs tracking-wider uppercase font-bold rounded shadow-sm hover:shadow transition-all whitespace-nowrap"
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
