export type DietaryTag = 'veg' | 'vegan' | 'gluten-free' | 'halal' | 'jain-available' | 'chef-signature';

export interface CityLocation {
  id: string;
  name: string;
  country: string;
  regionLabel: string;
  address: string;
  district: string;
  headChef: string;
  sommelier: string;
  hours: {
    lunch: string;
    dinner: string;
  };
  phone: string;
  email: string;
  currency: 'USD' | 'INR' | 'GBP' | 'EUR' | 'AED' | 'SGD' | 'JPY';
  currencySymbol: string;
  signatureDish: string;
  description: string;
  availableAreas: string[];
}

export type MenuCategory = 
  | 'all'
  | 'indian-heritage'
  | 'global-haute'
  | 'botanical-earth'
  | 'desserts'
  | 'cellar-mixology';

export interface MenuItem {
  id: string;
  name: string;
  nativeTitle?: string;
  origin: string;
  category: MenuCategory;
  priceUSD: number;
  description: string;
  dietary: DietaryTag[];
  pairingNote: string;
  image?: string;
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'culinary' | 'spaces' | 'mixology';
  categoryLabel: string;
  caption: string;
  originOrLocation: string;
  image: string;
}

export interface Reservation {
  id: string;
  referenceNo: string;
  cityId: string;
  cityName: string;
  date: string;
  timeSlot: string;
  serviceType: 'Lunch' | 'High Tea' | 'Dinner';
  guests: number;
  diningArea: string;
  occasion: string;
  dietaryPreferences: string[];
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export type Currency = 'USD' | 'INR' | 'GBP' | 'EUR' | 'AED';
