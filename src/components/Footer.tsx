import React, { useState } from 'react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { GLOBAL_CITIES } from '../data/restaurantData';

interface FooterProps {
  onOpenReservation: (cityId?: string) => void;
  onOpenBookings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReservation, onOpenBookings }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-neutral-200 pt-16 pb-12 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-neutral-100">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl tracking-[0.22em] font-bold text-neutral-950 block">
                  AURA
                </span>
                <span className="font-serif text-lg italic text-neutral-500 font-normal">
                  Dining
                </span>
              </div>
              <span className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase font-sans font-bold block mt-0.5">
                Contemporary Haute Cuisine
              </span>
            </div>
            
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm font-light">
              Harmonizing the <strong className="font-semibold text-neutral-800">ancestral culinary depth</strong> of <em className="italic font-serif text-neutral-700">Vedic India</em> with{' '}
              <strong className="font-semibold text-neutral-800">avant-garde global technique</strong>. 
              An unhurried sanctuary of <em className="italic font-serif text-neutral-700">flavor, craft</em>, and architectural stillness.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onOpenReservation()}
                className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs tracking-wider uppercase rounded shadow-xs transition-colors"
              >
                Reserve a Table
              </button>
            </div>
          </div>

          {/* Sanctuaries Col */}
          <div>
            <span className="font-semibold text-neutral-900 uppercase tracking-wider block mb-3">
              Sanctuaries
            </span>
            <ul className="space-y-2">
              {GLOBAL_CITIES.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onOpenReservation(c.id)}
                    className="hover:text-red-700 transition-colors text-left"
                  >
                    Aura {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience Col */}
          <div>
            <span className="font-semibold text-neutral-900 uppercase tracking-wider block mb-3">
              Experience
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#philosophy" className="hover:text-red-700 transition-colors">The Philosophy</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-red-700 transition-colors">Indian Heritage Menu</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-red-700 transition-colors">Global Haute Cuisine</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-red-700 transition-colors">Photo Gallery</a>
              </li>
              <li>
                <button onClick={onOpenBookings} className="hover:text-red-700 transition-colors text-left">
                  Lookup My Reservation
                </button>
              </li>
            </ul>
          </div>

          {/* Private Inquiries & Newsletter */}
          <div>
            <span className="font-semibold text-neutral-900 uppercase tracking-wider block mb-3">
              Gastronomic Gazette
            </span>
            <p className="text-[11px] text-neutral-500 mb-3 leading-relaxed">
              Seasonal harvest previews, rare wine cellar allocations, and guest chef residency announcements.
            </p>

            {subscribed ? (
              <div className="p-3 bg-red-50 text-red-800 rounded text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-red-700" />
                <span>You have been subscribed to Aura Gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-red-700"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded transition-colors uppercase tracking-wider"
                >
                  Join Gazette
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            © {new Date().getFullYear()} Aura Dining International Ltd. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Dress Code: Smart Elegant</span>
            <span>·</span>
            <span>Corkage & Valet by Sanctuary</span>
            <span>·</span>
            <a href="#" className="hover:text-neutral-700 transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
