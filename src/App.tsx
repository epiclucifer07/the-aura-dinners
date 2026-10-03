import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { CitiesSection } from './components/CitiesSection';
import { MenuSection } from './components/MenuSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';
import { BookingsLookupModal } from './components/BookingsLookupModal';
import { TastingPlanDrawer } from './components/TastingPlanDrawer';
import { PhoneVerificationModal } from './components/PhoneVerificationModal';
import { MenuItem, Reservation, Currency } from './types/restaurant';

function AppContent() {
  // Modal / Drawer visibility states
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [preselectedCityId, setPreselectedCityId] = useState<string | undefined>(undefined);
  const [bookingsModalOpen, setBookingsModalOpen] = useState(false);
  const [tastingPlanOpen, setTastingPlanOpen] = useState(false);
  const [phoneVerificationModalOpen, setPhoneVerificationModalOpen] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState<string>('');

  // Global settings
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');

  // Stored tasting plan items
  const [savedDishes, setSavedDishes] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem('aura_tasting_plan');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Stored reservations
  const [bookings, setBookings] = useState<Reservation[]>(() => {
    try {
      const stored = localStorage.getItem('aura_reservations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save tasting plan to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_tasting_plan', JSON.stringify(savedDishes));
    } catch (e) {
      console.error(e);
    }
  }, [savedDishes]);

  // Save bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_reservations', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  // Reservation handlers
  const handleOpenReservation = (cityId?: string) => {
    setPreselectedCityId(cityId);
    setReservationModalOpen(true);
  };

  const handleReservationCreated = (newReservation: Reservation) => {
    setBookings((prev) => [newReservation, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  // Tasting plan handlers
  const handleToggleSaveDish = (dish: MenuItem) => {
    setSavedDishes((prev) => {
      const exists = prev.some((d) => d.id === dish.id);
      if (exists) {
        return prev.filter((d) => d.id !== dish.id);
      } else {
        return [...prev, dish];
      }
    });
  };

  const handleRemoveSavedDish = (dishId: string) => {
    setSavedDishes((prev) => prev.filter((d) => d.id !== dishId));
  };

  const handleClearTastingPlan = () => {
    setSavedDishes([]);
  };

  const handleExploreMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTriggerPhoneVerification = (phone = '') => {
    setPhoneToVerify(phone);
    setPhoneVerificationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-red-800 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        onOpenReservation={handleOpenReservation}
        onOpenBookings={() => setBookingsModalOpen(true)}
        onOpenTastingPlan={() => setTastingPlanOpen(true)}
        onOpenPhoneVerification={() => handleTriggerPhoneVerification()}
        savedDishCount={savedDishes.length}
        bookingsCount={bookings.length}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero
          onOpenReservation={handleOpenReservation}
          onExploreMenu={handleExploreMenu}
        />

        <Philosophy />

        <CitiesSection
          onOpenReservation={(cityId) => handleOpenReservation(cityId)}
        />

        <MenuSection
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          savedDishIds={savedDishes.map((d) => d.id)}
          onToggleSaveDish={handleToggleSaveDish}
          onOpenReservation={() => handleOpenReservation()}
        />

        <GallerySection />

        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenReservation={handleOpenReservation}
        onOpenBookings={() => setBookingsModalOpen(true)}
      />

      {/* Online Reservation Modal */}
      <ReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        preselectedCityId={preselectedCityId}
        onReservationCreated={handleReservationCreated}
        onRequestPhoneVerification={(phone) => handleTriggerPhoneVerification(phone)}
      />

      {/* Bookings Lookup & Management Modal */}
      <BookingsLookupModal
        isOpen={bookingsModalOpen}
        onClose={() => setBookingsModalOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onOpenNewReservation={() => {
          setBookingsModalOpen(false);
          handleOpenReservation();
        }}
      />

      {/* Tasting Plan Drawer */}
      <TastingPlanDrawer
        isOpen={tastingPlanOpen}
        onClose={() => setTastingPlanOpen(false)}
        savedDishes={savedDishes}
        onRemoveDish={handleRemoveSavedDish}
        onClearAll={handleClearTastingPlan}
        selectedCurrency={selectedCurrency}
        onProceedToReservation={() => {
          setTastingPlanOpen(false);
          handleOpenReservation();
        }}
        onRequestPhoneVerification={() => handleTriggerPhoneVerification()}
      />

      {/* Security Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={phoneVerificationModalOpen}
        onClose={() => setPhoneVerificationModalOpen(false)}
        initialPhone={phoneToVerify}
        onVerified={(verified) => {
          setPhoneToVerify(verified);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
