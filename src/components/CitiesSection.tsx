import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Award, ArrowUpRight, ChefHat } from 'lucide-react';
import { GLOBAL_CITIES } from '../data/restaurantData';
import { CityLocation } from '../types/restaurant';

interface CitiesSectionProps {
  onOpenReservation: (cityId: string) => void;
}

export const CitiesSection: React.FC<CitiesSectionProps> = ({ onOpenReservation }) => {
  const [activeCityId, setActiveCityId] = useState<string>('mumbai');

  const activeCity = GLOBAL_CITIES.find((c) => c.id === activeCityId) || GLOBAL_CITIES[0];

  return (
    <section id="cities" className="py-20 lg:py-28 bg-[#FAFAFA] border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-red-700 font-bold block mb-3">
              Global Sanctuaries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 leading-tight">
              <strong className="font-bold text-neutral-950">Eight Cities.</strong>{' '}
              <span className="italic font-normal text-red-900">One Sacred Spirit.</span>
            </h2>
            <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
              Every Aura dining room is individually sculpted to its host city's <em className="italic font-serif text-neutral-800">architectural heritage</em> 
              while anchoring the same <strong className="font-semibold text-neutral-900">elevated Indian & global gastronomy</strong>.
            </p>
          </div>

          <div className="text-xs text-neutral-500 font-medium">
            <span>All dining rooms require <strong className="font-semibold text-neutral-700">advance reservations</strong></span>
          </div>
        </div>

        {/* City Navigation Tabs - Clean, functional segmented control */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {GLOBAL_CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setActiveCityId(city.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded transition-all whitespace-nowrap ${
                activeCityId === city.id
                  ? 'bg-red-700 text-white shadow-xs font-bold'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Active City Showcase Card (Minimal, pristine, high-contrast) */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: City Identity & Description */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono text-neutral-400 tracking-widest uppercase block mb-1 font-semibold">
                  <strong className="text-neutral-700">{activeCity.regionLabel}</strong> · <em className="italic font-serif not-italic">{activeCity.country}</em>
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-neutral-950">
                  <span className="font-light">Aura</span> <strong className="font-bold text-red-950">{activeCity.name}</strong>
                </h3>
                <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
                  {activeCity.description}
                </p>
              </div>

              {/* City Signature Dish Spotlight */}
              <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-md">
                <span className="text-[11px] uppercase tracking-wider text-red-700 font-bold block mb-1">
                  City Signature Creation
                </span>
                <p className="text-base font-serif text-neutral-900 font-medium">
                  <em className="italic">"{activeCity.signatureDish}"</em>
                </p>
              </div>

              {/* Available Dining Spaces */}
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold block mb-2">
                  Curated Dining Spaces
                </span>
                <div className="flex flex-wrap gap-2 text-xs text-neutral-700">
                  {activeCity.availableAreas.map((area) => (
                    <span 
                      key={area} 
                      className="px-3 py-1 bg-neutral-100 rounded text-neutral-800 font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: Signature Red */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenReservation(activeCity.id)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm hover:shadow transition-all"
                >
                  <span>Book Table at <strong className="font-extrabold">Aura {activeCity.name}</strong></span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Location Details & Timings */}
            <div className="lg:col-span-5 bg-neutral-50 p-6 sm:p-8 rounded-lg border border-neutral-100 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4 text-xs">
                <div>
                  <span className="uppercase text-neutral-400 font-bold tracking-wider block mb-1">
                    Address
                  </span>
                  <p className="text-sm text-neutral-800 font-medium leading-relaxed">
                    <strong className="text-neutral-900 font-semibold">{activeCity.address}</strong> <br />
                    <em className="italic font-serif text-neutral-600">{activeCity.district}</em>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
                  <div>
                    <span className="uppercase text-neutral-400 font-bold tracking-wider block mb-1">
                      Lead Chef
                    </span>
                    <p className="text-neutral-900 font-bold text-sm">
                      {activeCity.headChef}
                    </p>
                  </div>
                  <div>
                    <span className="uppercase text-neutral-400 font-bold tracking-wider block mb-1">
                      Head Sommelier
                    </span>
                    <p className="text-neutral-900 font-bold text-sm">
                      {activeCity.sommelier}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200">
                  <span className="uppercase text-neutral-400 font-bold tracking-wider block mb-1">
                    Service Hours
                  </span>
                  <div className="space-y-1 text-neutral-700">
                    <p className="flex justify-between">
                      <span className="text-neutral-500"><strong className="font-semibold text-neutral-700">Lunch Service:</strong></span>
                      <span className="font-mono font-medium text-neutral-900">{activeCity.hours.lunch}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-neutral-500"><strong className="font-semibold text-neutral-700">Dinner Service:</strong></span>
                      <span className="font-mono font-medium text-neutral-900">{activeCity.hours.dinner}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200">
                  <span className="uppercase text-neutral-400 font-bold tracking-wider block mb-1">
                    Direct Enquiries
                  </span>
                  <p className="text-neutral-700 font-medium">
                    <strong className="text-neutral-500 font-bold mr-2">T:</strong> {activeCity.phone} <br />
                    <strong className="text-neutral-500 font-bold mr-2">E:</strong> <em className="italic text-neutral-800">{activeCity.email}</em>
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 border-t border-neutral-200 pt-3 flex items-center justify-between">
                <span>Local Currency: <strong className="text-neutral-700 font-bold">{activeCity.currency} ({activeCity.currencySymbol})</strong></span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Accepting Reservations
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Quick City Directory Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {GLOBAL_CITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCityId(c.id)}
              className={`p-2.5 rounded border transition-colors ${
                activeCityId === c.id
                  ? 'border-red-700 bg-red-50 text-red-800 font-semibold'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              }`}
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-[10px] text-neutral-400">{c.country}</div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
