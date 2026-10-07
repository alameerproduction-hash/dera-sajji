export const IMAGES = {
  heroSajji: '/src/assets/images/hero_pakistani_sajji_1791321851446.jpg',
  deraSpecialSajji: '/src/assets/images/dish_dera_special_sajji_1791321865333.jpg',
  sajjiPreparation:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjMSJd27Ibb3VS4k434C0kDTaJOgnBBE8G-H_OcznMZHCeBLu2RnJSq60&s=10',
  sajjiServing: '/src/assets/images/sajji_traditional_serving_1791323735195.jpg',
  deraAmbience: '/src/assets/images/experience_dera_ambience_1791321917591.jpg',
  bbqComingSoonEmbers: '/src/assets/images/bbq_charcoal_embers_teaser_1791323747116.jpg',
};

export const RESTAURANT_INFO = {
  name: 'Dera Sajji',
  tagline: 'Authentic Sajji. Bold Pakistani Flavor.',
  footerSubtitle: 'Authentic Sajji • Gujranwala',
  category: 'Sajji Restaurant',
  address:
    'Service Rd, opposite D Point Mobile Market, near Alfalah Bank, Mohalla Raitanwala, Krishan Nagar, Gujranwala, Pakistan',
  shortLocation: 'Krishan Nagar, Gujranwala',
  phoneDisplay: '+92 302 7511000',
  phoneTel: '+923027511000',
  whatsappNumber: '923027511000',
  whatsappDefaultMsg: 'Assalam o Alaikum, I would like to know about Dera Sajji.',
  openingHours: '12:00 PM – 3:00 AM',
  mapsDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Dera+Sajji+Service+Rd+opposite+D+Point+Mobile+Market+near+Alfalah+Bank+Mohalla+Raitanwala+Krishan+Nagar+Gujranwala+Pakistan',
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=Service%20Rd,%20Krishan%20Nagar,%20Gujranwala,%20Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed',
};

export interface RateListItem {
  id: string;
  name: string;
  price: string;
}

export const SAJJI_RATE_LIST: RateListItem[] = [
  {
    id: 'rate-full-sajji',
    name: 'Full Sajji bamaa Rice',
    price: 'Rs. 2000/-',
  },
  {
    id: 'rate-half-sajji',
    name: 'Half Sajji bamaa Rice',
    price: 'Rs. 1100/-',
  },
  {
    id: 'rate-quarter-sajji',
    name: 'Quarter Sajji bamaa Rice',
    price: 'Rs. 650/-',
  },
];

export const SAJJI_EXTRAS: RateListItem[] = [
  {
    id: 'extra-sauce',
    name: 'Sauce',
    price: 'Rs. 50/-',
  },
  {
    id: 'extra-raita',
    name: 'Raita Plate',
    price: 'Rs. 50/-',
  },
  {
    id: 'extra-rice',
    name: 'Rice Plate',
    price: 'Rs. 250',
  },
];

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  src: string;
  alt: string;
  spanClass: string;
  aspectClass: string;
}

/**
 * Gallery strictly focused ONLY on:
 * - Sajji
 * - Sajji preparation
 * - Sajji serving
 * - Restaurant atmosphere
 * - Dera Sajji branding
 * - Traditional Pakistani dining atmosphere
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-sajji-1',
    title: 'Dera Special Sajji',
    category: 'Signature Sajji',
    caption: 'Authentic Pakistani Sajji prepared with rich traditional flavor and served fresh.',
    src: IMAGES.heroSajji,
    alt: 'Dera Sajji — Traditional Pakistani Sajji served fresh in Gujranwala',
    spanClass: 'md:col-span-2 md:row-span-2',
    aspectClass: 'aspect-[16/10] md:aspect-auto md:h-full min-h-[280px]',
  },
  {
    id: 'gal-sajji-2',
    title: 'Traditional Sajji Preparation',
    category: 'Sajji Preparation',
    caption: 'Slow-roasted with care around glowing embers for authentic Pakistani character.',
    src: IMAGES.sajjiPreparation,
    alt: 'Traditional Pakistani Sajji roasting preparation at Dera Sajji',
    spanClass: 'md:col-span-1',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-sajji-3',
    title: 'Freshly Prepared Sajji Serving',
    category: 'Sajji Serving',
    caption: 'Presented warm with traditional Pakistani hospitality in Krishan Nagar, Gujranwala.',
    src: IMAGES.sajjiServing,
    alt: 'Freshly roasted Pakistani Sajji plated on a traditional serving platter',
    spanClass: 'md:col-span-1',
    aspectClass: 'aspect-[4/3]',
  },
  {
    id: 'gal-sajji-4',
    title: 'Traditional Pakistani Dining Atmosphere',
    category: 'Restaurant Atmosphere',
    caption: 'Experience the welcoming warmth and heritage setting of Dera Sajji until 3:00 AM.',
    src: IMAGES.deraAmbience,
    alt: 'Dera Sajji restaurant atmosphere and traditional Pakistani dining setting in Gujranwala',
    spanClass: 'md:col-span-2',
    aspectClass: 'aspect-[16/9]',
  },
  {
    id: 'gal-sajji-5',
    title: 'The Art of Pakistani Sajji',
    category: 'Dera Sajji Craft',
    caption: 'Every detail is centered around delivering the traditional taste of Pakistani Sajji.',
    src: IMAGES.deraSpecialSajji,
    alt: 'Close-up presentation of Dera Special Sajji',
    spanClass: 'md:col-span-1',
    aspectClass: 'aspect-[4/3]',
  },
];
