'use client';

import { useState, useEffect } from 'react';

interface Listing {
  id: number;
  title: string;
  category: string;
  type: 'Supply' | 'Demand';
  price: string;          
  location: string;
  contact: string;        // Nomor HP / WhatsApp
  fullName?: string;      // Nama lengkap pengiklan
  nickname?: string;
  nik?: string;           // Nomor NIK
  fullAddress?: string;
  desc: string;
  date: string;
  status?: 'pending' | 'approved' | 'blocked';
  paymentPackage?: string;
  paymentProof?: string;  
  images?: string[];      
  ownerPassword?: string; 
  rejectionReason?: string; // Alasan penangguhan atau penolakan dari admin
  createdAt?: number;     // Waktu pembuatan iklan untuk hitung mundur
}

// Password rahasia untuk masuk ke Panel Admin
const ADMIN_SECRET_PASSWORD = 'admin123';

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk Filter Status (Semua, pending, approved, blocked)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'blocked'>('all');

  // State untuk modal input alasan penangguhan
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedListingForBlock, setSelectedListingForBlock] = useState<Listing | null>(null);
  const [inputReason, setInputReason] = useState('');

  // State untuk modal lightbox / perbesar gambar
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Helper Total Hari Berdasarkan Paket
  const getPackageTotalDays = (pkg?: string) => {
    if (pkg && pkg.includes('VIP')) return 30;
    if (pkg && pkg.includes('Bump Up')) return 15;
    return 7; // Standar Gratis
  };

  // Helper Hitung Mundur Sisa Hari Aktif
  const getRemainingDays = (item: Listing) => {
    const createdAt = item.createdAt || Date.now();
    const maxDays = getPackageTotalDays(item.paymentPackage);
    const elapsedDays = Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24));
    const remaining = maxDays - elapsedDays;
    return remaining > 0 ? remaining : 0;
  };

  useEffect(() => {
    setMounted(true);
    
    const authStatus = sessionStorage.getItem('agriads_sulsel_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    const savedData = localStorage.getItem('agriads_sulsel_core_data');
    if (savedData) {
      try {
        setListings(JSON.parse(savedData));
      } catch (e) {
        console.error('Gagal memuat data');
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === ADMIN_SECRET_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('agriads_sulsel_admin_auth', 'true');
      setInputPassword('');
    } else {
      alert('Password Admin Salah! Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda ingin keluar dari Panel Admin?')) {
      setIsAuthenticated(false);
      sessionStorage.removeItem('agriads_sulsel_admin_auth');
    }
  };

  const saveAndSync = (newListings: Listing[]) => {
    setListings(newListings);
    localStorage.setItem('agriads_sulsel_core_data', JSON.stringify(newListings));
  };

  const handleUpdateStatus = (id: number, newStatus: 'pending' | 'approved' | 'blocked', reason?: string) => {
    const updated = listings.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          status: newStatus, 
          rejectionReason: reason !== undefined ? reason : item.rejectionReason 
        };
      }
      return item;
    });
    saveAndSync(updated);
  };

  const handleOpenBlockModal = (item: Listing) => {
    setSelectedListingForBlock(item);
    setInputReason(item.rejectionReason || '');
    setShowReasonModal(true);
  };

  const handleSubmitBlockWithReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForBlock) return;

    handleUpdateStatus(selectedListingForBlock.id, 'blocked', inputReason);
    setShowReasonModal(false);
    setSelectedListingForBlock(null);
    setInputReason('');
    alert('Iklan berhasil ditangguhkan beserta keterangan alasannya.');
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus iklan ini dari sistem?')) {
      const updated = listings.filter(item => item.id !== id);
      saveAndSync(updated);
    }
  };

  if (!mounted) return <div className="p-8 text-slate-500">Memuat Panel Admin...</div>;

  // JIKA BELUM LOGIN, TAMPILKAN HALAMAN FORM LOGIN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-4xl">🔐</span>
            <h1 className="text-xl font-black text-amber-400">Login Panel Admin</h1>
            <p className="text-xs text-slate-400">Masukkan password admin untuk mengakses kontrol moderasi iklan AgriAds Sulsel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password Admin *</label>
              <input 
                type="password"
                placeholder="Masukkan password..."
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition shadow"
            >
              Masuk ke Dashboard Admin
            </button>
          </form>

          <div className="text-center pt-2">
            <a href="/" className="text-xs text-slate-400 hover:text-white transition">
              ← Kembali ke Website Utama
            </a>
          </div>
        </div>
      </main>
    );
  }

  const pendingListings = listings.filter(i => (i.status || 'pending') === 'pending');

  const filteredListings = listings.filter(item => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.fullName && item.fullName.toLowerCase().includes(query)) ||
      (item.contact && item.contact.toLowerCase().includes(query)) ||
      (item.nik && item.nik.toLowerCase().includes(query)) ||
      (item.location && item.location.toLowerCase().includes(query));

    const itemStatus = item.status || 'pending';
    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🛡️</span>
              <h1 className="text-xl md:text-2xl font-black text-amber-400">Panel Kontrol Admin & Kurasi Iklan Sulsel</h1>
            </div>
            <p className="text-xs text-slate-400">Halaman khusus pengelola untuk memantau galeri foto, bukti transfer, password, nama & No HP, NIK, serta hitung mundur masa aktif paket iklan.</p>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="/" 
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition border border-slate-700"
            >
              ← Website Utama
            </a>
            <button 
              onClick={handleLogout}
              className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow"
            >
              Keluar (Logout) 🚪
            </button>
          </div>
        </div>

        {/* PENDING BANNER */}
        {pendingListings.length > 0 ? (
          <div className="bg-amber-950/70 border-2 border-amber-500/80 rounded-3xl p-5 shadow-lg space-y-3 animate-pulse">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h2 className="text-sm font-black text-amber-300">
                    Perhatian! Ada {pendingListings.length} Iklan Baru Belum Diverifikasi (Pending)
                  </h2>
                  <p className="text-xs text-amber-200/80">Iklan di bawah ini dikirim oleh pendaftar dan belum disetujui untuk tayang.</p>
                </div>
              </div>

              <button
                onClick={() => setStatusFilter('pending')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs transition shadow-md shrink-0"
              >
                Tampilkan Iklan Pending Saja ➔
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
              {pendingListings.map(item => (
                <div key={item.id} className="bg-slate-950/90 border border-amber-600/50 p-3 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">{item.type}</span>
                    <span className="text-[10px] text-slate-400">📅 {item.date}</span>
                  </div>
                  <p className="font-bold text-white truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-300">👤 {item.fullName || 'Tanpa Nama'} ({item.contact})</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/60 border border-emerald-800/80 p-4 rounded-3xl text-xs text-emerald-300 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="font-bold">Semua iklan masuk sudah diverifikasi (Tidak ada antrean iklan pending).</p>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400">Total Iklan Terdaftar</p>
            <p className="text-2xl font-black text-white mt-1">{listings.length}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400">Menunggu (Pending)</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{pendingListings.length}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400">Disetujui (Approved)</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{listings.filter(i => i.status === 'approved').length}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400">Ditangguhkan (Blocked)</p>
            <p className="text-2xl font-black text-rose-400 mt-1">{listings.filter(i => i.status === 'blocked').length}</p>
          </div>
        </div>

        {/* TABLE & SEARCH */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-400 mr-2">Filter Status:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'}`}
              >
                Semua ({listings.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === 'pending' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-amber-400 border border-slate-800 hover:bg-slate-800'}`}
              >
                Menunggu ({pendingListings.length})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === 'approved' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-900 text-emerald-400 border border-slate-800 hover:bg-slate-800'}`}
              >
                Disetujui ({listings.filter(i => i.status === 'approved').length})
              </button>
              <button
                onClick={() => setStatusFilter('blocked')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === 'blocked' ? 'bg-rose-500 text-slate-950 shadow' : 'bg-slate-900 text-rose-400 border border-slate-800 hover:bg-slate-800'}`}
              >
                Ditangguhkan ({listings.filter(i => i.status === 'blocked').length})
              </button>
            </div>
            
            <input 
              type="text"
              placeholder="Cari Nama, No HP, Judul, Lokasi, atau NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 w-full md:w-80"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                  <th className="p-3.5">Galeri Foto & Identitas (Nama & No HP)</th>
                  <th className="p-3.5">Komoditas & Keterangan Alasan</th>
                  <th className="p-3.5">Paket, Countdown & Bukti Transfer</th>
                  <th className="p-3.5">Password Akun</th>
                  <th className="p-3.5 text-right">Aksi Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">Tidak ada data iklan ditemukan untuk pencarian atau filter ini.</td>
                  </tr>
                ) : (
                  filteredListings.map((item) => {
                    const remainingDays = getRemainingDays(item);
                    const maxDays = getPackageTotalDays(item.paymentPackage);

                    return (
                      <tr key={item.id} className="hover:bg-slate-900/40 transition align-top">
                        
                        <td className="p-3.5 space-y-2">
                          <div className="space-y-1">
                            <p className="font-bold text-white text-sm">{item.fullName || 'Tanpa Nama'}</p>
                            <p className="text-[11px] text-emerald-300 font-semibold">📞 HP: {item.contact}</p>
                            <p className="text-[10px] text-amber-400/90 font-mono">🆔 NIK: {item.nik || '-'}</p>
                            <p className="text-[10px] text-slate-500">📍 {item.location}</p>
                          </div>

                          {item.images && item.images.length > 0 && item.images.some(img => img.trim() !== '') && (
                            <div className="pt-1">
                              <p className="text-[10px] text-slate-400 mb-1">Foto Komoditas (Klik perbesar):</p>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {item.images.map((img, idx) => img && img.trim() !== '' && (
                                  <img 
                                    key={idx}
                                    src={img}
                                    alt={`Foto ${idx + 1}`}
                                    onClick={() => setPreviewImage(img)}
                                    className="w-12 h-12 object-cover rounded-xl border border-slate-700 cursor-pointer hover:border-amber-400 hover:scale-105 transition shadow-sm"
                                    title="Klik untuk memperbesar gambar"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="p-3.5 space-y-1.5 max-w-xs">
                          <p className="font-bold text-emerald-400 text-sm">{item.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="inline-block bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-medium">
                              {item.type} • {item.category}
                            </span>
                            <span className="text-amber-400 font-extrabold">{item.price}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{item.desc}</p>

                          {item.status === 'blocked' && (
                            <div className="mt-2 bg-rose-950/60 border border-rose-800/80 p-2.5 rounded-xl text-[11px] text-rose-200 space-y-1.5">
                              <div className="flex justify-between items-center">
                                <p className="font-bold text-rose-400 flex items-center gap-1">
                                  <span>⚠️</span> Alasan Penangguhan:
                                </p>
                                
                                <a 
                                  href={`https://wa.me/${item.contact.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(item.fullName || 'Pengiklan')},%20iklan%20Anda%20di%20AgriAds%20Sulsel%20(${encodeURIComponent(item.title)})%20ditangguhkan%20oleh%20admin.%20Alasan:%20${encodeURIComponent(item.rejectionReason || 'Tidak sesuai ketentuan direktori')}.%20Mohon%20segera%20perbaiki.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition shadow flex items-center gap-1"
                                  title="Kirim Alasan Penangguhan ke WhatsApp Pengiklan"
                                >
                                  <span>💬</span> Kirim Alasan ke WA
                                </a>
                              </div>
                              <p className="italic">{item.rejectionReason || 'Tidak ada keterangan alasan yang diisi.'}</p>
                            </div>
                          )}
                        </td>

                        <td className="p-3.5 space-y-2">
                          <div>
                            <span className="font-bold text-amber-300 block text-xs">{item.paymentPackage || 'Standar Gratis'}</span>
                            <span className="inline-block mt-1 bg-amber-950/80 text-amber-300 border border-amber-600/60 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                              ⏳ Sisa Waktu: {remainingDays} dari {maxDays} Hari
                            </span>
                          </div>
                          
                          {item.paymentProof ? (
                            <div>
                              <p className="text-[10px] text-emerald-400 mb-1 font-semibold">Bukti Transfer (Klik perbesar):</p>
                              <img 
                                src={item.paymentProof} 
                                alt="Bukti Transfer" 
                                onClick={() => setPreviewImage(item.paymentProof || null)}
                                className="w-16 h-16 object-cover rounded-xl border border-emerald-600/60 cursor-pointer hover:scale-105 transition shadow-md"
                                title="Klik untuk memperbesar bukti transfer"
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Tanpa bukti transfer (Standar)</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-slate-900 text-emerald-400 px-2.5 py-1.5 rounded-xl border border-slate-700 font-bold text-xs tracking-wider">
                              {item.ownerPassword || '-'}
                            </span>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(item.ownerPassword || '');
                                alert(`Password "${item.ownerPassword}" berhasil disalin!`);
                              }}
                              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-xl transition font-bold border border-slate-700"
                              title="Salin Password"
                            >
                              Salin
                            </button>
                          </div>
                        </td>

                        <td className="p-3.5 text-right space-y-2">
                          <div className="space-y-1 mb-2">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              item.status === 'blocked' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                              'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                            }`}>
                              {item.status === 'approved' ? 'Disetujui' : item.status === 'blocked' ? 'Ditangguhkan' : '⚠️ Belum Verifikasi'}
                            </span>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {item.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateStatus(item.id, 'approved', '')}
                                className="bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl font-bold text-[10px] transition shadow"
                              >
                                Setujui
                              </button>
                            )}
                            {item.status !== 'blocked' && (
                              <button
                                onClick={() => handleOpenBlockModal(item)}
                                className="bg-amber-700 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded-xl font-bold text-[10px] transition shadow"
                              >
                                Tangguhkan
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 px-2.5 py-1.5 rounded-xl font-semibold text-[10px] transition shadow"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL ALASAN */}
      {showReasonModal && selectedListingForBlock && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitBlockWithReason} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <span>⚠️</span> Berikan Alasan Penangguhan Iklan
              </h3>
              <button type="button" onClick={() => setShowReasonModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <p className="font-bold text-emerald-400">{selectedListingForBlock.title}</p>
              <p className="text-slate-400">Pengiklan: {selectedListingForBlock.fullName} (HP: {selectedListingForBlock.contact})</p>
              <p className="text-amber-400 font-mono">NIK: {selectedListingForBlock.nik || '-'}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Keterangan Alasan / Catatan Admin *</label>
              <textarea 
                placeholder="Cth: Foto produk tidak sesuai, harga tidak wajar..."
                value={inputReason}
                onChange={(e) => setInputReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs transition shadow"
              >
                Konfirmasi Penangguhan
              </button>
              <button 
                type="button" 
                onClick={() => setShowReasonModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL LIGHTBOX */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-3" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition border border-slate-700"
            >
              ✕ Tutup (Esc)
            </button>
            <img 
              src={previewImage} 
              alt="Pratinjau Diperbesar" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border-2 border-slate-700 shadow-2xl bg-slate-900"
            />
            <p className="text-xs text-slate-400">Klik di luar gambar atau tombol tutup untuk kembali ke tabel admin.</p>
          </div>
        </div>
      )}
    </main>
  );
}