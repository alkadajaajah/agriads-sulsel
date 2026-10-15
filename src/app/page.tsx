'use client';

import { useState, useEffect } from 'react';

interface Listing {
  id: number;
  title: string;
  category: 'Pertanian' | 'Peternakan' | 'Perkebunan' | 'Alat & Mesin';
  type: 'Supply' | 'Demand';
  price: string;          
  location: string;
  contact: string;
  fullName?: string;
  nickname?: string;
  nik?: string;
  fullAddress?: string;
  addressStatus?: 'approved';
  desc: string;
  date: string;
  unitType?: string;
  images?: string[];
  status?: 'pending' | 'approved' | 'blocked';
  paymentPackage?: string;
  paymentProof?: string;
  createdAt?: number;
  isRecommended?: boolean;
  viewCount?: number;
  ownerPassword?: string;
  isNegotiable?: boolean;
}

interface NewsItem {
  id: number;
  title: string;
  source: string;
  time: string;
  url: string;
}

// --- KONSTANTA SATUAN & KABUPATEN DI SULSEL ---
const UNITS_LIST = [
  'Kg',
  'Ton',
  'Ikat',
  'Ekor',
  'Karung',
  'Bungkus',
  'Batang',
  'Liter',
  'Box',
  'Buah',
  'Dus'
];

const SULSEL_REGIONS = [
  'Barru (Kota)',
  'Kab. Sidenreng Rappang (Sidrap)',
  'Kab. Pinrang',
  'Kab. Bone',
  'Kota Makassar',
  'Kab. Gowa',
  'Kab. Maros',
  'Kab. Pangkajene dan Kepulauan (Pangkep)',
  'Kab. Wajo',
  'Kab. Soppeng',
  'Kab. Sinjai',
  'Kab. Bulukumba',
  'Kab. Bantaeng',
  'Kab. Jeneponto',
  'Kab. Takalar',
  'Kab. Selayar',
  'Kab. Enrekang',
  'Kab. Luwu',
  'Kota Palopo',
  'Kab. Tana Toraja',
  'Kab. Toraja Utara',
  'Kota Parepare'
];

const defaultListings: Listing[] = [
  { 
    id: 1, 
    title: 'Gabah Kering Panen (GKP) Varietas Inpari Super', 
    category: 'Pertanian', 
    type: 'Supply', 
    price: 'Rp 6.300 /Kg', 
    location: 'Kab. Sidenreng Rappang (Sidrap)', 
    contact: '081234567890', 
    fullName: 'Arifullah Muh. Syukur',
    nickname: 'Arif',
    nik: '7314051234560001',
    fullAddress: 'Kab. Sidenreng Rappang (Sidrap) — Jl. Tani Makmur No. 12, Desa Maritengngae',
    addressStatus: 'approved',
    desc: 'Stok melimpah dari hasil panen terbaru di Maritengngae. Kualitas bersih dan kering jemur matahari.', 
    date: '2026-10-14',
    unitType: 'Kg',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'approved',
    paymentPackage: 'Paket Unggulan VIP (Rp 50.000)',
    isRecommended: true,
    viewCount: 184,
    ownerPassword: '1234',
    isNegotiable: true,
    createdAt: Date.now()
  },
  { 
    id: 2, 
    title: 'Mencari Pasokan Jagung Kuning Pipil Kering Tonase Besar', 
    category: 'Pertanian', 
    type: 'Demand', 
    price: 'Negosiasi /Kg', 
    location: 'Kota Makassar', 
    contact: '081199887766', 
    fullName: 'H. Rusli Makkulau',
    nickname: 'H. Rusli',
    nik: '7371029876540002',
    fullAddress: 'Kota Makassar — Kawasan Industri Makassar (KIMA) Blok E-10',
    addressStatus: 'approved',
    desc: 'Dibutuhkan suplai rutin untuk pabrik pakan ternak. Kapasitas 10-20 ton per minggu.', 
    date: '2026-10-14',
    unitType: 'Kg',
    images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80'],
    status: 'approved',
    paymentPackage: 'Paket Bump Up Prioritas (Rp 25.000)',
    isRecommended: true,
    viewCount: 245,
    ownerPassword: '5678',
    isNegotiable: true,
    createdAt: Date.now()
  }
];

const newsPool: NewsItem[][] = [
  [
    { id: 1, title: 'NTP Hortikultura Sulsel Naik 6,62 Persen, Cabai Penopang Utama', source: 'RRI Makassar', time: 'Baru saja', url: 'https://rri.co.id/makassar/regional/2812688/ntp-hortikultura-sulsel-naik-662-persen-cabai-penopang-utama' },
    { id: 2, title: 'Harga Gabah di Pinrang Tembus Rp7.900 per Kg, Petani Senang', source: 'Tribun Timur', time: '1 jam lalu', url: 'https://makassar.tribunnews.com/pinrang/1854093/hanya-pemerintahan-prabowo-subianto-harga-gabah-di-pinrang-tembus-rp7900-per-kg' },
    { id: 3, title: 'Kopdes Merah Putih Akan Sediakan Alat Pertanian, Sulsel Jadi Percontohan', source: 'Journalist Independent', time: '1 jam lalu', url: 'https://journalistindependent.com/2026/10/11/kopdes-merah-putih-akan-sediakan-alat-pertanian-sulsel-diminta-jadi-percontohan/' }
  ],
  [
    { id: 4, title: 'Pemprov Sulsel Genjot Modernisasi Pertanian Hortikultura Modern', source: 'RRI Makassar', time: 'Baru saja', url: 'https://rri.co.id/makassar/regional/2812707/pemprov-sulsel-genjot-modernisasi-pertanian-hortikultura' },
    { id: 5, title: 'Bulog Sulselbar Penuhi Target Penyerapan Beras Lebih Awal', source: 'Beranda Sulsel', time: '1 jam lalu', url: 'https://berandasulsel.com/harga-gabah-tembus-rp7-200-per-kg-bulog-makassar-tetap-serap-hasil-panen-petani/' }
  ]
];

