import React, { useState } from 'react';
import { Search, Sparkles, BookmarkPlus, Check, Wine, Utensils } from 'lucide-react';
import { MENU_ITEMS, CURRENCY_RATES } from '../data/restaurantData';
import { MenuItem, MenuCategory, DietaryTag, Currency } from '../types/restaurant';

interface MenuSectionProps {
  selectedCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
  savedDishIds: string[];
  onToggleSaveDish: (dish: MenuItem) => void;
  onOpenReservation: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  selectedCurrency,
  onCurrencyChange,
  savedDishIds,
  onToggleSaveDish,
  onOpenReservation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { key: MenuCategory; label: string; badge?: string }[] = [
    { key: 'all', label: 'All Dishes' },
    { key: 'indian-heritage', label: 'Indian Heritage & Avant-Garde', badge: 'Featured' },
    { key: 'global-haute', label: 'Global Haute Cuisine' },
    { key: 'botanical-earth', label: 'Botanical & Earth (Vegetarian)' },
    { key: 'desserts', label: 'Desserts & Confections' },
    { key: 'cellar-mixology', label: 'Cellar & Mixology' },
  ];

  const dietaryFilters: { key: DietaryTag | 'all'; label: string }[] = [
    { key: 'all', label: 'All Dietary' },
    { key: 'veg', label: 'Vegetarian' },
    { key: 'vegan', label: 'Vegan' },
    { key: 'gluten-free', label: 'Gluten-Free' },
    { key: 'halal', label: 'Halal Certified' },
    { key: 'jain-available', label: 'Jain Available' },
  ];

  // Helper to format currency
  const formatPrice = (usd: number) => {
    const rateObj = CURRENCY_RATES[selectedCurrency];
    const converted = Math.round(usd * rateObj.rate);
    return `${rateObj.symbol}${converted.toLocaleString()}`;
  };

  // Filter items
  const filteredDishes = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDietary = dietaryFilter === 'all' || item.dietary.includes(dietaryFilter);
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nativeTitle && item.nativeTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDietary && matchesSearch;
  });

  return (
    <section id="menu" className="py-20 lg:py-28 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-red-700 font-bold block mb-3">
              Degustation & À La Carte
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 leading-tight">
              <strong className="font-bold text-neutral-950">Culinary Artistry</strong>{' '}
              <span className="italic font-normal text-red-900">Across Continents</span>
            </h2>
            <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
              Featuring our celebrated <strong className="font-semibold text-neutral-900">Indian avant-garde creations</strong> alongside 
              <em className="italic font-serif text-neutral-800"> global fine dining masterpieces</em>, 
              curated for our patrons worldwide.
            </p>
          </div>

          {/* Currency Switcher on Menu */}
          <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 self-start md:self-auto">
            <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Currency:</span>
            <div className="flex items-center gap-1">
              {(Object.keys(CURRENCY_RATES) as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onCurrencyChange(curr)}
                  className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${
                    selectedCurrency === curr
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-10">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.key
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    selectedCategory === cat.key ? 'bg-red-800 text-white' : 'bg-red-100 text-red-800'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sub-Filters: Dietary & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
            {/* Dietary Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {dietaryFilters.map((df) => (
                <button
                  key={df.key}
                  onClick={() => setDietaryFilter(df.key)}
                  className={`px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                    dietaryFilter === df.key
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search ingredients, origin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-red-700 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Dish Grid - Minimalist, Spacious Cards with Zero Clutter */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-lg border border-neutral-200">
            <Utensils className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-700 font-medium text-sm">No dishes match your current filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setDietaryFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-red-700 hover:underline font-semibold uppercase tracking-wider"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDishes.map((dish) => {
              const isSaved = savedDishIds.includes(dish.id);

              return (
                <article
                  key={dish.id}
                  className="group bg-white border border-neutral-200 rounded-lg p-6 sm:p-7 flex flex-col justify-between hover:border-neutral-400 hover:shadow-xs transition-all"
                >
                  <div>
                    {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <strong className="font-mono text-[11px] uppercase tracking-wider text-neutral-700 font-semibold">
                          {dish.origin}
                        </strong>
                        {dish.nativeTitle && (
                          <>
                            <span aria-hidden="true" className="text-neutral-300">·</span>
                            <em className="italic text-neutral-600 font-serif text-xs">{dish.nativeTitle}</em>
                          </>
                        )}
                      </div>

                      {/* Dietary text indicators */}
                      {dish.dietary.includes('chef-signature') && (
                        <span className="text-[11px] font-bold text-red-700 shrink-0 uppercase tracking-wider">
                          ★ Chef's Star
                        </span>
                      )}
                    </div>

                    {/* Dish Title & Price Baseline */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 group-hover:text-red-800 transition-colors leading-snug">
                        <strong className="font-bold">{dish.name}</strong>
                      </h3>
                      <span className="font-mono text-base font-bold text-neutral-950 tabular-nums shrink-0 mt-0.5">
                        {formatPrice(dish.priceUSD)}
                      </span>
                    </div>

                    {/* Poetic Description */}
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                      {dish.description}
                    </p>

                    {/* Sommelier Pairing note */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-start gap-2 text-[11px] text-neutral-500">
                      <Wine className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                      <span className="leading-tight">
                        <strong className="font-bold text-neutral-900">Sommelier Pairing: </strong>
                        <em className="italic font-serif text-neutral-700">{dish.pairingNote}</em>
                      </span>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    
                    {/* Dietary markers: clean unboxed text */}
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
                      {dish.dietary.filter(d => d !== 'chef-signature').map((tag, idx) => (
                        <span key={tag} className="capitalize">
                          {tag.replace('-', ' ')}{idx < dish.dietary.filter(d => d !== 'chef-signature').length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>

                    {/* Save to Tasting Course Button */}
                    <button
                      onClick={() => onToggleSaveDish(dish)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-colors ${
                        isSaved
                          ? 'bg-neutral-900 text-white font-medium'
                          : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                      title={isSaved ? 'Remove from tasting plan' : 'Save to my tasting plan'}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Add to Tasting</span>
                        </>
                      )}
                    </button>

                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom Callout to Reserve */}
        <div className="mt-16 bg-[#FAFAFA] border border-neutral-200 rounded-lg p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="font-serif text-xl sm:text-2xl text-neutral-900 font-normal">
              Curate Your Own Degustation Journey
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Select dishes into your tasting plan or allow our Chef de Cuisine to orchestrate a 7 or 10-course mystery flight.
            </p>
          </div>
          <button
            onClick={onOpenReservation}
            className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap"
          >
            Reserve Table for Degustation
          </button>
        </div>

      </div>
    </section>
  );
};
