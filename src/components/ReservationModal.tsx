import React, { useState, useEffect } from 'react';
import { 
  X, Calendar as CalendarIcon, Clock, Users, MapPin, 
  CheckCircle2, Sparkles, ChevronRight, ChevronLeft, Download,
  Share2, AlertCircle, Phone, Mail, User
} from 'lucide-react';
import { GLOBAL_CITIES } from '../data/restaurantData';
import { Reservation, CityLocation } from '../types/restaurant';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCityId?: string;
  onReservationCreated: (res: Reservation) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  preselectedCityId,
  onReservationCreated,
}) => {
  // Step flow: 1: City & Space -> 2: Date & Time -> 3: Party & Occasion -> 4: Dietary & Guest -> 5: Confirmed
  const [step, setStep] = useState<number>(1);
  
  // Form State
  const [selectedCityId, setSelectedCityId] = useState<string>(preselectedCityId || 'mumbai');
  const [selectedArea, setSelectedArea] = useState<string>('Main Dining Saloon');
  const [date, setDate] = useState<string>('');
  const [serviceType, setServiceType] = useState<'Lunch' | 'High Tea' | 'Dinner'>('Dinner');
  const [timeSlot, setTimeSlot] = useState<string>('7:30 PM');
  const [guests, setGuests] = useState<number>(2);
  const [occasion, setOccasion] = useState<string>('Degustation Journey');
  const [dietary, setDietary] = useState<string[]>([]);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  
  // Confirmed result
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [calendarDownloaded, setCalendarDownloaded] = useState<boolean>(false);
  const [smsSimulated, setSmsSimulated] = useState<boolean>(true);

  // Initialize date to tomorrow if empty
  useEffect(() => {
    if (!date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const iso = tomorrow.toISOString().split('T')[0];
      setDate(iso);
    }
  }, [date]);

  // Update selected city if prop changes
  useEffect(() => {
    if (preselectedCityId) {
      setSelectedCityId(preselectedCityId);
      const city = GLOBAL_CITIES.find((c) => c.id === preselectedCityId);
      if (city && city.availableAreas.length > 0) {
        setSelectedArea(city.availableAreas[0]);
      }
    }
  }, [preselectedCityId]);

  if (!isOpen) return null;

  const currentCity = GLOBAL_CITIES.find((c) => c.id === selectedCityId) || GLOBAL_CITIES[0];

  const lunchSlots = ['12:00 PM', '12:30 PM', '1:15 PM', '2:00 PM'];
  const teaSlots = ['3:30 PM', '4:15 PM'];
  const dinnerSlots = ['6:30 PM', '7:15 PM', '7:45 PM', '8:30 PM', '9:15 PM', '10:00 PM'];

  const availableSlots = 
    serviceType === 'Lunch' ? lunchSlots : 
    serviceType === 'High Tea' ? teaSlots : dinnerSlots;

  const occasions = [
    'Degustation Journey',
    'Romantic Evening',
    'Anniversary Celebration',
    'Executive Business Dinner',
    'Birthday Gathering',
    'Family Reunion',
  ];

  const dietaryOptions = [
    'Vegetarian (Shakahari)',
    'Jain Dietary (No root vegetables)',
    'Vegan / Plant-Based',
    'Halal Certified Preparation',
    'Gluten-Free',
    'Nut Allergy Precaution',
    'Shellfish Allergy',
  ];

  const toggleDietary = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(dietary.filter((d) => d !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCityId(cityId);
    const c = GLOBAL_CITIES.find((item) => item.id === cityId);
    if (c && c.availableAreas.length > 0) {
      setSelectedArea(c.availableAreas[0]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      // Validate
      if (!guestName.trim()) {
        alert('Please enter your full name for the reservation.');
        return;
      }
      if (!guestEmail.trim() || !guestEmail.includes('@')) {
        alert('Please provide a valid email address.');
        return;
      }
      if (!guestPhone.trim()) {
        alert('Please provide a telephone number for booking SMS confirmation.');
        return;
      }

      // Generate booking reference
      const prefix = currentCity.name.substring(0, 3).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const ref = `AUR-${prefix}-${randomNum}`;

      const newRes: Reservation = {
        id: `res-${Date.now()}`,
        referenceNo: ref,
        cityId: currentCity.id,
        cityName: currentCity.name,
        date,
        timeSlot,
        serviceType,
        guests,
        diningArea: selectedArea,
        occasion,
        dietaryPreferences: dietary,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      setConfirmedReservation(newRes);
      onReservationCreated(newRes);
      setStep(5);
    }
  };

  const handleDownloadICS = () => {
    if (!confirmedReservation) return;

    const startDateTime = new Date(`${confirmedReservation.date} ${confirmedReservation.timeSlot.split(' ')[0]}`);
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aura Dining//Fine Dining Reservation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Dinner Reservation at Aura ${confirmedReservation.cityName}`,
      `DESCRIPTION:Reservation Reference: ${confirmedReservation.referenceNo}\\nParty: ${confirmedReservation.guests} Guests\\nArea: ${confirmedReservation.diningArea}\\nOccasion: ${confirmedReservation.occasion}`,
      `LOCATION:Aura Dining, ${currentCity.address}, ${currentCity.name}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Aura-${confirmedReservation.referenceNo}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCalendarDownloaded(true);
  };

  const resetAndClose = () => {
    setStep(1);
    setConfirmedReservation(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={resetAndClose}
    >
      <div 
        className="relative bg-white w-full max-w-2xl rounded-lg shadow-xl border border-neutral-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-wider text-neutral-900 font-medium">
              AURA
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
              {step === 5 ? 'Confirmed Table' : 'Online Table Reservation'}
            </span>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full transition-colors"
            aria-label="Close reservation dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker (Steps 1 to 4) */}
        {step < 5 && (
          <div className="px-6 pt-4 pb-2 bg-neutral-50 border-b border-neutral-100">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium uppercase tracking-wider mb-2">
              <span className={step >= 1 ? 'text-red-700 font-bold' : ''}>1. Destination</span>
              <span className={step >= 2 ? 'text-red-700 font-bold' : ''}>2. Date & Time</span>
              <span className={step >= 3 ? 'text-red-700 font-bold' : ''}>3. Party & Occasion</span>
              <span className={step >= 4 ? 'text-red-700 font-bold' : ''}>4. Guest Details</span>
            </div>
            <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-red-700 h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: City & Dining Space */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                  Select Sanctuary & Atmosphere
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Choose your city destination and preferred seating experience.
                </p>
              </div>

              {/* City Selection Grid */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                  City Location
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GLOBAL_CITIES.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCitySelect(city.id)}
                      className={`p-3 text-left rounded border transition-colors ${
                        selectedCityId === city.id
                          ? 'border-red-700 bg-red-50 text-red-950 font-semibold shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{city.name}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{city.country}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current City Highlight */}
              <div className="p-3.5 bg-neutral-50 rounded border border-neutral-100 text-xs text-neutral-600 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 font-medium">Aura {currentCity.name}: </strong>
                  <span>{currentCity.address}, {currentCity.district}</span>
                </div>
              </div>

              {/* Seating Space Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                  Preferred Seating Ambience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentCity.availableAreas.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setSelectedArea(area)}
                      className={`p-3 text-left rounded border transition-colors text-xs ${
                        selectedArea === area
                          ? 'border-red-700 bg-neutral-900 text-white font-medium'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <span>{area}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time Slot */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                  Date & Seating Slot
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Reservations open 90 days in advance for Aura {currentCity.name}.
                </p>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                  Date of Seating
                </label>
                <div className="relative">
                  <CalendarIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded text-sm text-neutral-800 focus:outline-none focus:border-red-700"
                  />
                </div>
              </div>

              {/* Service Type Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                  Service Window
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Lunch', 'High Tea', 'Dinner'] as const).map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => {
                        setServiceType(svc);
                        if (svc === 'Lunch') setTimeSlot('1:15 PM');
                        if (svc === 'High Tea') setTimeSlot('3:30 PM');
                        if (svc === 'Dinner') setTimeSlot('7:30 PM');
                      }}
                      className={`py-2 px-3 text-xs uppercase tracking-wider font-semibold rounded border transition-colors ${
                        serviceType === svc
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {svc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating Time Slots */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                  Available Seating Times ({serviceType})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2.5 px-3 text-xs font-mono font-medium rounded border transition-colors text-center ${
                        timeSlot === slot
                          ? 'bg-red-700 text-white border-red-700 shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 bg-neutral-50 p-3 rounded border border-neutral-100 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Degustation services span approximately 2.5 to 3 hours.</span>
              </div>
            </div>
          )}

          {/* STEP 3: Party Size & Occasion */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                  Party Size & Occasion
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  For parties larger than 12 guests, our private dining concierge will assist you.
                </p>
              </div>

              {/* Guests Count Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`w-11 h-11 shrink-0 rounded font-semibold text-sm transition-colors border ${
                        guests === num
                          ? 'bg-red-700 text-white border-red-700'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dining Occasion */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                  Dining Occasion
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {occasions.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`p-3 text-left rounded border transition-colors text-xs ${
                        occasion === occ
                          ? 'bg-neutral-900 text-white font-medium border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dress Code Note */}
              <div className="text-[11px] text-neutral-500 p-3 bg-neutral-50 rounded border border-neutral-100 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dress Code: </strong>Smart Elegant. Athletic wear and beachwear are not permitted in our dining rooms.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Dietary Needs & Contact Details */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-neutral-900 font-normal">
                  Guest Information & Dietary
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  We take pride in tailoring each course to your dietary traditions.
                </p>
              </div>

              {/* Dietary Checkboxes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                  Dietary Sensibilities (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {dietaryOptions.map((opt) => {
                    const active = dietary.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleDietary(opt)}
                        className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors ${
                          active
                            ? 'border-red-700 bg-red-50 text-red-900 font-medium'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {active && <CheckCircle2 className="w-3.5 h-3.5 text-red-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Form Inputs */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Primary Guest Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="e.g. Rohini Sharma"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-red-700"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        placeholder="e.g. rohini@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-red-700"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Telephone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="tel"
                        placeholder="e.g. +91 98200 12345"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-red-700"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Special Inquiries or Wine Preferences (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Window view preferred, celebrating 10th anniversary, Sommelier pairing flight..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-red-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation Pass */}
          {step === 5 && confirmedReservation && (
            <div className="space-y-6">
              
              {/* Success Badge */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
                  Table Confirmed
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  We look forward to welcoming you to Aura {confirmedReservation.cityName}.
                </p>
              </div>

              {/* Digital Dining Pass Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                      Booking Reference
                    </span>
                    <div className="text-base sm:text-lg font-mono font-bold text-neutral-900 tracking-wider">
                      {confirmedReservation.referenceNo}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[11px] font-semibold rounded">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 uppercase text-[10px] block">Location</span>
                    <span className="font-medium text-neutral-800">Aura {confirmedReservation.cityName}</span>
                    <div className="text-[11px] text-neutral-500">{confirmedReservation.diningArea}</div>
                  </div>

                  <div>
                    <span className="text-neutral-400 uppercase text-[10px] block">Date & Time</span>
                    <span className="font-medium text-neutral-800">{confirmedReservation.date}</span>
                    <div className="text-[11px] text-neutral-500">{confirmedReservation.timeSlot} ({confirmedReservation.serviceType})</div>
                  </div>

                  <div>
                    <span className="text-neutral-400 uppercase text-[10px] block">Party</span>
                    <span className="font-medium text-neutral-800">{confirmedReservation.guests} Guests</span>
                    <div className="text-[11px] text-neutral-500">{confirmedReservation.occasion}</div>
                  </div>

                  <div>
                    <span className="text-neutral-400 uppercase text-[10px] block">Guest Contact</span>
                    <span className="font-medium text-neutral-800">{confirmedReservation.guestName}</span>
                    <div className="text-[11px] text-neutral-500">{confirmedReservation.guestPhone}</div>
                  </div>
                </div>

                {confirmedReservation.dietaryPreferences.length > 0 && (
                  <div className="pt-2 border-t border-neutral-200 text-xs">
                    <span className="text-neutral-400 text-[10px] uppercase block mb-1">Dietary Focus:</span>
                    <div className="flex flex-wrap gap-1">
                      {confirmedReservation.dietaryPreferences.map((d) => (
                        <span key={d} className="px-2 py-0.5 bg-neutral-200/70 rounded text-[11px] text-neutral-700">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Calendar download + Close */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadICS}
                  className="w-full sm:w-1/2 py-2.5 px-4 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-neutral-500" />
                  <span>{calendarDownloaded ? 'Calendar Saved (.ics)' : 'Add to Calendar (.ics)'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full sm:w-1/2 py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Actions (Steps 1 to 4) */}
        {step < 5 && (
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold uppercase tracking-wider rounded shadow-xs transition-colors"
            >
              <span>{step === 4 ? 'Confirm Reservation' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