const zoneMapping: { [key: string]: string[] } = {
  'Lumbung Padi': ['Kab. Sidenreng Rappang (Sidrap)', 'Kab. Pinrang', 'Kab. Wajo', 'Kab. Soppeng'],
  'Bone & Selatan': ['Kab. Bone', 'Kab. Sinjai', 'Kab. Bulukumba', 'Kab. Bantaeng', 'Kab. Jeneponto', 'Kab. Takalar', 'Kab. Gowa'],
  'Dataran Tinggi & Utara': ['Kab. Enrekang', 'Kab. Tana Toraja', 'Kab. Toraja Utara', 'Kab. Luwu', 'Kab. Luwu Utara', 'Kab. Luwu Timur', 'Kota Palopo'],
  'Pesisir & Metropolitan': ['Kab. Barru', 'Barru (Kota)', 'Kab. Maros', 'Kab. Pangkajene dan Kepulauan (Pangkep)', 'Kota Makassar', 'Kota Parepare'],
};

const ADMIN_WA_NUMBER = '081245195158';

const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Gagal memproses canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [listings, setListings] = useState<Listing[]>(defaultListings);
  const [activeTab, setActiveTab] = useState<'Supply' | 'Demand'>('Supply');
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('Semua Zona');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Semua');
  const [isOnline, setIsOnline] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentVipIndex, setCurrentVipIndex] = useState(0);
  const [isWaHelpOpen, setIsWaHelpOpen] = useState(false);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // MODAL IKLAN BARU
  const [showInputModal, setShowInputModal] = useState(false);
  const [formType, setFormType] = useState<'Supply' | 'Demand'>('Supply');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Pertanian' | 'Peternakan' | 'Perkebunan' | 'Alat & Mesin'>('Pertanian');
  const [formPriceNumber, setFormPriceNumber] = useState('');
  const [formUnitType, setFormUnitType] = useState('Kg');
  const [formLocation, setFormLocation] = useState('Barru (Kota)');
  const [formAddressDetail, setFormAddressDetail] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formNickname, setFormNickname] = useState('');
  const [formNik, setFormNik] = useState('');
  const [formDesc, setFormDesc] = useState('');
  
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formPackage, setFormPackage] = useState('Standar Gratis');
  const [formPaymentProof, setFormPaymentProof] = useState('');
  const [formOwnerPassword, setFormOwnerPassword] = useState('');
  const [formIsNegotiable, setFormIsNegotiable] = useState(true);

  // MODAL EDIT PENGIKLAN
  const [showEditAuthModal, setShowEditAuthModal] = useState(false);
  const [selectedListingForEdit, setSelectedListingForEdit] = useState<Listing | null>(null);
  const [inputAuthPassword, setInputAuthPassword] = useState('');
  const [isAuthorizedToEdit, setIsAuthorizedToEdit] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImages, setEditImages] = useState<string[]>(['', '', '', '']);

  // MODAL NEGO / TAWAR HARGA
  const [activeNegoItem, setActiveNegoItem] = useState<Listing | null>(null);
  const [negotiatedPrice, setNegotiatedPrice] = useState('');
  const [negoNotes, setNegoNotes] = useState('');

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const savedData = localStorage.getItem('agriads_sulsel_core_data');
    if (savedData) {
      try {
        const parsed: Listing[] = JSON.parse(savedData);
        setListings(parsed);
      } catch (e) {
        console.error('Gagal memuat cache lokal');
      }
    } else {
      localStorage.setItem('agriads_sulsel_core_data', JSON.stringify(defaultListings));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsPool.length);
    }, 60 * 60 * 1000);

    return () => clearInterval(newsInterval);
  }, []);

  const vipListings = listings.filter(item => 
    item.status === 'approved' && item.paymentPackage && item.paymentPackage.includes('VIP')
  );

  useEffect(() => {
    if (vipListings.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentVipIndex((prevIndex) => (prevIndex + 1) % vipListings.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [vipListings.length]);

  const saveListings = (newListings: Listing[]) => {
    setListings(newListings);
    localStorage.setItem('agriads_sulsel_core_data', JSON.stringify(newListings));
  };

  const openLightbox = (images: string[] | undefined, index = 0) => {
    if (!images || images.length === 0) return;
    const valid = images.filter(img => img && img.trim() !== '');
    if (valid.length > 0) {
      setPreviewImages(valid);
      setCurrentImageIndex(index);
    }
  };

  const handleOpenNego = (item: Listing) => {
    if (item.isNegotiable === false) return;
    const updated = listings.map(l => {
      if (l.id === item.id) {
        return { ...l, viewCount: (l.viewCount || 0) + 1 };
      }
      return l;
    });
    saveListings(updated);
    setActiveNegoItem(item);
    setNegotiatedPrice('');
    setNegoNotes('');
  };

  const handleShare = async (item: Listing) => {
    const updated = listings.map(l => {
      if (l.id === item.id) {
        return { ...l, viewCount: (l.viewCount || 0) + 1 };
      }
      return l;
    });
    saveListings(updated);

    const shareText = `🌾 *${item.title}*\n\n💰 Harga: ${item.price} (${item.isNegotiable !== false ? 'Bisa Nego' : 'Harga Pas'})\n📍 Lokasi: ${item.fullAddress || item.location}\n👤 Pengiklan: ${item.fullName || 'Petani/Pengepul Sulsel'}\n\nLihat informasi lengkapnya di direktori AgriAds Sulsel!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: shareText, url: shareUrl });
      } catch (err) {
        console.log('Batal membagikan:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('📋 Tautan dan rincian produk berhasil disalin ke clipboard!');
      } catch (err) {
        alert('Gagal menyalin teks.');
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formPriceNumber.trim() || !formContact.trim() || !formFullName.trim() || !formNik.trim() || !formAddressDetail.trim() || !formOwnerPassword.trim()) {
      alert('Mohon lengkapi semua data wajib termasuk password pengiklan.');
      return;
    }

    // --- VALIDASI KETAT SESUAI PERMINTAAN ---
    // 1. Validasi Password Pengiklan (PIN Edit): Tepat 4 digit angka, tidak boleh lebih/kurang, tanpa karakter lain
    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(formOwnerPassword)) {
      alert('Password / PIN Edit pengiklan wajib diisi tepat 4 angka (contoh: 1234)!');
      return;
    }

    // 2. Validasi No HP: Angka saja, panjang 10 hingga 13 digit
    const phoneRegex = /^\d{10,13}$/;
    if (!phoneRegex.test(formContact)) {
      alert('Nomor WhatsApp / HP harus berupa angka dengan panjang antara 10 hingga 13 digit!');
      return;
    }

    // 3. Validasi No KTP (NIK): Tepat 16 digit angka
    if (formNik.length !== 16 || !/^\d+$/.test(formNik)) {
      alert('Nomor KTP (NIK) harus tepat 16 digit angka!');
      return;
    }

    const formattedPrice = `Rp ${formPriceNumber} /${formUnitType}`;
    const combinedAddress = `${formLocation} — ${formAddressDetail}`;

    const newEntry: Listing = {
      id: Date.now(),
      title: formTitle,
      category: formCategory,
      type: formType,
      price: formattedPrice,
      location: formLocation,
      contact: formContact,
      fullName: formFullName,
      nickname: formNickname || formFullName.split(' ')[0],
      nik: formNik,
      fullAddress: combinedAddress,
      addressStatus: 'approved',
      desc: formDesc,
      date: new Date().toISOString().split('T')[0],
      unitType: formUnitType,
      images: formImages,
      status: 'pending',
      paymentPackage: formPackage,
      paymentProof: formPaymentProof,
      isRecommended: formPackage.includes('VIP') || formPackage.includes('Bump Up'),
      viewCount: 1,
      ownerPassword: formOwnerPassword,
      isNegotiable: formIsNegotiable,
      createdAt: Date.now()
    };

    const updated = [newEntry, ...listings];
    saveListings(updated);
    setShowInputModal(false);
    
    setFormTitle('');
    setFormPriceNumber('');
    setFormContact('');
    setFormFullName('');
    setFormNickname('');
    setFormNik('');
    setFormAddressDetail('');
    setFormDesc('');
    setFormImages([]);
    setFormPaymentProof('');
    setFormOwnerPassword('');
    setFormIsNegotiable(true);
    alert('Iklan berhasil dikirim dan kini masuk antrean kurasi admin! Simpan 4 angka password Anda untuk keperluan edit iklan.');
  };

  const handleVerifyAuthForEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForEdit) return;

    if (inputAuthPassword === selectedListingForEdit.ownerPassword) {
      setIsAuthorizedToEdit(true);
      setEditTitle(selectedListingForEdit.title);
      setEditDesc(selectedListingForEdit.desc);
      setEditImages(selectedListingForEdit.images || ['', '', '', '']);
    } else {
      alert('Password 4 angka pengiklan salah! Silakan coba lagi.');
    }
  };

  const handleSaveEditedListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForEdit) return;

    const validImages = editImages.filter(img => img && img.trim() !== '');

    const updated = listings.map(item => {
      if (item.id === selectedListingForEdit.id) {
        return {
          ...item,
          title: editTitle,
          desc: editDesc,
          images: validImages
        };
      }
      return item;
    });

    saveListings(updated);
    setShowEditAuthModal(false);
    setSelectedListingForEdit(null);
    setInputAuthPassword('');
    setIsAuthorizedToEdit(false);
    alert('✅ Iklan Anda berhasil diperbarui!');
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Memuat AgriAds Sulsel...</div>;
  }

  const supplyCount = listings.filter(i => i.status === 'approved' && i.type === 'Supply').length;
  const demandCount = listings.filter(i => i.status === 'approved' && i.type === 'Demand').length;

  const activeSlideVip = vipListings[currentVipIndex] || vipListings[0];
  const sideVipItems = vipListings.slice(0, 2);
  const activeNewsList = newsPool[currentNewsIndex];

  const filteredListings = listings.filter(item => {
    const isApproved = item.status === 'approved';
    const matchesTab = item.type === activeTab;
    const matchesCategory = selectedCategoryFilter === 'Semua' || item.category === selectedCategoryFilter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.location.toLowerCase().includes(search.toLowerCase()) ||
                          item.desc.toLowerCase().includes(search.toLowerCase()) ||
                          (item.fullName && item.fullName.toLowerCase().includes(search.toLowerCase()));
    
    let matchesZone = true;
    if (selectedZone !== 'Semua Zona') {
      const allowedLocations = zoneMapping[selectedZone] || [];
      matchesZone = allowedLocations.some(loc => item.location.includes(loc) || loc.includes(item.location));
    }

    return isApproved && matchesTab && matchesCategory && matchesSearch && matchesZone;
  });

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage) || 1;
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-slate-100/70 text-slate-800 pb-16 font-sans flex flex-col justify-between relative selection:bg-emerald-500 selection:text-white">
      <div>
        {/* HEADER UTAMA */}
        <header className="bg-emerald-950 text-white shadow-lg py-5 px-6 border-b border-emerald-900 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
          <div className="max-w-[96%] xl:max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-emerald-900/60 rounded-2xl border border-emerald-700/50 shadow-inner">🌾</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  AgriAds Sulsel
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-700">
                    Verified Portal
                  </span>
                </h1>
                <p className="text-emerald-300/90 text-xs mt-0.5 font-medium">Direktori Resmi Pertanian, Peternakan, & Perkebunan Sulawesi Selatan</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm ${isOnline ? 'bg-emerald-900/80 text-emerald-100 border border-emerald-700' : 'bg-amber-700 text-amber-100 border border-amber-500'}`}>
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                {isOnline ? 'Online Connected' : 'Offline-First Mode Active'}
              </div>

              <button
                onClick={() => setShowInputModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center gap-1.5 border border-emerald-500"
              >
                <span>➕</span> Pasang Iklan Baru
              </button>
            </div>
          </div>
        </header>

        {/* CONTAINER UTAMA */}
        <div className="max-w-[96%] xl:max-w-[1600px] mx-auto px-2 sm:px-4 mt-6 space-y-6">

          {/* SEKSI SLIDESHOW VIP */}
          {vipListings.length > 0 && (
            <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 p-5 rounded-3xl text-white shadow-xl border border-emerald-800/80 space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[11px] font-extrabold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
                  <span className="animate-pulse text-base">👑</span> SOROTAN UTAMA IKLAN VIP REKOMENDASI
                </span>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/60 font-medium">
                  Auto-Slideshow Active (3.5s)
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                
                <div className="lg:col-span-4 flex flex-col justify-between gap-3">
                  {sideVipItems.map((sideItem) => (
                    <div 
                      key={sideItem.id} 
                      className="bg-emerald-900/50 hover:bg-emerald-800/80 border border-emerald-700/60 p-3.5 rounded-2xl transition-all duration-200 flex items-center gap-3.5 group shadow-md"
                    >
                      {sideItem.images && sideItem.images.length > 0 && sideItem.images[0] ? (
                        <img 
                          src={sideItem.images[0]} 
                          alt={sideItem.title} 
                          onClick={() => openLightbox(sideItem.images, 0)}
                          className="w-16 h-16 object-cover rounded-xl border border-emerald-500/50 shrink-0 cursor-zoom-in hover:scale-105 transition"
                          title="Klik untuk melihat foto"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-emerald-800/90 rounded-xl flex items-center justify-center text-2xl shrink-0">🌾</div>
                      )}
                      
                      <div className="space-y-0.5 overflow-hidden flex-1 cursor-pointer" onClick={() => handleOpenNego(sideItem)}>
                        <div className="flex items-center justify-between">
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] px-2 py-0.5 rounded font-bold">
                            ⭐ Rekomendasi
                          </span>
                          <span className="text-[10px] text-emerald-300 font-semibold">👀 {sideItem.viewCount || 1} Dilihat</span>
                        </div>
                        <h4 className="font-bold text-xs text-white truncate group-hover:text-amber-300 transition">{sideItem.title}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-amber-400 font-extrabold text-xs">{sideItem.price}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${sideItem.isNegotiable !== false ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                            {sideItem.isNegotiable !== false ? 'Bisa Nego' : 'Harga Pas'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 truncate">📍 {sideItem.location}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {activeSlideVip && (
                  <div className="lg:col-span-8 bg-slate-950/80 rounded-2xl border border-emerald-700/50 overflow-hidden relative min-h-[210px] flex flex-col justify-end">
                    {activeSlideVip.images && activeSlideVip.images.length > 0 && activeSlideVip.images[0] ? (
                      <img 
                        src={activeSlideVip.images[0]} 
                        alt={activeSlideVip.title}
                        onClick={() => openLightbox(activeSlideVip.images, 0)}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700 cursor-zoom-in hover:opacity-80"
                        title="Klik untuk melihat foto"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-emerald-950/90 flex items-center justify-center text-6xl">🌾</div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    <div className="relative z-10 p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                            ⭐ VIP Rekomendasi
                          </span>
                          <span className="bg-emerald-900/80 text-emerald-200 text-[10px] px-2.5 py-0.5 rounded border border-emerald-600">
                            {activeSlideVip.category}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${activeSlideVip.isNegotiable !== false ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                            {activeSlideVip.isNegotiable !== false ? '💬 Bisa Nego' : '🔒 Harga Pas'}
                          </span>
                        </div>
                        <span className="text-xs text-emerald-200 font-bold bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-700">
                          👀 {activeSlideVip.viewCount || 1} Dilihat
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-white leading-snug line-clamp-1">{activeSlideVip.title}</h3>
                      <p className="text-amber-400 font-black text-sm">{activeSlideVip.price}</p>

                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-300">
                        <span>👤 {activeSlideVip.fullName || activeSlideVip.nickname} • 📍 {activeSlideVip.location}</span>
                        {activeSlideVip.isNegotiable !== false ? (
                          <button 
                            onClick={() => handleOpenNego(activeSlideVip)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3.5 py-1 rounded-lg text-xs transition shadow"
                          >
                            Tawar Harga (Nego) ➔
                          </button>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-lg text-xs font-semibold">
                            Harga Pas (Tidak Bisa Nego)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}

          {/* LAYOUT 3 KOLOM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 1. KOLOM KIRI: BERITA */}
            <aside aria-label="Berita Komoditas Sulsel" className="lg:col-span-3 space-y-4 order-2 lg:order-1">
              <div className="bg-white border border-emerald-200/80 rounded-3xl p-5 shadow-sm space-y-4 sticky top-24">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                      <span>📰</span> Berita Komoditas Sulsel
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Update otomatis tiap 1-2 jam</p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full animate-pulse">
                    Live ⚡
                  </span>
                </div>

                <div className="space-y-3.5">
                  {activeNewsList.map((news) => (
                    <div key={news.id} className="group border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 space-y-1.5">
                      <a 
                        href={news.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700 transition leading-snug line-clamp-2 block"
                      >
                        {news.title}
                      </a>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-emerald-800">{news.source}</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* 2. KOLOM TENGAH: DIREKTORI UTAMA */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => { setActiveTab('Supply'); setCurrentPage(1); }}
                  className={`p-5 rounded-2xl text-left transition-all flex items-center justify-between border-2 ${
                    activeTab === 'Supply' 
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-lg scale-[1.01]' 
                      : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400 shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🌱</span>
                      <span className="font-extrabold text-sm sm:text-base uppercase tracking-wider">Pasokan Masuk</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeTab === 'Supply' ? 'bg-emerald-950 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}>
                        {supplyCount} Iklan
                      </span>
                    </div>
                    <p className={`text-xs ${activeTab === 'Supply' ? 'text-emerald-100' : 'text-slate-500'}`}>
                      Komoditas siap jual dari petani dan pemilik hasil panen Sulsel.
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeTab === 'Supply' ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {activeTab === 'Supply' ? '✓' : '→'}
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('Demand'); setCurrentPage(1); }}
                  className={`p-5 rounded-2xl text-left transition-all flex items-center justify-between border-2 ${
                    activeTab === 'Demand' 
                      ? 'bg-amber-700 text-white border-amber-800 shadow-lg scale-[1.01]' 
                      : 'bg-white text-slate-800 border-amber-200 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🛒</span>
                      <span className="font-extrabold text-sm sm:text-base uppercase tracking-wider">Kebutuhan Terbuka</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${activeTab === 'Demand' ? 'bg-amber-950 text-amber-200' : 'bg-amber-100 text-amber-800'}`}>
                        {demandCount} Iklan
                      </span>
                    </div>
                    <p className={`text-xs ${activeTab === 'Demand' ? 'text-amber-100' : 'text-slate-500'}`}>
                      Permintaan dan pencarian komoditas aktif oleh para pengepul & pembeli.
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeTab === 'Demand' ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {activeTab === 'Demand' ? '✓' : '→'}
                  </div>
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">🔍</span>
                    <input 
                      type="text"
                      placeholder="Cari komoditas, kabupaten, atau nama pengiklan..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50/30"
                    />
                  </div>

                  <select
                    value={selectedZone}
                    onChange={(e) => { setSelectedZone(e.target.value); setCurrentPage(1); }}
                    className="px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50/50 font-medium text-slate-700"
                  >
                    <option value="Semua Zona">Semua Zona Wilayah Sulsel</option>
                    <option value="Lumbung Padi">Lumbung Padi (Sidrap, Pinrang, Wajo, Soppeng)</option>
                    <option value="Bone & Selatan">Bone & Selatan (Bone, Gowa, Bulukumba, dll)</option>
                    <option value="Dataran Tinggi & Utara">Dataran Tinggi & Utara (Toraja, Enrekang, Luwu)</option>
                    <option value="Pesisir & Metropolitan">Pesisir & Metropolitan (Barru, Makassar, Maros, Pangkep)</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {['Semua', 'Pertanian', 'Peternakan', 'Perkebunan', 'Alat & Mesin'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategoryFilter(cat); setCurrentPage(1); }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${selectedCategoryFilter === cat ? 'bg-emerald-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-bold text-slate-800 px-1 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>{activeTab === 'Supply' ? '🌱' : '🛒'}</span>
                    <span>Menampilkan {activeTab === 'Supply' ? 'Pasokan Komoditas' : 'Kebutuhan Terbuka'}</span>
                    <span className="text-emerald-700 font-extrabold">({filteredListings.length})</span>
                  </span>
                </h2>

                {paginatedListings.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                    <p className="text-3xl">🌾</p>
                    <p className="font-medium text-xs">Belum ada data iklan aktif pada kategori ini.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedListings.map((item) => {
                      const hasImages = item.images && item.images.length > 0 && item.images[0];
                      const totalImagesCount = item.images ? item.images.filter(img => img && img.trim() !== '').length : 0;
                      const isNegotiable = item.isNegotiable !== false;

                      return (
                        <div key={item.id} className="bg-white p-4.5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-3.5 hover:shadow-md transition">
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-start flex-wrap gap-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {item.isRecommended && (
                                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] px-2 py-0.5 rounded font-extrabold shadow-sm">
                                    ⭐ Rekomendasi
                                  </span>
                                )}
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${item.type === 'Supply' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800 border-amber-100'}`}>
                                  {item.type === 'Supply' ? '🌱 Pasokan' : '🛒 Kebutuhan'}
                                </span>
                              </div>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                👀 {item.viewCount || 1} Dilihat
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">{item.title}</h3>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-[11px] text-slate-500">👤 <strong className="text-slate-700">{item.fullName || '-'}</strong></p>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isNegotiable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                  {isNegotiable ? '💬 Bisa Nego' : '🔒 Harga Pas'}
                                </span>
                              </div>
                            </div>

                            <div className="bg-emerald-50/60 px-3 py-2 rounded-xl border border-emerald-200 inline-block">
                              <span className="text-[11px] text-slate-500 mr-1.5">Harga:</span>
                              <span className="text-emerald-800 font-black text-xs sm:text-sm tracking-tight">{item.price}</span>
                            </div>

                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{item.desc}</p>

                            {hasImages && (
                              <div className="relative group/img">
                                <img 
                                  src={item.images![0]} 
                                  alt={item.title} 
                                  onClick={() => openLightbox(item.images, 0)}
                                  className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-sm cursor-zoom-in group-hover/img:opacity-95 transition"
                                  title="Klik untuk memperbesar galeri foto"
                                />
                                {totalImagesCount > 1 && (
                                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm pointer-events-none">
                                    📷 1 / {totalImagesCount} Foto
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-3 border-t border-slate-100 space-y-2.5">
                            <p className="text-[11px] text-slate-600 font-medium truncate">📍 {item.fullAddress || item.location}</p>

                            <div className="grid grid-cols-3 gap-1.5">
                              <button 
                                onClick={() => handleShare(item)}
                                className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 py-2 rounded-xl font-bold transition text-[11px] flex items-center justify-center gap-1"
                              >
                                <span>🔗</span> Share
                              </button>

                              {isNegotiable ? (
                                <button 
                                  onClick={() => handleOpenNego(item)}
                                  className="bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-bold transition text-[11px] flex items-center justify-center gap-1 shadow-sm"
                                  title="Klik untuk menawar harga"
                                >
                                  <span>🤝</span> Nego
                                </button>
                              ) : (
                                <button 
                                  disabled
                                  className="bg-slate-100 text-slate-400 py-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 cursor-not-allowed border border-slate-200"
                                  title="Harga pas, tidak menerima nego"
                                >
                                  <span>🔒</span> Pas
                                </button>
                              )}

                              <a 
                                href={`https://wa.me/${item.contact.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(item.nickname || item.fullName || 'Bapak/Ibu')},%20saya%20tertarik%20dengan%20informasi%20${encodeURIComponent(item.title)}%20di%20AgriAds%20Sulsel.`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-bold transition text-[11px] flex items-center justify-center gap-1"
                              >
                                <span>💬</span> WA
                              </a>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                onClick={() => {
                                  setSelectedListingForEdit(item);
                                  setIsAuthorizedToEdit(false);
                                  setInputAuthPassword('');
                                  setShowEditAuthModal(true);
                                }}
                                className="text-[10px] text-emerald-800 font-bold hover:underline flex items-center gap-1"
                              >
                                <span>✏️</span> Edit Iklan Saya
                              </button>
                              <span className="text-[10px] text-slate-400">{item.date}</span>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

                {/* KONTROL PAGINASI */}
                {totalPages > 1 && (
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between flex-wrap gap-3">
                    <span className="text-xs text-slate-500 font-medium">
                      Halaman <strong className="text-emerald-900">{currentPage}</strong> dari <strong>{totalPages}</strong>
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                          currentPage === 1 
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-xl text-xs font-extrabold transition shadow-sm ${
                            currentPage === page
                              ? 'bg-emerald-800 text-white shadow'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                          currentPage === totalPages 
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* 3. KOLOM KANAN: IKLAN SPONSOR */}
            <aside aria-label="Iklan Sponsor" className="lg:col-span-3 space-y-6 order-3 sticky top-24">
              
              <div className="bg-white border-2 border-dashed border-emerald-400 rounded-3xl p-6 shadow-md text-center space-y-4 relative overflow-hidden group hover:border-emerald-600 transition">
                <span className="absolute top-2.5 right-3.5 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sponsor 1
                </span>
                
                <div className="w-full h-48 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center p-4 border border-emerald-100 group-hover:bg-emerald-100/70 transition">
                  <span className="text-3xl mb-1.5">📢</span>
                  <p className="font-extrabold text-xs sm:text-sm text-emerald-950">Slot Banner Iklan Website Anda</p>
                  <p className="text-[11px] text-slate-500 mt-1">Ukuran Optimal: 300 x 250 px</p>
                </div>

                <a 
                  href={`https://wa.me/${ADMIN_WA_NUMBER.replace(/\D/g, '')}?text=Halo%20Admin,%20saya%20tertarik%20memesan%20slot%20banner%20iklan%20website%20di%20posisi%201.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 rounded-xl text-xs transition shadow-lg"
                >
                  Pasang Iklan Disini ➔
                </a>
              </div>

              <div className="bg-white border-2 border-dashed border-amber-400 rounded-3xl p-6 shadow-md text-center space-y-4 relative overflow-hidden group hover:border-amber-600 transition">
                <span className="absolute top-2.5 right-3.5 text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sponsor 2
                </span>
                
                <div className="w-full h-48 bg-amber-50/70 rounded-2xl flex flex-col items-center justify-center p-4 border border-amber-100 group-hover:bg-amber-100/70 transition">
                  <span className="text-3xl mb-1.5">⭐</span>
                  <p className="font-extrabold text-xs sm:text-sm text-amber-950">Slot Banner Iklan Website Anda</p>
                  <p className="text-[11px] text-slate-500 mt-1">Tampil permanen di halaman utama.</p>
                </div>

                <a 
                  href={`https://wa.me/${ADMIN_WA_NUMBER.replace(/\D/g, '')}?text=Halo%20Admin,%20saya%20tertarik%20memesan%20slot%20banner%20iklan%20website%20di%20posisi%202.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-black py-2.5 rounded-xl text-xs transition shadow-lg"
                >
                  Pasang Iklan Disini ➔
                </a>
              </div>

            </aside>

          </div>
        </div>
      </div>

      {/* MODAL EDIT */}
      {showEditAuthModal && selectedListingForEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>🔐</span> Manajemen & Edit Iklan
              </h3>
              <button onClick={() => setShowEditAuthModal(false)} className="text-slate-400 hover:text-slate-700 p-2">✕</button>
            </div>

            {!isAuthorizedToEdit ? (
              <form onSubmit={handleVerifyAuthForEdit} className="space-y-4 text-sm">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-emerald-900">Komoditas: {selectedListingForEdit.title}</p>
                  <p>Masukkan password 4 angka pengiklan Anda.</p>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Password Pengiklan (4 Angka) *</label>
                  <input 
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Contoh: 1234"
                    value={inputAuthPassword}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setInputAuthPassword(val);
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs tracking-widest font-bold"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs transition shadow"
                >
                  Verifikasi Password
                </button>
              </form>
            ) : (
              <form onSubmit={handleSaveEditedListing} className="space-y-4 text-sm">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                  ⚠️ <strong>Catatan Sistem:</strong> Anda dapat mengubah judul, deskripsi, dan foto sesuka hati.
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Judul Komoditas Baru *</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Deskripsi Keterangan *</label>
                  <textarea 
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-slate-700">Ganti Tautan Foto (Maksimal 4 Foto)</label>
                  {editImages.map((img, idx) => (
                    <input 
                      key={idx}
                      type="url"
                      placeholder={`URL Foto ${idx + 1}`}
                      value={img}
                      onChange={(e) => {
                        const newImgs = [...editImages];
                        newImgs[idx] = e.target.value;
                        setEditImages(newImgs);
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs mb-1"
                    />
                  ))}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs transition shadow"
                >
                  Simpan Perubahan Iklan
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL REGISTRASI IKLAN BARU */}
      {showInputModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>📝</span> Pasang Iklan Baru & Pilih Foto dari Galeri HP
              </h3>
              <button onClick={() => setShowInputModal(false)} className="text-slate-400 hover:text-slate-700 p-2">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jenis Kanal *</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                  >
                    <option value="Supply">Pasokan (Petani Jual)</option>
                    <option value="Demand">Kebutuhan (Pengepul Cari)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sektor / Kategori *</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                  >
                    <option value="Pertanian">Pertanian</option>
                    <option value="Peternakan">Peternakan</option>
                    <option value="Perkebunan">Perkebunan</option>
                    <option value="Alat & Mesin">Alat & Mesin Pertanian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Judul Komoditas *</label>
                <input 
                  type="text" 
                  placeholder="Cth: Gabah Kering Panen / Sapi Bali"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                  required
                />
              </div>

              {/* HARGA DAN SATUAN LENGKAP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Nominal Harga (Angka Saja) *</label>
                  <input 
                    type="text" 
                    placeholder="Cth: 6300 atau 15000000"
                    value={formPriceNumber}
                    onChange={(e) => setFormPriceNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Satuan *</label>
                  <select
                    value={formUnitType}
                    onChange={(e) => setFormUnitType(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold"
                  >
                    {UNITS_LIST.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Pengaturan Nego Harga *</label>
                  <select
                    value={formIsNegotiable ? 'yes' : 'no'}
                    onChange={(e) => setFormIsNegotiable(e.target.value === 'yes')}
                    className="w-full px-3.5 py-2.5 border border-emerald-300 rounded-xl bg-emerald-50/50 text-xs font-bold text-emerald-950"
                  >
                    <option value="yes">💬 Bisa Nego (Tombol Nego Menyala)</option>
                    <option value="no">🔒 Harga Pas (Tombol Nego Mati/Terkunci)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nama Lengkap Pengiklan *</label>
                  <input 
                    type="text" 
                    placeholder="Nama sesuai KTP"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                    required
                  />
                </div>
              </div>

              {/* NO HP & NIK KTP DENGAN VALIDASI PANJANG & ANGKA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nomor WhatsApp Kontak (10-13 Digit) *</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    maxLength={13}
                    placeholder="081234567890"
                    value={formContact}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 13);
                      setFormContact(val);
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Hanya angka, maksimal 13 digit.</p>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nomor NIK KTP (Wajib 16 Digit) *</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    maxLength={16}
                    placeholder="7314..."
                    value={formNik}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setFormNik(val);
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Harus tepat 16 digit angka.</p>
                </div>
              </div>

              {/* PASSWORD PENGIKLAN / PIN EDIT TEPAT 4 ANGKA */}
              <div>
                <label className="block font-bold text-emerald-900 mb-1">Password / PIN Pengeditan (Wajib Tepat 4 Angka) *</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="Contoh: 8899"
                  value={formOwnerPassword}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setFormOwnerPassword(val);
                  }}
                  className="w-full px-3.5 py-2.5 border border-emerald-300 rounded-xl bg-emerald-50/50 text-xs font-bold tracking-widest text-center text-base"
                  required
                />
                <p className="text-[10px] text-emerald-800 mt-0.5">⚠️ Hanya boleh 4 angka tanpa karakter lain. Digunakan jika Anda ingin mengedit iklan ini kelak.</p>
              </div>

              {/* ALAMAT TERPERINCI (KAB, KEC, KEL/DESA, DLL) */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block font-bold text-emerald-900 text-xs">Wilayah & Alamat Asal Pengiklan *</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Pilih Kabupaten / Kota / Wilayah</label>
                    <select 
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold text-emerald-950"
                    >
                      {SULSEL_REGIONS.map((reg) => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Kecamatan, Kelurahan / Desa / Dusun & Patokan</label>
                    <input 
                      type="text" 
                      placeholder="Cth: Kec. Binuang, Desa Tonrong, Dusun Mawar"
                      value={formAddressDetail}
                      onChange={(e) => setFormAddressDetail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-xs"
                      required
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic">💡 Tuliskan kecamatan, kelurahan/desa, dan dusun dengan jelas agar pembeli mudah menemukan lokasi Anda.</p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Deskripsi Keterangan Produk *</label>
                <textarea 
                  placeholder="Jelaskan kualitas, ketersediaan stok, dll..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                  rows={2}
                  required
                />
              </div>

              {/* INPUT FILE GAMBAR PRODUK OTOMATIS DIKOMPRES */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="block font-bold text-emerald-900 text-xs">Pilih Foto Produk (Maksimal 4 Foto dari Galeri / Kamera HP)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    const selectedFiles = Array.from(files).slice(0, 4);
                    
                    for (let i = 0; i < selectedFiles.length; i++) {
                      try {
                        const compressedBase64 = await compressImage(selectedFiles[i], 800, 800, 0.7);
                        setFormImages((prev) => [...prev, compressedBase64]);
                      } catch (err) {
                        console.error('Gagal mengompres gambar:', err);
                      }
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {formImages.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {formImages.map((src, i) => (
                      <img key={i} src={src} alt="Preview" className="w-14 h-14 object-cover rounded-lg border" />
                    ))}
                  </div>
                )}
              </div>

              {/* PILIHAN PAKET & INPUT BUKTI TRANSFER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pilih Paket Penayangan *</label>
                  <select 
                    value={formPackage}
                    onChange={(e) => setFormPackage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs"
                  >
                    <option value="Standar Gratis">Standar Gratis</option>
                    <option value="Paket Bump Up Prioritas (Rp 25.000)">Paket Bump Up Prioritas (Rp 25.000)</option>
                    <option value="Paket Unggulan VIP (Rp 50.000)">Paket Unggulan VIP (Rp 50.000)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-emerald-900 text-xs mb-1">Pilih Bukti Transfer Pembayaran (Opsional)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        try {
                          const compressedBase64 = await compressImage(e.target.files[0], 800, 800, 0.7);
                          setFormPaymentProof(compressedBase64);
                        } catch (err) {
                          console.error('Gagal mengompres bukti transfer:', err);
                        }
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                  />
                  {formPaymentProof && (
                    <img src={formPaymentProof} alt="Bukti Transfer" className="w-14 h-14 object-cover rounded-lg border mt-2" />
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition shadow-md text-xs">
                  Terbitkan Iklan
                </button>
                <button type="button" onClick={() => setShowInputModal(false)} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-semibold text-xs">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INTERAKTIF NEGO / TAWAR HARGA */}
      {activeNegoItem && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-emerald-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-emerald-950 flex items-center gap-2">
                <span>🤝</span> Nego Harga Komoditas
              </h3>
              <button 
                onClick={() => setActiveNegoItem(null)} 
                className="text-slate-400 hover:text-slate-700 p-1 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-1">
              <p className="text-xs font-extrabold text-emerald-950">{activeNegoItem.title}</p>
              <p className="text-xs text-slate-600">Harga awal: <strong className="text-emerald-800">{activeNegoItem.price}</strong></p>
              <p className="text-[11px] text-slate-500">Penjual: <strong>{activeNegoItem.fullName || activeNegoItem.nickname || 'Petani Sulsel'}</strong></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tawaran Harga Anda (Rp) *</label>
                <input 
                  type="text" 
                  placeholder="Cth: 6000 atau 14000000"
                  value={negotiatedPrice}
                  onChange={(e) => setNegotiatedPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan / Volume (Opsional)</label>
                <textarea 
                  placeholder="Cth: Saya ambil 5 ton, bisa diantar ke Makassar?"
                  value={negoNotes}
                  onChange={(e) => setNegoNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <a 
                href={`https://wa.me/${activeNegoItem.contact.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Halo Bapak/Ibu ${activeNegoItem.fullName || 'Penjual'}, saya melihat produk *${activeNegoItem.title}* di AgriAds Sulsel.\n\nSaya ingin menawar harga di angka *Rp ${negotiatedPrice}*.\nCatatan:${negoNotes || 'Mohon konfirmasinya, terima kasih.'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveNegoItem(null)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
              >
                <span>💬</span> Kirim Penawaran via WhatsApp
              </a>
              <button 
                type="button" 
                onClick={() => setActiveNegoItem(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-3 rounded-xl font-bold text-xs transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LIGHTBOX DENGAN TOMBOL PREV & NEXT */}
      {previewImages.length > 0 && (
        <div 
          onClick={() => setPreviewImages([])}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-12 inset-x-0 flex items-center justify-between text-white px-2">
              <span className="text-xs font-bold bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                Foto {currentImageIndex + 1} dari {previewImages.length}
              </span>
              <button 
                onClick={() => setPreviewImages([])}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition border border-slate-700"
              >
                ✕ Tutup (Esc)
              </button>
            </div>

            <div className="relative w-full flex items-center justify-center">
              {previewImages.length > 1 && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1))}
                  className="absolute left-2 z-10 bg-slate-900/80 hover:bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition border border-slate-700 shadow-xl"
                  title="Foto Sebelumnya"
                >
                  ❮
                </button>
              )}

              <img 
                src={previewImages[currentImageIndex]} 
                alt={`Pratinjau ${currentImageIndex + 1}`} 
                className="max-w-full max-h-[75vh] object-contain rounded-2xl border-2 border-slate-700 shadow-2xl bg-slate-900"
              />

              {previewImages.length > 1 && (
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 z-10 bg-slate-900/80 hover:bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition border border-slate-700 shadow-xl"
                  title="Foto Selanjutnya"
                >
                  ❯
                </button>
              )}
            </div>

            {previewImages.length > 1 && (
              <div className="flex items-center gap-2 pt-2 overflow-x-auto max-w-full">
                {previewImages.map((imgUrl, thumbIdx) => (
                  <img
                    key={thumbIdx}
                    src={imgUrl}
                    alt={`Thumbnail ${thumbIdx + 1}`}
                    onClick={() => setCurrentImageIndex(thumbIdx)}
                    className={`w-14 h-14 object-cover rounded-xl cursor-pointer transition-all border-2 ${
                      currentImageIndex === thumbIdx ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            )}
            <p className="text-[11px] text-slate-400">Gunakan tombol panah di samping gambar untuk beralih foto.</p>
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP BANTUAN ADMIN */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {isWaHelpOpen && (
          <div className="bg-white p-4 rounded-2xl shadow-2xl border border-emerald-100 max-w-xs w-64 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="font-extrabold text-xs text-emerald-950">Bantuan Admin AgriAds</p>
              </div>
              <button onClick={() => setIsWaHelpOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs p-0.5">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Halo 👋, silakan hubungi kami jika Anda memerlukan bantuan seputar pemasangan iklan atau kendala transaksi.
            </p>

            <a 
              href={`https://wa.me/${ADMIN_WA_NUMBER.replace(/\D/g, '')}?text=Halo%20Admin%20AgriAds%20Sulsel,%20saya%20butuh%20bantuan.`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition shadow flex items-center justify-center gap-2"
            >
              <span>💬</span> Chat WhatsApp Admin
            </a>
          </div>
        )}

        <button
          onClick={() => setIsWaHelpOpen(!isWaHelpOpen)}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/80 group"
          title="Bantuan WhatsApp Admin"
        >
          {isWaHelpOpen ? (
            <span className="text-xl font-bold">✕</span>
          ) : (
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          )}
        </button>
      </div>

      <footer className="mt-16 bg-white border-t border-slate-200 py-8 px-6 text-xs text-slate-500 space-y-6">
        <div className="max-w-[96%] xl:max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-emerald-900 text-sm">AgriAds Sulsel — Platform Direktori Offline-First Pertanian Sulawesi Selatan</p>
            <p className="text-slate-400">© 2026 Arifullah Muh.syukur • Hak cipta dilindungi.</p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3">
            <span className="font-extrabold text-xs text-emerald-900 tracking-tight flex items-center gap-1">
              <span>🌐</span> Temukan kami:
            </span>
            <div className="flex items-center gap-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xs font-bold shadow-sm transition">fb</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white flex items-center justify-center text-xs font-bold shadow-sm transition">ig</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-xs font-bold shadow-sm transition">yt</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}