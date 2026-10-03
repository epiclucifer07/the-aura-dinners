import React from 'react';
import { X, Trash2, ArrowRight, Utensils, Check } from 'lucide-react';
import { MenuItem, Currency } from '../types/restaurant';
import { CURRENCY_RATES } from '../data/restaurantData';

interface TastingPlanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDishes: MenuItem[];
  onRemoveDish: (id: string) => void;
  onClearAll: () => void;
  selectedCurrency: Currency;
  onProceedToReservation: () => void;
}

export const TastingPlanDrawer: React.FC<TastingPlanDrawerProps> = ({
  isOpen,
  onClose,
  savedDishes,
  onRemoveDish,
  onClearAll,
  selectedCurrency,
  onProceedToReservation,
}) => {
  if (!isOpen) return null;

  const rateObj = CURRENCY_RATES[selectedCurrency];
  const totalUSD = savedDishes.reduce((acc, dish) => acc + dish.priceUSD, 0);
  const convertedTotal = Math.round(totalUSD * rateObj.rate);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-neutral-900 font-medium">
              Curated Tasting Plan
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono uppercase tracking-wider">
              {savedDishes.length} {savedDishes.length === 1 ? 'Dish Selected' : 'Dishes Selected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {savedDishes.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-neutral-400 hover:text-red-700 transition-colors mr-2"
                title="Clear all dishes"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dish List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {savedDishes.length === 0 ? (
            <div className="text-center py-16">
              <Utensils className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h4 className="font-serif text-lg text-neutral-800">Your Tasting Plan is Empty</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Explore our Indian Heritage and Global Haute creations, then click "Add to Tasting" to curate your evening.
              </p>
            </div>
          ) : (
            savedDishes.map((dish, idx) => (
              <div
                key={dish.id}
                className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                    Course {idx + 1} · {dish.origin}
                  </div>
                  <h4 className="font-serif text-base text-neutral-900 font-medium leading-snug">
                    {dish.name}
                  </h4>
                  <div className="text-xs font-mono font-semibold text-neutral-900">
                    {rateObj.symbol}{Math.round(dish.priceUSD * rateObj.rate).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => onRemoveDish(dish.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-700 transition-colors rounded"
                  title="Remove from plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary and Red CTA Button */}
        {savedDishes.length > 0 && (
          <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-wider block">Estimated Total</span>
                <span className="text-[11px] text-neutral-400 font-light">Excluding wines & local taxes</span>
              </div>
              <div className="text-xl font-mono font-bold text-neutral-900">
                {rateObj.symbol}{convertedTotal.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToReservation();
              }}
              className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs tracking-wider uppercase rounded shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Reserve Table with Tasting Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
