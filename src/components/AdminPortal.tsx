import React, { useState } from 'react';
import {
  Lock,
  User,
  LogOut,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle2,
  MessageSquare,
  Utensils,
  Image as ImageIcon,
  Settings,
  Eye,
  EyeOff,
  Phone,
  Clock,
  MapPin,
  Flame,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import FallbackImage from './FallbackImage';
import {
  RateListItem,
  GalleryItem,
  CustomerInquiry,
} from '../data/restaurantData';

const ADMIN_USERNAME = 'ownerderasajji';
const ADMIN_PASSWORD = '@DSowner7789';

interface RestaurantInfoState {
  name: string;
  tagline: string;
  footerSubtitle: string;
  category: string;
  address: string;
  shortLocation: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappNumber: string;
  whatsappDefaultMsg: string;
  openingHours: string;
  mapsDirectionsUrl: string;
  mapsEmbedUrl: string;
}

interface AdminPortalProps {
  rateList: RateListItem[];
  onUpdateRateList: (items: RateListItem[]) => void;
  extrasList: RateListItem[];
  onUpdateExtrasList: (items: RateListItem[]) => void;
  galleryItems: GalleryItem[];
  onUpdateGalleryItems: (items: GalleryItem[]) => void;
  restaurantInfo: RestaurantInfoState;
  onUpdateRestaurantInfo: (info: RestaurantInfoState) => void;
  bbqAnnouncement: {
    badge: string;
    heading: string;
    subheading: string;
    description: string;
    enabled: boolean;
  };
  onUpdateBbqAnnouncement: (bbq: {
    badge: string;
    heading: string;
    subheading: string;
    description: string;
    enabled: boolean;
  }) => void;
  inquiries: CustomerInquiry[];
  onUpdateInquiries: (inquiries: CustomerInquiry[]) => void;
  onResetAllToDefault: () => void;
  onBackToWebsite?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  rateList,
  onUpdateRateList,
  extrasList,
  onUpdateExtrasList,
  galleryItems,
  onUpdateGalleryItems,
  restaurantInfo,
  onUpdateRestaurantInfo,
  bbqAnnouncement,
  onUpdateBbqAnnouncement,
  inquiries,
  onUpdateInquiries,
  onResetAllToDefault,
  onBackToWebsite,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dera_sajji_admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'rates' | 'inquiries' | 'gallery' | 'settings'
  >('rates');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const [newRateName, setNewRateName] = useState('');
  const [newRatePrice, setNewRatePrice] = useState('');
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState('');

  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('Sajji Serving');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newGallerySrc, setNewGallerySrc] = useState('');

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      usernameInput.trim() === ADMIN_USERNAME &&
      passwordInput === ADMIN_PASSWORD
    ) {
      sessionStorage.setItem('dera_sajji_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError(null);
      setPasswordInput('');
    } else {
      setLoginError('Invalid admin username or password. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dera_sajji_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleRateChange = (id: string, field: 'name' | 'price', value: string) => {
    onUpdateRateList(
      rateList.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddRateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRateName.trim() || !newRatePrice.trim()) return;
    onUpdateRateList([
      ...rateList,
      { id: `rate-${Date.now()}`, name: newRateName.trim(), price: newRatePrice.trim() },
    ]);
    setNewRateName('');
    setNewRatePrice('');
    triggerToast('Added new Sajji rate item');
  };

  const handleDeleteRateItem = (id: string) => {
    onUpdateRateList(rateList.filter((item) => item.id !== id));
    triggerToast('Removed Sajji rate item');
  };

  const handleExtraChange = (id: string, field: 'name' | 'price', value: string) => {
    onUpdateExtrasList(
      extrasList.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddExtraItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraName.trim() || !newExtraPrice.trim()) return;
    onUpdateExtrasList([
      ...extrasList,
      { id: `extra-${Date.now()}`, name: newExtraName.trim(), price: newExtraPrice.trim() },
    ]);
    setNewExtraName('');
    setNewExtraPrice('');
    triggerToast('Added new Extra item');
  };

  const handleDeleteExtraItem = (id: string) => {
    onUpdateExtrasList(extrasList.filter((item) => item.id !== id));
    triggerToast('Removed Extra item');
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle.trim() || !newGallerySrc.trim()) return;
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newGalleryTitle.trim(),
      category: newGalleryCategory.trim() || 'Dera Sajji',
      caption:
        newGalleryCaption.trim() ||
        'Authentic Pakistani Sajji prepared fresh at Dera Sajji, Gujranwala.',
      src: newGallerySrc.trim(),
      alt: `${newGalleryTitle.trim()} — Dera Sajji Gujranwala`,
      spanClass: 'md:col-span-1',
      aspectClass: 'aspect-[4/3]',
    };
    onUpdateGalleryItems([newItem, ...galleryItems]);
    setNewGalleryTitle('');
    setNewGalleryCaption('');
    setNewGallerySrc('');
    triggerToast('Added new photograph to gallery');
  };

  const handleDeleteGalleryItem = (id: string) => {
    onUpdateGalleryItems(galleryItems.filter((item) => item.id !== id));
    triggerToast('Removed photograph from gallery');
  };

  const handleInquiryStatus = (id: string, status: CustomerInquiry['status']) => {
    onUpdateInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    triggerToast(`Inquiry marked as ${status}`);
  };

  const handleDeleteInquiry = (id: string) => {
    onUpdateInquiries(inquiries.filter((inq) => inq.id !== id));
    triggerToast('Inquiry deleted');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-[#FAF7F5] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#FFFFFF] rounded-3xl border border-[#9E1717]/20 shadow-xl overflow-hidden">
          <div className="bg-[#650D0D] text-white p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#9E1717] border border-white/25 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/80 block mb-1">
              OWNER MANAGEMENT
            </span>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-extrabold tracking-wide uppercase">
              DERA SAJJI ADMIN
            </h1>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-[#C62828]/10 border border-[#C62828]/30 text-[#9E1717] text-xs font-medium flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#171717] mb-2"
              >
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9E1717] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/25 text-[#171717] text-sm focus:outline-none focus:bg-white focus:border-[#9E1717]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#171717] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9E1717] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/25 text-[#171717] text-sm focus:outline-none focus:bg-white focus:border-[#9E1717]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#171717]/50 hover:text-[#9E1717] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-[#9E1717] hover:bg-[#650D0D] text-white text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase transition-colors shadow-md cursor-pointer"
            >
              SIGN IN TO PORTAL
            </button>

            <div className="pt-3 border-t border-[#9E1717]/10 text-center">
              <button
                type="button"
                onClick={onBackToWebsite}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171717]/70 hover:text-[#9E1717] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen pt-20 pb-20 bg-[#FAF7F5]">
      <div className="bg-[#650D0D] text-white py-10 border-b border-[#9E1717]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9E1717] border border-white/20 text-[11px] font-semibold tracking-[0.18em] uppercase mb-2">
              <span>ADMIN: {ADMIN_USERNAME}</span>
            </div>
            <h1 className="font-serif-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              DERA SAJJI ADMIN PORTAL
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-1">
              Manage Sajji rate list, extras, customer inquiries, gallery photos, and restaurant info.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Live Site</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9E1717] hover:bg-[#C62828] border border-white/20 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#171717] text-white px-5 py-3 rounded-xl shadow-xl border border-white/15 flex items-center gap-2.5 text-xs font-semibold tracking-wide">
          <CheckCircle2 className="w-4 h-4 text-[#C62828]" />
          <span>{saveToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#9E1717]/15">
          <button
            type="button"
            onClick={() => setActiveTab('rates')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'rates'
                ? 'bg-[#9E1717] text-white shadow-sm'
                : 'bg-[#FFFFFF] text-[#171717]/75 hover:text-[#9E1717] border border-[#9E1717]/15'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Rate List &amp; Extras ({rateList.length + extrasList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'bg-[#9E1717] text-white shadow-sm'
                : 'bg-[#FFFFFF] text-[#171717]/75 hover:text-[#9E1717] border border-[#9E1717]/15'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              Inquiries ({inquiries.length}
              {newInquiriesCount > 0 ? ` • ${newInquiriesCount} new` : ''})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-[#9E1717] text-white shadow-sm'
                : 'bg-[#FFFFFF] text-[#171717]/75 hover:text-[#9E1717] border border-[#9E1717]/15'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery ({galleryItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#9E1717] text-white shadow-sm'
                : 'bg-[#FFFFFF] text-[#171717]/75 hover:text-[#9E1717] border border-[#9E1717]/15'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Restaurant &amp; BBQ Settings</span>
          </button>
        </div>

        {activeTab === 'rates' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#9E1717]/20 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#9E1717]/15 pb-4">
                <div>
                  <h2 className="font-serif-display text-xl font-extrabold text-[#171717]">
                    🍗 SAJJI RATE LIST
                  </h2>
                  <p className="text-xs text-[#171717]/65 mt-0.5">
                    Edit Sajji prices or add new Sajji items.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast('Sajji Rate List saved')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#9E1717] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#650D0D] cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>

              <div className="space-y-3">
                {rateList.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/15"
                  >
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleRateChange(item.id, 'name', e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-lg bg-white border border-[#9E1717]/20 text-sm font-semibold text-[#171717]"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => handleRateChange(item.id, 'price', e.target.value)}
                        className="w-32 px-3.5 py-2 rounded-lg bg-white border border-[#9E1717]/20 text-sm font-bold text-[#9E1717] tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteRateItem(item.id)}
                        className="p-2 rounded-lg text-[#C62828] hover:bg-[#C62828]/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddRateItem} className="pt-4 border-t border-[#9E1717]/15 space-y-3">
                <span className="block text-xs font-bold uppercase text-[#650D0D]">
                  Add New Sajji Item
                </span>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newRateName}
                    onChange={(e) => setNewRateName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Rs. 2000/-"
                    value={newRatePrice}
                    onChange={(e) => setNewRatePrice(e.target.value)}
                    className="sm:w-36 px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm tabular-nums"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#9E1717] text-white text-xs font-semibold uppercase cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#9E1717]/20 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#9E1717]/15 pb-4">
                <div>
                  <h2 className="font-serif-display text-xl font-extrabold text-[#171717]">
                    EXTRAS RATE LIST
                  </h2>
                  <p className="text-xs text-[#171717]/65 mt-0.5">
                    Manage Sauce, Raita Plate, Rice Plate, and extras.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast('Extras Rate List saved')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#9E1717] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#650D0D] cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>

              <div className="space-y-3">
                {extrasList.map((extra) => (
                  <div
                    key={extra.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/15"
                  >
                    <input
                      type="text"
                      value={extra.name}
                      onChange={(e) => handleExtraChange(extra.id, 'name', e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-lg bg-white border border-[#9E1717]/20 text-sm font-semibold text-[#171717]"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={extra.price}
                        onChange={(e) => handleExtraChange(extra.id, 'price', e.target.value)}
                        className="w-32 px-3.5 py-2 rounded-lg bg-white border border-[#9E1717]/20 text-sm font-bold text-[#650D0D] tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExtraItem(extra.id)}
                        className="p-2 rounded-lg text-[#C62828] hover:bg-[#C62828]/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddExtraItem} className="pt-4 border-t border-[#9E1717]/15 space-y-3">
                <span className="block text-xs font-bold uppercase text-[#650D0D]">
                  Add New Extra
                </span>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    placeholder="Extra name"
                    value={newExtraName}
                    onChange={(e) => setNewExtraName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Rs. 50/-"
                    value={newExtraPrice}
                    onChange={(e) => setNewExtraPrice(e.target.value)}
                    className="sm:w-36 px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm tabular-nums"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#9E1717] text-white text-xs font-semibold uppercase cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#9E1717]/20 shadow-sm space-y-6">
            <h2 className="font-serif-display text-xl font-extrabold text-[#171717] border-b border-[#9E1717]/15 pb-4">
              CUSTOMER INQUIRIES
            </h2>
            {inquiries.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#171717]/65">
                No customer inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-2xl bg-[#FAF7F5] border border-[#9E1717]/15 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-serif-display text-base font-extrabold text-[#171717]">
                          {inq.name}
                        </span>
                        <span className="text-[#171717]/30">·</span>
                        <a
                          href={`tel:${inq.phone}`}
                          className="text-sm font-bold text-[#9E1717] hover:underline tabular-nums"
                        >
                          {inq.phone}
                        </a>
                        <span className="text-[#171717]/30">·</span>
                        <span className="text-xs text-[#171717]/60">{inq.createdAt}</span>
                        <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#9E1717] text-white">
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#171717]/80">
                        {inq.message || 'No additional message.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {inq.status !== 'contacted' && (
                        <button
                          type="button"
                          onClick={() => handleInquiryStatus(inq.id, 'contacted')}
                          className="px-3 py-1.5 rounded-lg border border-[#9E1717]/30 text-[#9E1717] text-xs font-semibold uppercase cursor-pointer"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {inq.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleInquiryStatus(inq.id, 'completed')}
                          className="px-3 py-1.5 rounded-lg border border-[#171717]/20 text-[#171717]/75 text-xs font-semibold uppercase cursor-pointer"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-2 rounded-lg text-[#C62828] hover:bg-[#C62828]/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#9E1717]/20 shadow-sm">
              <h2 className="font-serif-display text-xl font-extrabold text-[#171717] mb-4">
                ADD NEW SAJJI / ATMOSPHERE PHOTO
              </h2>
              <form onSubmit={handleAddGalleryItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Photo Title *"
                  value={newGalleryTitle}
                  onChange={(e) => setNewGalleryTitle(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Signature Sajji)"
                  value={newGalleryCategory}
                  onChange={(e) => setNewGalleryCategory(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm"
                />
                <input
                  type="url"
                  required
                  placeholder="Image URL (https://...) *"
                  value={newGallerySrc}
                  onChange={(e) => setNewGallerySrc(e.target.value)}
                  className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm"
                />
                <input
                  type="text"
                  placeholder="Short Caption"
                  value={newGalleryCaption}
                  onChange={(e) => setNewGalleryCaption(e.target.value)}
                  className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm"
                />
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#9E1717] text-white text-xs font-semibold uppercase cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photograph</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#9E1717]/20 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <FallbackImage
                      src={item.src}
                      alt={item.alt}
                      variant="gallery"
                      aspectRatioClass="aspect-[4/3]"
                    />
                    <div className="p-4">
                      <span className="text-[11px] font-bold uppercase text-[#9E1717]">
                        {item.category}
                      </span>
                      <h3 className="font-serif-display text-base font-extrabold text-[#171717] mt-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#171717]/70 mt-1 line-clamp-2">{item.caption}</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-[#FAF7F5] border-t border-[#9E1717]/10 flex items-center justify-between">
                    <span className="text-[11px] text-[#171717]/50 truncate max-w-[180px]">
                      {item.src}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(item.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C62828] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#9E1717]/20 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#9E1717]/15 pb-4">
                <h2 className="font-serif-display text-xl font-extrabold text-[#171717]">
                  RESTAURANT INFORMATION
                </h2>
                <button
                  type="button"
                  onClick={() => triggerToast('Restaurant settings saved')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#9E1717] text-white text-xs font-semibold uppercase cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#171717] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#9E1717] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={restaurantInfo.phoneDisplay}
                    onChange={(e) =>
                      onUpdateRestaurantInfo({
                        ...restaurantInfo,
                        phoneDisplay: e.target.value,
                        phoneTel: e.target.value.replace(/\s+/g, ''),
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm font-semibold tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#171717] mb-1.5">
                  Opening Hours
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#9E1717] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={restaurantInfo.openingHours}
                    onChange={(e) =>
                      onUpdateRestaurantInfo({
                        ...restaurantInfo,
                        openingHours: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm font-semibold tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#171717] mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#9E1717] absolute left-3.5 top-3.5" />
                  <textarea
                    rows={3}
                    value={restaurantInfo.address}
                    onChange={(e) =>
                      onUpdateRestaurantInfo({
                        ...restaurantInfo,
                        address: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#9E1717]/20 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-[#9E1717]/15 pb-4">
                  <h2 className="font-serif-display text-xl font-extrabold text-[#171717]">
                    BBQ — COMING SOON BANNER
                  </h2>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bbqAnnouncement.enabled}
                      onChange={(e) =>
                        onUpdateBbqAnnouncement({
                          ...bbqAnnouncement,
                          enabled: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#9E1717]"
                    />
                    <span className="text-xs font-bold uppercase text-[#9E1717]">Show</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#171717] mb-1.5">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={bbqAnnouncement.heading}
                    onChange={(e) =>
                      onUpdateBbqAnnouncement({ ...bbqAnnouncement, heading: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#171717] mb-1.5">
                    Large Title
                  </label>
                  <input
                    type="text"
                    value={bbqAnnouncement.subheading}
                    onChange={(e) =>
                      onUpdateBbqAnnouncement({ ...bbqAnnouncement, subheading: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#171717] mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={bbqAnnouncement.description}
                    onChange={(e) =>
                      onUpdateBbqAnnouncement({ ...bbqAnnouncement, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#9E1717]/20 text-sm resize-none"
                  />
                </div>
              </div>

              <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#9E1717]/20 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-display text-sm font-extrabold uppercase text-[#171717]">
                    Restore Defaults
                  </h3>
                  <p className="text-xs text-[#171717]/65">
                    Reset all Rate List, Extras, and Gallery changes back to original defaults.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetAllToDefault();
                    triggerToast('Restored all defaults');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#9E1717]/30 text-[#9E1717] hover:bg-[#9E1717] hover:text-white text-xs font-semibold uppercase cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
