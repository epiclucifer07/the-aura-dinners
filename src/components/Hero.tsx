import React, { useState } from 'react';
import { ArrowRight, MapPin, Sparkles, ChevronRight, Clock, Users } from 'lucide-react';
import { GLOBAL_CITIES, IMAGES } from '../data/restaurantData';

interface HeroProps {
  onOpenReservation: (preselectedCityId?: string) => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReservation, onExploreMenu }) => {
  const [quickCity, setQuickCity] = useState(GLOBAL_CITIES[0].id);

  const selectedLocation = GLOBAL_CITIES.find((c) => c.id === quickCity) || GLOBAL_CITIES[0];

  return (
    <section className="relative bg-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Brand Kicker */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-500 mb-4 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-700" />
            <strong className="font-bold text-neutral-800">Contemporary Haute Cuisine</strong>
            <span className="text-neutral-300">/</span>
            <span className="italic lowercase tracking-normal text-neutral-500 font-serif text-sm">18 global sanctuaries</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-neutral-950 tracking-tight leading-[1.08] text-balance">
            <strong className="font-bold text-neutral-950">Ancient Spice Alchemy.</strong> <br />
            <span className="italic font-normal text-red-900">Global Avant-Garde.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl text-balance">
            Aura Dining unites the <em className="italic font-serif text-neutral-800 text-lg">ancestral depth</em> of{' '}
            <strong className="font-semibold text-neutral-900">Vedic Indian flavor wisdom</strong> with the{' '}
            <em className="italic font-serif text-neutral-800 text-lg">uncompromising precision</em> of{' '}
            <strong className="font-semibold text-neutral-900">modern French & Japanese gastronomy</strong>, 
            orchestrated across <strong className="font-semibold text-neutral-900">18 iconic world destinations</strong>.
          </p>

          {/* Action Button Row: Red Main Button + Crisp Secondary */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onOpenReservation()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs tracking-widest uppercase rounded shadow-sm hover:shadow transition-all"
            >
              <span>Reserve a Table</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreMenu}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 hover:border-neutral-400 font-bold text-xs tracking-widest uppercase rounded transition-colors"
            >
              <span>Explore <em className="italic font-serif lowercase text-sm font-normal">Degustation</em> Menu</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Anchor */}
        <div className="mt-12 lg:mt-16 relative">
          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
            <img
              src={IMAGES.hero}
              alt="Aura Dining main saloon showing serene table settings and ambient lighting"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.01]"
            />
            {/* Soft subtle gradient scrim for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* In-Frame Context Bar */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between text-white gap-3">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-300 block font-semibold">
                  The Experience
                </span>
                <p className="font-serif text-lg sm:text-2xl text-white">
                  <strong className="font-bold text-white">Understated minimalism.</strong>{' '}
                  <span className="italic font-light text-neutral-200">Boundless culinary poetry.</span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Reservations Open: <strong className="font-bold text-white">Oct – Dec 2026</strong></span>
                </span>
                <span className="hidden md:inline text-neutral-400">|</span>
                <span className="hidden md:inline text-neutral-200 font-serif italic text-sm">
                  Michelin Guide Recommended
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick City Selector Bar - Interactive Fast-Reservation Gateway */}
        <div className="mt-8 bg-neutral-50 border border-neutral-200 rounded-lg p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
                  Select Sanctuary
                </span>
                <span className="text-sm font-medium text-neutral-800">
                  {selectedLocation.name} · {selectedLocation.district}
                </span>
              </div>
            </div>

            {/* City Quick Pills / Segmented Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {GLOBAL_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setQuickCity(city.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                    quickCity === city.id
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>

            {/* Book in Selected City CTA */}
            <div className="flex items-center justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-200">
              <div className="hidden sm:block text-right text-xs">
                <span className="text-neutral-400 block">Lead Chef</span>
                <span className="text-neutral-700 font-medium">{selectedLocation.headChef.split('&')[0]}</span>
              </div>
              <button
                onClick={() => onOpenReservation(selectedLocation.id)}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Book in {selectedLocation.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
