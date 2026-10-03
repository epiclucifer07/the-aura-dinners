import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Trash2, CheckCircle2 } from 'lucide-react';
import { Reservation } from '../types/restaurant';

interface BookingsLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Reservation[];
  onCancelBooking: (id: string) => void;
  onOpenNewReservation: () => void;
}

export const BookingsLookupModal: React.FC<BookingsLookupModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onOpenNewReservation,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-xl rounded-lg shadow-xl border border-neutral-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-wider text-neutral-900 font-bold">
              AURA
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
              My Reservations (<strong className="text-red-700">{bookings.length}</strong>)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h4 className="font-serif text-xl text-neutral-800">
                <strong className="font-bold">No Active Reservations Found</strong>
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                You currently have no booked tables recorded on this browser session.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewReservation();
                }}
                className="mt-5 px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                Reserve a Table Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div 
                  key={b.id}
                  className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-bold">
                        Ref: <strong className="text-neutral-700">{b.referenceNo}</strong>
                      </span>
                      <h4 className="font-serif text-lg text-neutral-900">
                        <span className="font-light">Aura</span> <strong className="font-bold">{b.cityName}</strong>
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded">
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span><strong className="text-neutral-800 font-semibold">{b.date}</strong> · <em className="italic">{b.timeSlot}</em></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span><strong className="text-neutral-800 font-semibold">{b.guests} Guests</strong> · <em className="italic font-serif">{b.occasion}</em></span>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-200 flex items-center justify-between">
                    <span>Reserved for: <strong className="text-neutral-900 font-bold">{b.guestName}</strong></span>
                    
                    <button
                      onClick={() => {
                        if (confirm(`Cancel reservation ${b.referenceNo} for Aura ${b.cityName}?`)) {
                          onCancelBooking(b.id);
                        }
                      }}
                      className="text-neutral-400 hover:text-red-700 transition-colors flex items-center gap-1"
                      title="Cancel reservation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {bookings.length > 0 && (
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              Need to alter your party size? Contact restaurant concierge directly.
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenNewReservation();
              }}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap"
            >
              New Booking
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
