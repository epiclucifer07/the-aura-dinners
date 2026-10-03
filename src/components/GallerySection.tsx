import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/restaurantData';
import { GalleryItem } from '../types/restaurant';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'culinary' | 'spaces' | 'mixology'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories: { key: 'all' | 'culinary' | 'spaces' | 'mixology'; label: string }[] = [
    { key: 'all', label: 'All Photographs' },
    { key: 'culinary', label: 'Culinary Plating' },
    { key: 'spaces', label: 'Spaces & Architecture' },
    { key: 'mixology', label: 'Artisan Mixology' },
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  const openLightbox = (id: string) => {
    const idx = GALLERY_ITEMS.findIndex((item) => item.id === id);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    }
  };

  const currentItem = lightboxIndex !== null ? GALLERY_ITEMS[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#FAFAFA] border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-red-700 font-bold block mb-3">
              Visual Narrative
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 leading-tight">
              <strong className="font-bold text-neutral-950">Quiet Spaces.</strong>{' '}
              <span className="italic font-normal text-red-900">Evocative Plating.</span>
            </h2>
            <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
              A curated photographic record of Aura's <strong className="font-semibold text-neutral-900">minimalist sanctuaries</strong>, 
              intricate <em className="italic font-serif text-neutral-800">Indian flavor architecture</em>, and bespoke crystal mixology.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider rounded font-bold transition-colors whitespace-nowrap ${
                  activeCategory === c.key
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item.id)}
              className={`group relative bg-white rounded-lg border border-neutral-200 overflow-hidden cursor-pointer shadow-2xs hover:shadow-xs transition-all ${
                idx === 0 && activeCategory === 'all' ? 'md:col-span-2 md:row-span-1' : ''
              }`}
            >
              {/* Aspect container with image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white/90 text-neutral-900 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Caption & Metadata bar */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-1">
                  <span>{item.categoryLabel}</span>
                  <span>{item.originOrLocation}</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-neutral-900 group-hover:text-red-700 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-neutral-600 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-5xl w-full bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between text-neutral-300 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-semibold">{currentItem.categoryLabel}</span>
                <span>·</span>
                <span className="text-neutral-400">{currentItem.originOrLocation}</span>
              </div>

              <button
                onClick={closeLightbox}
                className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
                aria-label="Close photo view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Visual */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />

              {/* Prev / Next controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightbox();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors border border-white/10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightbox();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors border border-white/10"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="p-6 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-xl sm:text-2xl text-white font-normal">
                  {currentItem.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                  {currentItem.caption}
                </p>
              </div>

              <div className="text-xs text-neutral-500 font-mono shrink-0">
                Photo {(lightboxIndex ?? 0) + 1} of {GALLERY_ITEMS.length}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
