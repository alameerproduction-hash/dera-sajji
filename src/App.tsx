import React, { useState, useEffect } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Menu as MenuIcon,
  X,
  Flame,
  Utensils,
  Award,
  Moon,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Navigation,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FallbackImage from './components/FallbackImage';
import AdminPortal from './components/AdminPortal';
import {
  IMAGES,
  RESTAURANT_INFO,
  GALLERY_ITEMS,
  SAJJI_RATE_LIST,
  SAJJI_EXTRAS,
  RateListItem,
  GalleryItem,
  CustomerInquiry,
} from './data/restaurantData';

export type PageId = 'home' | 'about' | 'sajji' | 'gallery' | 'location' | 'contact' | 'admin';

const PAGES: { id: PageId; label: string; title: string; hideInMainNav?: boolean }[] = [
  { id: 'home', label: 'Home', title: 'Dera Sajji — Authentic Pakistani Sajji in Gujranwala' },
  { id: 'about', label: 'About', title: 'About Us — The Art of Sajji | Dera Sajji' },
  { id: 'sajji', label: 'Sajji', title: 'Our Signature Sajji & Rate List | Dera Sajji' },
  { id: 'gallery', label: 'Gallery', title: 'Sajji & Restaurant Gallery | Dera Sajji' },
  { id: 'location', label: 'Location', title: 'Visit Dera Sajji — Krishan Nagar, Gujranwala' },
  { id: 'contact', label: 'Contact', title: 'Contact & Inquiry | Dera Sajji Gujranwala' },
  {
    id: 'admin',
    label: 'Admin Portal',
    title: 'Owner Admin Portal | Dera Sajji',
    hideInMainNav: true,
  },
];

