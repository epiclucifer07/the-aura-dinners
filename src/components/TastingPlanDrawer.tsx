import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Utensils, Check, ShieldCheck, Phone, CheckCircle2, ShoppingBag } from 'lucide-react';
import { MenuItem, Currency } from '../types/restaurant';
import { CURRENCY_RATES, GLOBAL_CITIES } from '../data/restaurantData';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface TastingPlanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDishes: MenuItem[];
  onRemoveDish: (id: string) => void;
  onClearAll: () => void;
  selectedCurrency: Currency;
  onProceedToReservation: () => void;
  onRequestPhoneVerification: () => void;
}

export const TastingPlanDrawer: React.FC<TastingPlanDrawerProps> = ({
  isOpen,
  onClose,
  savedDishes,
  onRemoveDish,
  onClearAll,
  selectedCurrency,
  onProceedToReservation,
  onRequestPhoneVerification,
}) => {
  const { currentUser, phoneVerified, verifiedPhone } = useAuth();
  const [selectedCity, setSelectedCity] = useState(GLOBAL_CITIES[0].id);
  const [orderConfirmed, setOrderConfirmed] = useState<{ orderRef: string; date: string } | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  if (!isOpen) return null;

  const rateObj = CURRENCY_RATES[selectedCurrency];
  const totalUSD = savedDishes.reduce((acc, dish) => acc + dish.priceUSD, 0);
  const convertedTotal = Math.round(totalUSD * rateObj.rate);
  const cityName = GLOBAL_CITIES.find(c => c.id === selectedCity)?.name || 'Mumbai';

  const handlePlaceOrder = async () => {
    if (!phoneVerified || !verifiedPhone) {
      // Trigger phone verification modal
      onRequestPhoneVerification();
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const orderRef = `AUR-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Save order to Firestore
      try {
        await addDoc(collection(db, 'orders'), {
          orderRef,
          userId: currentUser?.uid || 'guest',
          guestName: currentUser?.displayName || 'Aura Guest',
          guestEmail: currentUser?.email || 'unregistered',
          guestPhone: verifiedPhone,
          phoneVerified: true,
          cityId: selectedCity,
          cityName: cityName,
          items: savedDishes.map(d => ({ id: d.id, name: d.name, priceUSD: d.priceUSD })),
          currency: selectedCurrency,
          subtotal: convertedTotal,
          status: 'Confirmed & Sent to Kitchen Atelier',
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore write warning:', err);
      }

      setOrderConfirmed({
        orderRef,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
      onClearAll();
    } catch (e: any) {
      alert('Order error: ' + e.message);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

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
            <h3 className="font-serif text-xl text-neutral-900">
              <strong className="font-bold">Curated Tasting Plan</strong>
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono uppercase tracking-wider font-semibold">
              <strong className="text-red-700 font-bold">{savedDishes.length}</strong> {savedDishes.length === 1 ? 'Dish Selected' : 'Dishes Selected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {savedDishes.length > 0 && !orderConfirmed && (
              <button
                onClick={onClearAll}
                className="text-xs text-neutral-400 hover:text-red-700 transition-colors mr-2 font-medium"
                title="Clear all dishes"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {
                setOrderConfirmed(null);
                onClose();
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {orderConfirmed ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-serif text-2xl text-neutral-900 font-bold">
                  Tasting Pre-Order Placed
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Sent to Executive Chef Atelier at Aura {cityName}.
                </p>
              </div>

              {/* Order Receipt */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-400 font-mono text-[10px] uppercase font-bold">Order Reference</span>
                  <span className="font-mono font-bold text-neutral-900">{orderConfirmed.orderRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Destination:</span>
                  <span className="font-medium text-neutral-800">Aura {cityName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Verification:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Phone Verified ({verifiedPhone})
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setOrderConfirmed(null);
                  onClose();
                }}
                className="w-full py-2.5 bg-neutral-900 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close Receipt
              </button>
            </div>
          ) : savedDishes.length === 0 ? (
            <div className="text-center py-16">
              <Utensils className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h4 className="font-serif text-lg text-neutral-800">
                <strong className="font-bold">Your Tasting Plan is Empty</strong>
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Explore our <strong className="font-semibold text-neutral-700">Indian Heritage</strong> and <em className="italic font-serif text-neutral-700">Global Haute</em> creations, then click "Add to Tasting" to curate your evening.
              </p>
            </div>
          ) : (
            <>
              {savedDishes.map((dish, idx) => (
                <div
                  key={dish.id}
                  className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-semibold">
                      <strong className="text-neutral-600 font-bold">Course {idx + 1}</strong> · <em className="italic font-serif not-italic">{dish.origin}</em>
                    </div>
                    <h4 className="font-serif text-base text-neutral-900 leading-snug">
                      <strong className="font-bold">{dish.name}</strong>
                    </h4>
                    <div className="text-xs font-mono font-bold text-neutral-950">
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
              ))}

              {/* Destination Sanctuary Selector for Ordering */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs space-y-1.5 mt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                  Select Sanctuary for Service
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 bg-white border border-neutral-200 rounded text-xs font-medium focus:outline-none focus:border-red-700"
                >
                  {GLOBAL_CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      Aura {c.name} ({c.country})
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Verification Status on Ordering */}
              <div className="p-3 rounded-lg border text-xs flex items-center justify-between transition-colors bg-white border-neutral-200">
                <div className="flex items-center gap-2">
                  <Phone className={`w-4 h-4 ${phoneVerified ? 'text-emerald-600' : 'text-amber-600'}`} />
                  <div>
                    <span className="font-bold text-neutral-800 block text-[11px]">
                      {phoneVerified ? 'Phone Authenticated' : 'Phone Verification Required'}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {phoneVerified && verifiedPhone ? verifiedPhone : 'Required for kitchen flight ordering'}
                    </span>
                  </div>
                </div>

                {!phoneVerified && (
                  <button
                    type="button"
                    onClick={onRequestPhoneVerification}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-bold uppercase tracking-wider"
                  >
                    Verify Phone
                  </button>
                )}
              </div>
            </>
          )}

        </div>

        {/* Footer with Summary and Dual Red CTA Buttons */}
        {savedDishes.length > 0 && !orderConfirmed && (
          <div className="p-6 bg-neutral-50 border-t border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500 uppercase tracking-wider block font-bold">Estimated Total</span>
                <span className="text-[11px] text-neutral-400 font-light">Excluding local cellar pairings</span>
              </div>
              <div className="text-xl font-mono font-bold text-neutral-900">
                {rateObj.symbol}{convertedTotal.toLocaleString()}
              </div>
            </div>

            {/* Primary Option: Pre-Order Flight with Phone Verification */}
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmittingOrder}
              className="w-full py-3 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold text-xs tracking-wider uppercase rounded shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{phoneVerified ? 'Order Tasting Flight (Verified)' : 'Verify Phone & Pre-Order Flight'}</span>
            </button>

            {/* Secondary Option: Attach to Table Reservation */}
            <button
              onClick={() => {
                onClose();
                onProceedToReservation();
              }}
              className="w-full py-2.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold text-xs tracking-wider uppercase rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Attach to Table Reservation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
