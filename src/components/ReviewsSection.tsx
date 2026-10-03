import React from 'react';
import { Star } from 'lucide-react';
import { CRITIC_REVIEWS } from '../data/restaurantData';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 lg:py-28 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-red-700 font-bold block mb-3">
            Critical Reception
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 leading-tight">
            <strong className="font-bold text-neutral-950">Acclaim Across</strong>{' '}
            <span className="italic font-normal text-red-900">the Capitals</span>
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
            International honors and quiet praise from the world's most discerning culinary observers.
          </p>
        </div>

        {/* 3 Editorial Review Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {CRITIC_REVIEWS.map((review, idx) => (
            <div 
              key={idx}
              className="p-8 bg-[#FAFAFA] border border-neutral-200/80 rounded-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-red-700">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-red-700 text-red-700" />
                  ))}
                </div>

                <blockquote className="font-serif text-lg sm:text-xl text-neutral-900 leading-snug">
                  <em className="italic font-normal">"{review.quote}"</em>
                </blockquote>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-200 text-xs">
                <div className="font-bold text-neutral-950 text-sm">{review.author}</div>
                <div className="text-neutral-500 font-mono text-[11px] mt-0.5">
                  <em className="italic font-serif text-neutral-700">{review.publication}</em> · <strong className="font-semibold text-neutral-800">{review.location}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Guide Honors */}
        <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-wrap items-center justify-around gap-8 text-neutral-400 text-xs tracking-widest uppercase font-mono">
          <span>The World's 50 Best Discovery</span>
          <span className="hidden sm:inline">·</span>
          <span>Michelin Guide Selection 2026</span>
          <span className="hidden sm:inline">·</span>
          <span>La Liste Top 1000 Global</span>
          <span className="hidden sm:inline">·</span>
          <span>Gault & Millau 3 Toques</span>
        </div>

      </div>
    </section>
  );
};
