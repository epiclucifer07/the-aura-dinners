import React from 'react';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 lg:py-28 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-red-700 font-semibold block mb-3">
            Our Culinary Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-900 leading-tight">
            The Alchemy of Rasa, <br />
            <span className="italic">Elevated by Global Technique.</span>
          </h2>
          <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
            In Sanskrit, <span className="italic text-neutral-800">Rasa</span> represents both flavor and emotional essence. 
            At Aura, we celebrate the 5,000-year culinary heritage of the Indian subcontinent—its rare mountain herbs, 
            coastal wild spices, and royal court traditions—reimagined through modern avant-garde plating.
          </p>
        </div>

        {/* 3 Editorial Pillars - Clean hairline separation, zero pills, unboxed */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-400 block tracking-widest">
              01 / HERITAGE & TERROIR
            </span>
            <h3 className="font-serif text-2xl text-neutral-900 font-normal">
              Rare Terroir Sourcing
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              We work directly with Himalayan foragers for wild gucchi morels, artisanal saffron cooperatives in Pampore, 
              and organic spice orchards across the Malabar Coast to bring unmatched aromatics to each city.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-400 block tracking-widest">
              02 / AVANT-GARDE TECHNIQUE
            </span>
            <h3 className="font-serif text-2xl text-neutral-900 font-normal">
              Modernist Clarification
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Centrifugal fat-washing, 72-hour low-temperature confits, liquid nitrogen botanicals, and clarified broths 
              distill centuries of culinary richness into ethereal, light textures that honor digestion and purity.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-400 block tracking-widest">
              03 / SACRED HOSPITALITY
            </span>
            <h3 className="font-serif text-2xl text-neutral-900 font-normal">
              Atithi Devo Bhava
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Rooted in the timeless Indian ethos that the guest is sacred. Our dining rooms feature spacious table separation, 
              unobtrusive choreography, and bespoke accommodation for vegan, Jain, and halal sensibilities.
            </p>
          </div>

        </div>

        {/* Clean Quote Bar */}
        <div className="mt-16 pt-10 border-t border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6 text-neutral-500 text-xs">
          <div className="flex items-center gap-6">
            <span>Mumbai · Delhi · London · New York · Dubai · Paris · Singapore · Tokyo</span>
          </div>
          <div className="text-neutral-400 italic font-serif text-sm">
            "To eat at Aura is to witness geography collapse into pure joy."
          </div>
        </div>

      </div>
    </section>
  );
};
