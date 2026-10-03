import React from 'react';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const Philosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 lg:py-28 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-red-700 font-bold block mb-3">
            Our Culinary Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 leading-tight">
            The Alchemy of <strong className="font-bold text-neutral-950">Rasa</strong>, <br />
            <span className="italic font-normal text-red-900">Elevated by Global Technique.</span>
          </h2>
          <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
            In Sanskrit, <em className="italic font-serif text-neutral-950 font-medium text-lg">Rasa</em> represents both 
            <strong className="font-semibold text-neutral-800"> sensory flavor</strong> and <strong className="font-semibold text-neutral-800">emotional resonance</strong>. 
            At Aura, we celebrate the <strong className="font-semibold text-neutral-900">5,000-year culinary wisdom</strong> of the Indian subcontinent—its rare mountain botanicals, 
            coastal wild spices, and royal court traditions—reimagined through <em className="italic font-serif text-neutral-800">modern avant-garde plating</em>.
          </p>
        </div>

        {/* 3 Editorial Pillars - Clean hairline separation, unboxed */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-400 block tracking-widest font-semibold">
              01 / HERITAGE & TERROIR
            </span>
            <h3 className="font-serif text-2xl text-neutral-900">
              <strong className="font-semibold">Rare Terroir</strong> <em className="italic font-normal">Sourcing</em>
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              We collaborate directly with <strong className="font-medium text-neutral-800">Himalayan foragers</strong> for wild <em className="italic font-serif text-neutral-800">gucchi</em> morels, 
              artisanal saffron cooperatives in <strong className="font-medium text-neutral-800">Pampore, Kashmir</strong>, 
              and single-estate spice orchards across the <strong className="font-medium text-neutral-800">Malabar Coast</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-400 block tracking-widest font-semibold">
              02 / AVANT-GARDE TECHNIQUE
            </span>
            <h3 className="font-serif text-2xl text-neutral-900">
              <strong className="font-semibold">Modernist</strong> <em className="italic font-normal">Clarification</em>
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              <em className="italic font-serif text-neutral-800">Centrifugal fat-washing</em>, 72-hour low-temperature confits, 
              liquid nitrogen aromatics, and <strong className="font-medium text-neutral-800">clarified reductions</strong> distill 
              centuries of Indian richness into <em className="italic font-serif text-neutral-800">ethereal textures</em> that honor purity.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono text-neutral-400 block tracking-widest font-semibold">
              03 / SACRED HOSPITALITY
            </span>
            <h3 className="font-serif text-2xl text-neutral-900">
              <em className="italic font-serif text-red-900">Atithi Devo Bhava</em>
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              Rooted in the timeless Indian truth: <strong className="font-semibold text-neutral-900">"The guest is sacred."</strong> Our dining rooms feature 
              generous table spacing, unobtrusive choreography, and bespoke menus honoring <strong className="font-medium text-neutral-800">Jain</strong>, 
              <strong className="font-medium text-neutral-800"> vegan</strong>, and <strong className="font-medium text-neutral-800">halal</strong> dietary traditions.
            </p>
          </div>

        </div>

        {/* Clean Quote Bar */}
        <div className="mt-16 pt-10 border-t border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6 text-neutral-500 text-xs">
          <div className="flex items-center gap-6 font-medium">
            <span><strong className="font-semibold text-neutral-700">Mumbai</strong> · Delhi · London · <strong className="font-semibold text-neutral-700">New York</strong> · Dubai · Paris · Singapore · Tokyo</span>
          </div>
          <div className="text-neutral-500 italic font-serif text-base">
            "To eat at Aura is to witness <strong className="font-semibold not-italic text-neutral-800">geography collapse</strong> into pure joy."
          </div>
        </div>

      </div>
    </section>
  );
};