const DEFAULT_BBQ_ANNOUNCEMENT = {
  badge: 'UPCOMING ANNOUNCEMENT • NOT CURRENTLY AVAILABLE',
  heading: 'BBQ',
  subheading: 'COMING SOON',
  description:
    'Something delicious is on the way. Our BBQ selection is coming soon to Dera Sajji.',
  enabled: true,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Persistent Admin-Managed States
  const [rateList, setRateList] = useState<RateListItem[]>(() => {
    try {
      const saved = localStorage.getItem('ds_rate_list');
      return saved ? JSON.parse(saved) : SAJJI_RATE_LIST;
    } catch {
      return SAJJI_RATE_LIST;
    }
  });

  const [extrasList, setExtrasList] = useState<RateListItem[]>(() => {
    try {
      const saved = localStorage.getItem('ds_extras_list');
      return saved ? JSON.parse(saved) : SAJJI_EXTRAS;
    } catch {
      return SAJJI_EXTRAS;
    }
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem('ds_gallery_items');
      if (!saved) return GALLERY_ITEMS;
      const parsed: GalleryItem[] = JSON.parse(saved);
      const hasLegacyPaths = parsed.some(
        (item) => typeof item.src === 'string' && item.src.startsWith('/src/assets/')
      );
      if (hasLegacyPaths) {
        return GALLERY_ITEMS;
      }
      return parsed;
    } catch {
      return GALLERY_ITEMS;
    }
  });

  const [restaurantInfo, setRestaurantInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_restaurant_info');
      return saved ? JSON.parse(saved) : RESTAURANT_INFO;
    } catch {
      return RESTAURANT_INFO;
    }
  });

  const [bbqAnnouncement, setBbqAnnouncement] = useState(() => {
    try {
      const saved = localStorage.getItem('ds_bbq_announcement');
      return saved ? JSON.parse(saved) : DEFAULT_BBQ_ANNOUNCEMENT;
    } catch {
      return DEFAULT_BBQ_ANNOUNCEMENT;
    }
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('ds_inquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ds_rate_list', JSON.stringify(rateList));
  }, [rateList]);

  useEffect(() => {
    localStorage.setItem('ds_extras_list', JSON.stringify(extrasList));
  }, [extrasList]);

  useEffect(() => {
    localStorage.setItem('ds_gallery_items', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('ds_restaurant_info', JSON.stringify(restaurantInfo));
  }, [restaurantInfo]);

  useEffect(() => {
    localStorage.setItem('ds_bbq_announcement', JSON.stringify(bbqAnnouncement));
  }, [bbqAnnouncement]);

  useEffect(() => {
    localStorage.setItem('ds_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const handleResetAllToDefault = () => {
    setRateList(SAJJI_RATE_LIST);
    setExtrasList(SAJJI_EXTRAS);
    setGalleryItems(GALLERY_ITEMS);
    setRestaurantInfo(RESTAURANT_INFO);
    setBbqAnnouncement(DEFAULT_BBQ_ANNOUNCEMENT);
  };

  // Simple Inquiry Form State (Name, Phone Number, Message)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Sync URL Hash & Document Title for Multi-Page Navigation
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase() as PageId;
      const validPage = PAGES.find((p) => p.id === hash);
      if (validPage) {
        setCurrentPage(validPage.id);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    const pageMeta = PAGES.find((p) => p.id === currentPage);
    if (pageMeta) {
      document.title = pageMeta.title;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.history.pushState(null, '', `#${page}`);
  };

  // Sticky Header Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Navigation for Fullscreen Gallery Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null && galleryItems.length > 0 ? (prev + 1) % galleryItems.length : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null && galleryItems.length > 0
            ? (prev - 1 + galleryItems.length) % galleryItems.length
            : null
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, galleryItems.length]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now()}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
      createdAt: new Date().toLocaleString(),
      status: 'new',
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    setInquirySubmitted(true);
  };

  const buildWhatsAppInquiryUrl = () => {
    const lines = [
      'Assalam o Alaikum, I would like to know about Dera Sajji.',
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      formData.message ? `Message: ${formData.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${restaurantInfo.whatsappNumber}?text=${encodeURIComponent(lines)}`;
  };

  const defaultWhatsAppUrl = `https://wa.me/${
    restaurantInfo.whatsappNumber
  }?text=${encodeURIComponent(restaurantInfo.whatsappDefaultMsg)}`;

  // Header uses solid white styling on subpages or when scrolled on Home
  const useSolidHeader = currentPage !== 'home' || isScrolled;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#171717]">
      {/* =====================================================================
          STICKY MULTI-PAGE NAVIGATION BAR (3-Zone Top Bar Contract)
      ===================================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          useSolidHeader
            ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#9E1717]/15 shadow-sm py-3.5'
            : 'bg-gradient-to-b from-black/75 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Single Text Element Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className={`font-serif-display text-2xl sm:text-[26px] font-extrabold tracking-[0.16em] uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              useSolidHeader ? 'text-[#9E1717]' : 'text-white'
            }`}
          >
            DERA SAJJI
          </button>

          {/* Zone 2: Multi-Page Navigation Links (Home, About, Sajji, Gallery, Location, Contact) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 lg:gap-9"
          >
            {PAGES.filter((p) => !p.hideInMainNav).map((page) => {
              const isActive = currentPage === page.id;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => navigateTo(page.id)}
                  className={`text-sm font-semibold tracking-wide transition-colors whitespace-nowrap relative py-1 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-200 ${
                    isActive
                      ? useSolidHeader
                        ? 'text-[#9E1717] after:w-full after:bg-[#9E1717]'
                        : 'text-white after:w-full after:bg-white'
                      : useSolidHeader
                        ? 'text-[#171717]/75 hover:text-[#9E1717] after:w-0 hover:after:w-full after:bg-[#9E1717]'
                        : 'text-white/85 hover:text-white after:w-0 hover:after:w-full after:bg-white'
                  }`}
                >
                  {page.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: CTA Button "CALL NOW" + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${restaurantInfo.phoneTel}`}
              className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 whitespace-nowrap shrink-0 shadow-sm ${
                useSolidHeader
                  ? 'bg-[#9E1717] text-white hover:bg-[#650D0D]'
                  : 'bg-[#9E1717] text-white hover:bg-[#C62828] border border-white/20'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>CALL NOW</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border transition-colors ${
                useSolidHeader
                  ? 'border-[#9E1717]/20 text-[#171717] hover:bg-[#FAF7F5]'
                  : 'border-white/25 text-white hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden bg-[#FFFFFF] border-b border-[#9E1717]/20 shadow-xl px-4 pt-3 pb-6"
            >
              <nav className="flex flex-col space-y-1">
                {PAGES.map((page) => {
                  const isActive = currentPage === page.id;
                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => navigateTo(page.id)}
                      className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between text-left ${
                        isActive
                          ? 'bg-[#9E1717] text-white'
                          : 'text-[#171717] hover:bg-[#FAF7F5] hover:text-[#9E1717]'
                      }`}
                    >
                      <span>{page.label}</span>
                      <ArrowUpRight
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#9E1717]/60'}`}
                      />
                    </button>
                  );
                })}
              </nav>
              <div className="mt-4 pt-4 border-t border-[#9E1717]/10 flex flex-col gap-2.5">
                <a
                  href={`tel:${restaurantInfo.phoneTel}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#9E1717] text-white text-sm font-semibold tracking-[0.1em] uppercase hover:bg-[#650D0D] transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>CALL NOW • {restaurantInfo.phoneDisplay}</span>
                </a>
                <div className="flex items-center justify-center gap-2 text-xs text-[#171717]/70 pt-1">
                  <Clock className="w-3.5 h-3.5 text-[#9E1717]" />
                  <span>Open Daily: {restaurantInfo.openingHours}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =====================================================================
          MAIN MULTI-PAGE VIEWPORT CONTENT
      ===================================================================== */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* =================================================================
              PAGE 1: HOME PAGE
              - Cinematic Full-Screen Hero
              - Why Dera Sajji (4 Pillars)
              - Signature Sajji Preview & Rate List Highlights
              - BBQ Coming Soon Announcement
          ================================================================= */}
          {currentPage === 'home' && (
            <motion.div
              key="page-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* HERO SECTION */}
              <section className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#650D0D] pt-24 pb-16">
                <div className="absolute inset-0 z-0">
                  <FallbackImage
                    src={IMAGES.heroSajji}
                    alt="Traditional Pakistani Sajji prepared fresh at Dera Sajji in Krishan Nagar, Gujranwala"
                    variant="hero"
                    eager={true}
                    containerClassName="w-full h-full"
                    className="animate-hero-zoom"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-10 bg-gradient-to-r from-[#3D0606]/90 via-[#650D0D]/80 to-[#171717]/75"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-10 bg-gradient-to-t from-[#171717]/90 via-transparent to-black/50"
                  />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-20">
                  <div className="max-w-3xl">
                    {/* Location Badge & Brand Name */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="flex flex-wrap items-center gap-3 mb-5"
                    >
                      <button
                        type="button"
                        onClick={() => navigateTo('location')}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#9E1717]/90 hover:bg-[#C62828] border border-white/20 text-white text-xs font-medium tracking-wider uppercase shadow-sm transition-colors cursor-pointer"
                      >
                        <span>📍 Krishan Nagar, Gujranwala</span>
                      </button>
                      <span className="text-white/60 text-xs hidden sm:inline" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-white/95 text-xs font-semibold tracking-[0.22em] uppercase">
                        DERA SAJJI
                      </span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight text-balance mb-6"
                    >
                      Authentic Sajji.{' '}
                      <span className="block font-editorial font-extrabold text-[#FAF7F5]">
                        Bold Pakistani Flavor.
                      </span>
                    </motion.h1>

                    {/* Supporting Text */}
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
                      className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mb-9 font-normal"
                    >
                      Traditional Sajji, prepared with authentic Pakistani flavor and served fresh
                      in the heart of Gujranwala.
                    </motion.p>

                    {/* Buttons: EXPLORE SAJJI + CALL NOW */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.65, delay: 0.48, ease: 'easeOut' }}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => navigateTo('sajji')}
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#9E1717] hover:bg-[#C62828] text-white text-sm font-semibold tracking-[0.14em] uppercase transition-all duration-200 shadow-lg border border-white/15 whitespace-nowrap cursor-pointer"
                      >
                        <span>EXPLORE SAJJI</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>

                      <a
                        href={`tel:${RESTAURANT_INFO.phoneTel}`}
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-[#650D0D] hover:bg-[#FAF7F5] text-sm font-semibold tracking-[0.14em] uppercase transition-all duration-200 shadow-lg whitespace-nowrap"
                      >
                        <Phone className="w-4 h-4 text-[#9E1717]" />
                        <span>CALL NOW</span>
                      </a>
                    </motion.div>

                    {/* Verified Info Bar */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.65 }}
                      className="mt-12 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/85 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-[#C62828] shrink-0" />
                        <span>
                          Open Daily:{' '}
                          <strong className="text-white tabular-nums">12:00 PM – 3:00 AM</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-[#C62828] shrink-0" />
                        <a
                          href={`tel:${RESTAURANT_INFO.phoneTel}`}
                          className="hover:text-white underline-offset-4 hover:underline tabular-nums font-medium"
                        >
                          {RESTAURANT_INFO.phoneDisplay}
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Flame className="w-4 h-4 text-[#C62828] shrink-0" />
                        <span>Sajji Specialists • Gujranwala</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* WHY DERA SAJJI (4 Feature Cards) */}
              <section className="py-20 lg:py-24 bg-[#FAF7F5] border-b border-[#9E1717]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#9E1717] block mb-2">
                      OUR PROMISE
                    </span>
                    <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                      WHY DERA SAJJI
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#9E1717]/15 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-[#9E1717] text-white flex items-center justify-center mb-5 shadow-sm">
                        <Flame className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif-display text-xl font-extrabold text-[#171717] mb-2 uppercase tracking-wide">
                        AUTHENTIC SAJJI
                      </h3>
                      <p className="text-sm text-[#171717]/75 leading-relaxed">
                        Traditional Pakistani Sajji experience.
                      </p>
                    </div>

                    <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#9E1717]/15 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-[#9E1717] text-white flex items-center justify-center mb-5 shadow-sm">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif-display text-xl font-extrabold text-[#171717] mb-2 uppercase tracking-wide">
                        FRESHLY PREPARED
                      </h3>
                      <p className="text-sm text-[#171717]/75 leading-relaxed">
                        Prepared fresh for a flavorful experience.
                      </p>
                    </div>

                    <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#9E1717]/15 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-[#9E1717] text-white flex items-center justify-center mb-5 shadow-sm">
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif-display text-xl font-extrabold text-[#171717] mb-2 uppercase tracking-wide">
                        TRADITIONAL TASTE
                      </h3>
                      <p className="text-sm text-[#171717]/75 leading-relaxed">
                        A focus on authentic Pakistani flavor.
                      </p>
                    </div>

                    <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#9E1717]/15 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-[#9E1717] text-white flex items-center justify-center mb-5 shadow-sm">
                        <Moon className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif-display text-xl font-extrabold text-[#171717] mb-2 uppercase tracking-wide">
                        OPEN LATE
                      </h3>
                      <p className="text-sm text-[#171717]/75 leading-relaxed">
                        Serving guests until{' '}
                        <strong className="text-[#9E1717] tabular-nums">3:00 AM</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* HOME FEATURED SAJJI & RATE LIST SPOTLIGHT */}
              <section className="py-20 lg:py-24 bg-[#FFFFFF] border-b border-[#9E1717]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#9E1717]/20 shadow-xl">
                      <FallbackImage
                        src={IMAGES.deraSpecialSajji}
                        alt="Dera Special Sajji — Authentic Pakistani Sajji"
                        variant="food"
                        aspectRatioClass="aspect-[4/3]"
                      />
                    </div>
                    <div className="lg:col-span-6 space-y-6">
                      <span className="inline-block px-3.5 py-1 rounded-full bg-[#9E1717]/10 border border-[#9E1717]/30 text-[#9E1717] text-xs font-semibold tracking-[0.2em] uppercase">
                        SAJJI SPECIALISTS
                      </span>
                      <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                        DERA SPECIAL SAJJI
                      </h2>
                      <p className="text-base text-[#171717]/80 leading-relaxed">
                        Authentic Pakistani Sajji prepared with rich traditional flavor and served
                        fresh in Krishan Nagar, Gujranwala.
                      </p>

                      {/* Quick Rate List Preview */}
                      <div className="rounded-2xl bg-[#FAF7F5] border border-[#9E1717]/20 p-5 space-y-2.5">
                        <div className="text-xs font-extrabold tracking-wider uppercase text-[#9E1717] pb-2 border-b border-[#9E1717]/15">
                          🍗 DERA SAJJI – RATE LIST 🍗
                        </div>
                        {rateList.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm font-semibold text-[#171717]"
                          >
                            <span>{item.name}</span>
                            <span className="font-serif-display font-extrabold text-[#9E1717] tabular-nums">
                              {item.price}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button
                          type="button"
                          onClick={() => navigateTo('sajji')}
                          className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#9E1717] hover:bg-[#650D0D] text-white text-xs font-semibold tracking-[0.14em] uppercase transition-colors shadow-md cursor-pointer"
                        >
                          <span>VIEW FULL SAJJI PAGE &amp; EXTRAS</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('about')}
                          className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-[#9E1717]/30 text-[#9E1717] hover:bg-[#FAF7F5] text-xs font-semibold tracking-[0.14em] uppercase transition-colors cursor-pointer"
                        >
                          <span>THE ART OF SAJJI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* BBQ — COMING SOON ANNOUNCEMENT */}
              {bbqAnnouncement.enabled && (
                <section className="relative py-24 lg:py-32 bg-[#650D0D] text-white overflow-hidden">
                  <div className="absolute inset-0 z-0 opacity-45">
                    <FallbackImage
                      src={IMAGES.bbqComingSoonEmbers}
                      alt="Glowing charcoal embers teaser for upcoming BBQ at Dera Sajji"
                      variant="hero"
                      decorative={true}
                      containerClassName="w-full h-full"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 z-10 bg-gradient-to-r from-[#3D0606]/95 via-[#650D0D]/85 to-[#3D0606]/95"
                    />
                  </div>

                  <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="rounded-3xl bg-[#3D0606]/60 backdrop-blur-sm border border-white/20 p-8 sm:p-14 shadow-2xl">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9E1717] border border-white/25 text-xs font-semibold tracking-[0.22em] uppercase text-white mb-5">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{bbqAnnouncement.badge}</span>
                      </div>

                      <h2 className="font-serif-display text-2xl sm:text-3xl font-extrabold tracking-[0.28em] uppercase text-white/90 mb-2">
                        {bbqAnnouncement.heading}
                      </h2>

                      <h3 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none mb-6">
                        {bbqAnnouncement.subheading}
                      </h3>

                      <div
                        className="flex items-center justify-center gap-3 max-w-xs mx-auto mb-6"
                        aria-hidden="true"
                      >
                        <span className="h-[1px] flex-1 bg-white/30" />
                        <span className="w-2 h-2 rotate-45 bg-[#C62828] border border-white/50" />
                        <span className="h-[1px] flex-1 bg-white/30" />
                      </div>

                      <p className="text-lg sm:text-2xl text-[#FAF7F5] leading-relaxed max-w-2xl mx-auto">
                        {bbqAnnouncement.description}
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {/* =================================================================
              PAGE 2: ABOUT PAGE ("THE ART OF SAJJI")
          ================================================================= */}
          {currentPage === 'about' && (
            <motion.div
              key="page-about"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-20"
            >
              {/* Subpage Hero Header */}
              <div className="bg-[#650D0D] text-white py-14 sm:py-20 border-b border-[#9E1717]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#9E1717] border border-white/20 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                    SAJJI SPECIALISTS
                  </span>
                  <h1 className="font-serif-display text-3xl sm:text-5xl font-extrabold tracking-tight">
                    THE ART OF SAJJI
                  </h1>
                  <p className="text-sm sm:text-base text-white/85 mt-3 max-w-2xl">
                    Dera Sajji is dedicated to one thing — authentic, flavorful Sajji in the heart
                    of Gujranwala.
                  </p>
                </div>
              </div>

              {/* Split-Screen About Section */}
              <section className="py-16 lg:py-24 bg-[#FFFFFF] border-b border-[#9E1717]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Left Side: Reference Sajji Image */}
                    <div className="lg:col-span-6 relative">
                      <div
                        aria-hidden="true"
                        className="hidden sm:block absolute -top-4 -left-4 w-full h-full rounded-2xl border border-[#9E1717]/25 pointer-events-none"
                      />
                      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#9E1717]/15">
                        <FallbackImage
                          src={IMAGES.sajjiPreparation}
                          backupSrc={IMAGES.sajjiPreparationLocal}
                          alt="The Art of Sajji — Authentic Pakistani Sajji freshly prepared at Dera Sajji"
                          variant="food"
                          aspectRatioClass="aspect-[4/3]"
                          className="hover:scale-105 transition-transform duration-700"
                        />
                        <div className="bg-[#650D0D] text-white px-6 py-4 flex items-center justify-between">
                          <span className="font-serif-display text-xs sm:text-sm tracking-[0.15em] uppercase">
                            DERA SAJJI • GUJRANWALA
                          </span>
                          <span className="text-xs text-white/85 tabular-nums">
                            12:00 PM – 3:00 AM
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Split-Screen Editorial Narrative */}
                    <div className="lg:col-span-6 flex flex-col items-start">
                      <div className="inline-flex items-center gap-3 mb-4">
                        <span className="px-3.5 py-1 rounded-full bg-[#9E1717]/10 border border-[#9E1717]/30 text-[#9E1717] text-xs font-semibold tracking-[0.2em] uppercase">
                          SAJJI SPECIALISTS
                        </span>
                        <span className="h-[1px] w-12 bg-[#9E1717]/40" aria-hidden="true" />
                      </div>

                      <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight leading-[1.15] text-balance mb-6">
                        THE ART OF SAJJI
                      </h2>

                      <div
                        className="flex items-center gap-3 w-full max-w-xs mb-6"
                        aria-hidden="true"
                      >
                        <div className="h-[2px] w-16 bg-[#9E1717]" />
                        <div className="w-2 h-2 rotate-45 border border-[#9E1717]" />
                        <div className="h-[1px] flex-1 bg-[#9E1717]/25" />
                      </div>

                      <p className="text-lg sm:text-xl font-bold text-[#171717] leading-relaxed mb-4">
                        Dera Sajji is dedicated to one thing — authentic, flavorful Sajji.
                      </p>

                      <p className="text-base sm:text-lg text-[#171717]/80 leading-relaxed mb-8">
                        &ldquo;From the preparation to the final serving, every detail is centered
                        around delivering the traditional taste and character of Pakistani
                        Sajji.&rdquo;
                      </p>

                      <div className="w-full pt-6 border-t border-[#9E1717]/15 flex flex-wrap items-center gap-4">
                        <button
                          type="button"
                          onClick={() => navigateTo('sajji')}
                          className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#9E1717] hover:bg-[#650D0D] text-white text-xs font-semibold tracking-[0.14em] uppercase transition-colors shadow-md cursor-pointer"
                        >
                          <span>EXPLORE OUR SIGNATURE SAJJI</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo('location')}
                          className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-[#9E1717]/30 text-[#9E1717] hover:bg-[#FAF7F5] text-xs font-semibold tracking-[0.14em] uppercase transition-colors cursor-pointer"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>VISIT IN GUJRANWALA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Why Dera Sajji Pillars on About Page */}
              <section className="py-16 lg:py-20 bg-[#FAF7F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#9E1717]/15 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#9E1717] text-white flex items-center justify-center mb-5">
                        <Flame className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif-display text-lg font-extrabold text-[#171717] mb-2 uppercase">
                        AUTHENTIC SAJJI
                      </h3>
                      <p className="text-sm text-[#171717]/75">
                        Traditional Pakistani Sajji experience.
                      </p>
                    </div>
                    <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#9E1717]/15 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#9E1717] text-white flex items-center justify-center mb-5">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif-display text-lg font-extrabold text-[#171717] mb-2 uppercase">
                        FRESHLY PREPARED
                      </h3>
                      <p className="text-sm text-[#171717]/75">
                        Prepared fresh for a flavorful experience.
                      </p>
                    </div>
                    <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#9E1717]/15 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#9E1717] text-white flex items-center justify-center mb-5">
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif-display text-lg font-extrabold text-[#171717] mb-2 uppercase">
                        TRADITIONAL TASTE
                      </h3>
                      <p className="text-sm text-[#171717]/75">
                        A focus on authentic Pakistani flavor.
                      </p>
                    </div>
                    <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#9E1717]/15 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#9E1717] text-white flex items-center justify-center mb-5">
                        <Moon className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif-display text-lg font-extrabold text-[#171717] mb-2 uppercase">
                        OPEN LATE
                      </h3>
                      <p className="text-sm text-[#171717]/75">
                        Serving guests until{' '}
                        <strong className="text-[#9E1717] tabular-nums">3:00 AM</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* =================================================================
              PAGE 3: SAJJI PAGE ("OUR SIGNATURE SAJJI" + OFFICIAL RATE LIST + BBQ COMING SOON)
          ================================================================= */}
          {currentPage === 'sajji' && (
            <motion.div
              key="page-sajji"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-20"
            >
              {/* Subpage Header */}
              <div className="bg-[#650D0D] text-white py-14 sm:py-20 border-b border-[#9E1717]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#9E1717] border border-white/20 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                    THE HOUSE SPECIALTY
                  </span>
                  <h1 className="font-serif-display text-3xl sm:text-5xl font-extrabold tracking-tight">
                    OUR SIGNATURE SAJJI
                  </h1>
                  <p className="text-sm sm:text-base text-white/85 mt-3 max-w-2xl">
                    Authentic Pakistani Sajji prepared with rich traditional flavor and served
                    fresh in Gujranwala.
                  </p>
                </div>
              </div>

              {/* Main Signature Sajji Presentation + Rate List */}
              <section className="py-16 lg:py-24 bg-[#FAF7F5] border-b border-[#9E1717]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="relative rounded-3xl bg-[#FFFFFF] p-3 sm:p-5 border-2 border-[#9E1717]/25 shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-[#9E1717]/15">
                      {/* Cinematic Sajji Photography */}
                      <div className="lg:col-span-7 relative overflow-hidden bg-[#650D0D]">
                        <FallbackImage
                          src={IMAGES.deraSpecialSajji}
                          alt="Dera Special Sajji — Authentic Pakistani Sajji prepared with rich traditional flavor and served fresh"
                          variant="food"
                          aspectRatioClass="aspect-[16/11] lg:aspect-auto lg:h-full min-h-[340px]"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 z-20">
                          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#650D0D]/90 border border-white/25 text-white text-xs font-semibold tracking-[0.18em] uppercase shadow-md">
                            <Flame className="w-3.5 h-3.5 text-[#C62828]" />
                            <span>SIGNATURE SPECIALTY</span>
                          </span>
                        </div>
                      </div>

                      {/* Presentation Content & Official Rate List */}
                      <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#FFFFFF] relative">
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#9E1717]">
                            <span>DERA SAJJI</span>
                            <span aria-hidden="true">·</span>
                            <span>GUJRANWALA</span>
                          </div>

                          <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight leading-tight">
                            DERA SPECIAL SAJJI
                          </h2>

                          <div className="w-16 h-[2px] bg-[#9E1717]" aria-hidden="true" />

                          <p className="text-base text-[#171717]/80 leading-relaxed">
                            Authentic Pakistani Sajji prepared with rich traditional flavor and
                            served fresh.
                          </p>

                          {/* Official Dera Sajji Rate List */}
                          <div className="rounded-2xl bg-[#FAF7F5] border border-[#9E1717]/20 p-5 sm:p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-[#9E1717]/15 pb-3">
                              <span className="font-serif-display text-sm sm:text-base font-extrabold tracking-wider uppercase text-[#9E1717]">
                                🍗 DERA SAJJI – RATE LIST 🍗
                              </span>
                            </div>

                            {/* Main Sajji bamaa Rice Rates */}
                            <div className="space-y-3">
                              {rateList.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between gap-4 py-2 border-b border-[#171717]/10 last:border-b-0"
                                >
                                  <span className="text-sm sm:text-base font-semibold text-[#171717]">
                                    {item.name}
                                  </span>
                                  <span className="font-serif-display text-sm sm:text-base font-extrabold text-[#9E1717] tabular-nums whitespace-nowrap">
                                    {item.price}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Extras */}
                            <div className="pt-3 border-t border-[#9E1717]/15">
                              <span className="block text-xs font-bold tracking-[0.16em] uppercase text-[#650D0D] mb-2.5">
                                Extras:
                              </span>
                              <div className="space-y-2">
                                {extrasList.map((extra) => (
                                  <div
                                    key={extra.id}
                                    className="flex items-center justify-between gap-4 text-xs sm:text-sm"
                                  >
                                    <span className="font-medium text-[#171717]/85">
                                      {extra.name}
                                    </span>
                                    <span className="font-serif-display font-extrabold text-[#650D0D] tabular-nums whitespace-nowrap">
                                      {extra.price}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="pt-2">
                            <a
                              href={`tel:${RESTAURANT_INFO.phoneTel}`}
                              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#9E1717] hover:bg-[#650D0D] text-white text-sm font-semibold tracking-[0.14em] uppercase transition-all duration-200 shadow-md whitespace-nowrap"
                            >
                              <Phone className="w-4 h-4" />
                              <span>CALL TO ORDER</span>
                            </a>
                          </div>

                          <div className="pt-3 border-t border-[#9E1717]/10 flex items-center gap-2.5 text-xs text-[#171717]/65">
                            <Clock className="w-4 h-4 text-[#9E1717] shrink-0" />
                            <span>Served Fresh Daily • {RESTAURANT_INFO.openingHours}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* BBQ — COMING SOON SECTION */}
              <section className="relative py-20 lg:py-28 bg-[#650D0D] text-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-45">
                  <FallbackImage
                    src={IMAGES.bbqComingSoonEmbers}
                    alt="Glowing charcoal embers teaser for upcoming BBQ at Dera Sajji"
                    variant="hero"
                    decorative={true}
                    containerClassName="w-full h-full"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-10 bg-gradient-to-r from-[#3D0606]/95 via-[#650D0D]/85 to-[#3D0606]/95"
                  />
                </div>

                <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <div className="rounded-3xl bg-[#3D0606]/60 backdrop-blur-sm border border-white/20 p-8 sm:p-14 shadow-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9E1717] border border-white/25 text-xs font-semibold tracking-[0.22em] uppercase text-white mb-5">
                      <Flame className="w-3.5 h-3.5" />
                      <span>UPCOMING ANNOUNCEMENT • NOT CURRENTLY AVAILABLE</span>
                    </div>

                    <h2 className="font-serif-display text-2xl sm:text-3xl font-extrabold tracking-[0.28em] uppercase text-white/90 mb-2">
                      BBQ
                    </h2>

                    <h3 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none mb-6">
                      COMING SOON
                    </h3>

                    <p className="text-lg sm:text-xl text-[#FAF7F5] leading-relaxed max-w-2xl mx-auto">
                      Something delicious is on the way. Our BBQ selection is coming soon to Dera
                      Sajji.
                    </p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* =================================================================
              PAGE 4: GALLERY PAGE (Focused ONLY on Sajji & Restaurant Atmosphere)
          ================================================================= */}
          {currentPage === 'gallery' && (
            <motion.div
              key="page-gallery"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-20"
            >
              {/* Subpage Header */}
              <div className="bg-[#650D0D] text-white py-14 sm:py-20 border-b border-[#9E1717]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#9E1717] border border-white/20 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                    SAJJI &amp; ATMOSPHERE
                  </span>
                  <h1 className="font-serif-display text-3xl sm:text-5xl font-extrabold tracking-tight">
                    THE DERA SAJJI GALLERY
                  </h1>
                  <p className="text-sm sm:text-base text-white/85 mt-3 max-w-2xl">
                    Explore our traditional Sajji preparation, signature serving, and welcoming
                    Pakistani dining atmosphere in Gujranwala. Click any photograph to view
                    fullscreen.
                  </p>
                </div>
              </div>

              <section className="py-16 lg:py-24 bg-[#FFFFFF]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {galleryItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => setLightboxIndex(index)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setLightboxIndex(index);
                          }
                        }}
                        aria-label={`Open gallery image: ${item.title}`}
                        className={`group relative rounded-2xl overflow-hidden border border-[#9E1717]/15 shadow-sm cursor-pointer ${item.spanClass}`}
                      >
                        <FallbackImage
                          src={item.src}
                          backupSrc={IMAGES.sajjiPreparationLocal}
                          alt={item.alt}
                          variant="gallery"
                          aspectRatioClass={item.aspectClass}
                          className="group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 sm:p-6">
                          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#FAF7F5]/80 mb-1">
                            {item.category}
                          </span>
                          <h3 className="font-serif-display text-lg sm:text-xl font-extrabold text-white">
                            {item.title}
                          </h3>
                          <p className="text-xs text-white/80 mt-1 line-clamp-2">{item.caption}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* =================================================================
              PAGE 5: LOCATION PAGE ("VISIT DERA SAJJI")
          ================================================================= */}
          {currentPage === 'location' && (
            <motion.div
              key="page-location"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-20"
            >
              {/* Subpage Header */}
              <div className="bg-[#650D0D] text-white py-14 sm:py-20 border-b border-[#9E1717]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#9E1717] border border-white/20 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                    KRISHAN NAGAR, GUJRANWALA
                  </span>
                  <h1 className="font-serif-display text-3xl sm:text-5xl font-extrabold tracking-tight">
                    VISIT DERA SAJJI
                  </h1>
                  <p className="text-sm sm:text-base text-white/85 mt-3 max-w-2xl">
                    Find us on Service Rd, opposite D Point Mobile Market, near Alfalah Bank,
                    Mohalla Raitanwala, Krishan Nagar, Gujranwala.
                  </p>
                </div>
              </div>

              <section className="py-16 lg:py-24 bg-[#FAF7F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
                    {/* Location Details Card */}
                    <div className="lg:col-span-5 bg-[#FFFFFF] rounded-2xl p-8 sm:p-10 border border-[#9E1717]/20 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#9E1717]/10 text-[#9E1717] text-xs font-semibold tracking-[0.18em] uppercase mb-5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>KRISHAN NAGAR, GUJRANWALA</span>
                        </div>

                        <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight mb-6">
                          VISIT DERA SAJJI
                        </h2>

                        <div className="space-y-6">
                          {/* Address */}
                          <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[#9E1717] text-white flex items-center justify-center shrink-0 mt-0.5">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold tracking-[0.16em] uppercase text-[#9E1717] mb-1">
                                ADDRESS
                              </h3>
                              <p className="text-sm sm:text-base text-[#171717]/85 leading-relaxed">
                                📍 {RESTAURANT_INFO.address}
                              </p>
                            </div>
                          </div>

                          {/* Opening Hours */}
                          <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[#9E1717] text-white flex items-center justify-center shrink-0 mt-0.5">
                              <Clock className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold tracking-[0.16em] uppercase text-[#9E1717] mb-1">
                                OPENING HOURS
                              </h3>
                              <p className="text-base font-semibold text-[#171717] tabular-nums">
                                {RESTAURANT_INFO.openingHours}
                              </p>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-[#9E1717] text-white flex items-center justify-center shrink-0 mt-0.5">
                              <Phone className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold tracking-[0.16em] uppercase text-[#9E1717] mb-1">
                                PHONE
                              </h3>
                              <a
                                href={`tel:${RESTAURANT_INFO.phoneTel}`}
                                className="text-lg font-bold text-[#171717] hover:text-[#9E1717] transition-colors tabular-nums"
                              >
                                {RESTAURANT_INFO.phoneDisplay}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Buttons: GET DIRECTIONS + CALL NOW */}
                      <div className="mt-8 pt-6 border-t border-[#9E1717]/15 flex flex-col sm:flex-row gap-3.5">
                        <a
                          href={RESTAURANT_INFO.mapsDirectionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#9E1717] hover:bg-[#650D0D] text-white text-xs font-semibold tracking-[0.12em] uppercase transition-colors shadow-sm whitespace-nowrap"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>GET DIRECTIONS</span>
                        </a>
                        <a
                          href={`tel:${RESTAURANT_INFO.phoneTel}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[#9E1717] text-[#9E1717] hover:bg-[#9E1717] hover:text-white text-xs font-semibold tracking-[0.12em] uppercase transition-colors whitespace-nowrap"
                        >
                          <Phone className="w-4 h-4" />
                          <span>CALL NOW</span>
                        </a>
                      </div>
                    </div>

                    {/* Embedded Map */}
                    <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#9E1717]/20 shadow-sm bg-[#FFFFFF] min-h-[380px] lg:min-h-full relative flex flex-col">
                      <div className="flex-1 w-full h-full min-h-[360px] relative">
                        <iframe
                          title="Dera Sajji Location Map — Krishan Nagar, Gujranwala"
                          src={RESTAURANT_INFO.mapsEmbedUrl}
                          className="w-full h-full min-h-[360px] border-0"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <div className="bg-[#650D0D] text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span>
                          Service Rd, opposite D Point Mobile Market, near Alfalah Bank, Krishan
                          Nagar
                        </span>
                        <a
                          href={RESTAURANT_INFO.mapsDirectionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold underline hover:text-white/80 inline-flex items-center gap-1"
                        >
                          <span>Open in Google Maps</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* =================================================================
              PAGE 6: CONTACT PAGE ("READY FOR SAJJI?")
          ================================================================= */}
          {currentPage === 'contact' && (
            <motion.div
              key="page-contact"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-20"
            >
              {/* Subpage Header */}
              <div className="bg-[#650D0D] text-white py-14 sm:py-20 border-b border-[#9E1717]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#9E1717] border border-white/20 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                    GET IN TOUCH
                  </span>
                  <h1 className="font-serif-display text-3xl sm:text-5xl font-extrabold tracking-tight">
                    READY FOR SAJJI?
                  </h1>
                  <p className="text-sm sm:text-base text-white/85 mt-3 max-w-2xl">
                    Get in touch with Dera Sajji for your next Sajji experience.
                  </p>
                </div>
              </div>

              <section className="py-16 lg:py-24 bg-[#FFFFFF]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Direct Call Info */}
                    <div className="lg:col-span-5 bg-[#650D0D] text-white rounded-2xl p-8 sm:p-10 border border-[#9E1717] shadow-xl relative overflow-hidden">
                      <div
                        aria-hidden="true"
                        className="absolute inset-3 border border-white/10 rounded-xl pointer-events-none"
                      />
                      <div className="relative z-10">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-[#9E1717] border border-white/20 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                          DERA SAJJI • GUJRANWALA
                        </span>

                        <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                          READY FOR SAJJI?
                        </h2>

                        <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-8">
                          Get in touch with Dera Sajji for your next Sajji experience.
                        </p>

                        {/* Prominent Phone Number */}
                        <div className="p-6 rounded-xl bg-[#9E1717]/60 border border-white/20 mb-8">
                          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-white/80 block mb-1.5">
                            CALL DIRECTLY
                          </span>
                          <a
                            href={`tel:${RESTAURANT_INFO.phoneTel}`}
                            className="font-serif-display text-2xl sm:text-3xl font-extrabold text-white hover:text-[#FAF7F5] transition-colors flex items-center gap-3 tabular-nums"
                          >
                            <Phone className="w-6 h-6 shrink-0" />
                            <span>{RESTAURANT_INFO.phoneDisplay}</span>
                          </a>
                        </div>

                        <div className="space-y-3 text-xs sm:text-sm text-white/85">
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-white shrink-0" />
                            <span>Opening Hours: {RESTAURANT_INFO.openingHours}</span>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                            <span>{RESTAURANT_INFO.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Simple Inquiry Form (Name, Phone Number, Message) */}
                    <div className="lg:col-span-7 bg-[#FAF7F5] rounded-2xl p-8 sm:p-10 border border-[#9E1717]/20 shadow-sm">
                      {inquirySubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-[#FFFFFF] rounded-2xl p-8 border border-[#9E1717]/30 text-center space-y-5"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-[#9E1717] text-white flex items-center justify-center mx-auto shadow-md">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <h3 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-[#171717]">
                            Inquiry Prepared
                          </h3>
                          <p className="text-sm sm:text-base text-[#171717]/75 max-w-md mx-auto">
                            Thank you, <strong>{formData.name}</strong>. Send your inquiry directly
                            to Dera Sajji on WhatsApp or call us now.
                          </p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                            <a
                              href={buildWhatsAppInquiryUrl()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#9E1717] hover:bg-[#650D0D] text-white text-xs font-semibold tracking-[0.12em] uppercase transition-colors shadow-sm"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>SEND VIA WHATSAPP</span>
                            </a>
                            <a
                              href={`tel:${RESTAURANT_INFO.phoneTel}`}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#9E1717] text-[#9E1717] hover:bg-[#9E1717] hover:text-white text-xs font-semibold tracking-[0.12em] uppercase transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              <span>CALL {RESTAURANT_INFO.phoneDisplay}</span>
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => setInquirySubmitted(false)}
                            className="text-xs text-[#171717]/60 underline hover:text-[#9E1717] pt-2 cursor-pointer"
                          >
                            Edit Inquiry
                          </button>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleInquirySubmit} noValidate className="space-y-5">
                          {/* Name */}
                          <div>
                            <label
                              htmlFor="inquiry-name"
                              className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#171717] mb-2"
                            >
                              Name *
                            </label>
                            <input
                              id="inquiry-name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleFormChange}
                              placeholder="Enter your name"
                              className="w-full px-4 py-3.5 rounded-xl bg-[#FFFFFF] border border-[#9E1717]/25 text-[#171717] text-sm focus:outline-none focus:border-[#9E1717] focus:ring-2 focus:ring-[#9E1717]/15 transition-all"
                            />
                            {formErrors.name && (
                              <p className="text-xs text-[#C62828] mt-1.5 font-medium">
                                {formErrors.name}
                              </p>
                            )}
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label
                              htmlFor="inquiry-phone"
                              className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#171717] mb-2"
                            >
                              Phone Number *
                            </label>
                            <input
                              id="inquiry-phone"
                              name="phone"
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={handleFormChange}
                              placeholder="e.g. +92 302 7511000"
                              className="w-full px-4 py-3.5 rounded-xl bg-[#FFFFFF] border border-[#9E1717]/25 text-[#171717] text-sm focus:outline-none focus:border-[#9E1717] focus:ring-2 focus:ring-[#9E1717]/15 transition-all tabular-nums"
                            />
                            {formErrors.phone && (
                              <p className="text-xs text-[#C62828] mt-1.5 font-medium">
                                {formErrors.phone}
                              </p>
                            )}
                          </div>

                          {/* Message */}
                          <div>
                            <label
                              htmlFor="inquiry-message"
                              className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#171717] mb-2"
                            >
                              Message
                            </label>
                            <textarea
                              id="inquiry-message"
                              name="message"
                              rows={4}
                              value={formData.message}
                              onChange={handleFormChange}
                              placeholder="Write your message or inquiry for Dera Sajji..."
                              className="w-full px-4 py-3.5 rounded-xl bg-[#FFFFFF] border border-[#9E1717]/25 text-[#171717] text-sm focus:outline-none focus:border-[#9E1717] focus:ring-2 focus:ring-[#9E1717]/15 transition-all resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-4 px-8 rounded-xl bg-[#9E1717] hover:bg-[#650D0D] text-white text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase transition-all duration-200 shadow-md cursor-pointer"
                          >
                            SEND INQUIRY
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
          {/* =================================================================
              PAGE 7: ADMIN PORTAL PAGE
          ================================================================= */}
          {currentPage === 'admin' && (
            <motion.div
              key="page-admin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-20"
            >
              <AdminPortal
                rateList={rateList}
                onUpdateRateList={setRateList}
                extrasList={extrasList}
                onUpdateExtrasList={setExtrasList}
                galleryItems={galleryItems}
                onUpdateGalleryItems={setGalleryItems}
                restaurantInfo={restaurantInfo}
                onUpdateRestaurantInfo={setRestaurantInfo}
                bbqAnnouncement={bbqAnnouncement}
                onUpdateBbqAnnouncement={setBbqAnnouncement}
                inquiries={inquiries}
                onUpdateInquiries={setInquiries}
                onResetAllToDefault={handleResetAllToDefault}
                onBackToWebsite={() => navigateTo('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* =====================================================================
          FULLSCREEN GALLERY LIGHTBOX MODAL
      ===================================================================== */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
              className="absolute top-5 right-5 z-30 w-11 h-11 rounded-xl bg-[#9E1717] text-white flex items-center justify-center hover:bg-[#C62828] transition-colors cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (lightboxIndex - 1 + galleryItems.length) % galleryItems.length
                );
              }}
              aria-label="Previous image"
              className="absolute left-3 sm:left-6 z-30 w-11 h-11 rounded-xl bg-white/15 hover:bg-[#9E1717] text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
              }}
              aria-label="Next image"
              className="absolute right-3 sm:right-6 z-30 w-11 h-11 rounded-xl bg-white/15 hover:bg-[#9E1717] text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full bg-[#171717] rounded-2xl overflow-hidden border border-white/15 shadow-2xl"
            >
              <FallbackImage
                src={galleryItems[lightboxIndex].src}
                backupSrc={IMAGES.sajjiPreparationLocal}
                alt={galleryItems[lightboxIndex].alt}
                variant="food"
                aspectRatioClass="aspect-[16/10] max-h-[72vh]"
              />
              <div className="p-5 sm:p-6 bg-[#650D0D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-white/75 uppercase tracking-widest mb-1">
                    <span>{galleryItems[lightboxIndex].category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {lightboxIndex + 1} / {galleryItems.length}
                    </span>
                  </div>
                  <h3 className="font-serif-display text-xl sm:text-2xl font-extrabold">
                    {galleryItems[lightboxIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/85 mt-1">
                    {galleryItems[lightboxIndex].caption}
                  </p>
                </div>
                <a
                  href={`tel:${restaurantInfo.phoneTel}`}
                  className="px-5 py-2.5 rounded-xl bg-white text-[#650D0D] hover:bg-[#FAF7F5] text-xs font-semibold tracking-wider uppercase whitespace-nowrap shrink-0 inline-flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>CALL TO ORDER</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          PREMIUM DARK-RED FOOTER (Multi-Page Navigation Links)
      ===================================================================== */}
      <footer className="bg-[#650D0D] text-white border-t border-[#9E1717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/15">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="font-serif-display text-3xl font-extrabold tracking-[0.18em] uppercase text-white inline-block cursor-pointer text-left"
              >
                DERA SAJJI
              </button>
              <p className="font-editorial text-lg font-extrabold text-white/95">
                {RESTAURANT_INFO.footerSubtitle}
              </p>
              <p className="text-sm text-white/75 leading-relaxed max-w-sm">
                Traditional Sajji, prepared with authentic Pakistani flavor and served fresh in the
                heart of Gujranwala.
              </p>
            </div>

            {/* Links Column */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">
                PAGES
              </h3>
              <ul className="space-y-2.5 text-sm text-white/80">
                {PAGES.map((page) => (
                  <li key={page.id}>
                    <button
                      type="button"
                      onClick={() => navigateTo(page.id)}
                      className={`hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                        currentPage === page.id ? 'text-white font-bold underline' : ''
                      }`}
                    >
                      {page.id === 'admin' && <Lock className="w-3.5 h-3.5 text-white/70" />}
                      <span>{page.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phone & Address Column */}
            <div className="md:col-span-4 space-y-3">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">
                CONTACT &amp; LOCATION
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">{RESTAURANT_INFO.address}</p>
              <p className="text-sm text-white/80">
                Opening Hours:{' '}
                <strong className="text-white tabular-nums">{RESTAURANT_INFO.openingHours}</strong>
              </p>
              <div className="pt-1">
                <a
                  href={`tel:${RESTAURANT_INFO.phoneTel}`}
                  className="inline-flex items-center gap-2 text-base font-bold text-white hover:text-[#FAF7F5] transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4" />
                  <span>{RESTAURANT_INFO.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright & Credit (Centered in Middle) */}
          <div className="pt-8 flex flex-col items-center justify-center text-center gap-2.5 text-xs text-white/80">
            <p>© 2026 Dera Sajji. All Rights Reserved.</p>
            <p className="font-medium text-white/90 inline-flex items-center justify-center gap-1.5">
              <span>Website created by</span>
              <a
                href="https://fasttargetco.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-white underline underline-offset-4 hover:text-[#FAF7F5] transition-colors inline-flex items-center gap-1"
              >
                <span>FAST TARGET CO.</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          FLOATING WHATSAPP BUTTON (Fixed Bottom-Right)
      ===================================================================== */}
      <a
        href={defaultWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Dera Sajji on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-[#9E1717] hover:bg-[#650D0D] text-white shadow-xl border border-white/25 transition-all duration-200 hover:scale-105"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-5 h-5 text-white shrink-0"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.625.846 5.059 2.284 7.033l-1.496 5.467 5.601-1.469c1.908 1.244 4.185 1.969 6.611 1.969 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
        </svg>
        <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline">
          WhatsApp
        </span>
      </a>
    </div>
  );
}
