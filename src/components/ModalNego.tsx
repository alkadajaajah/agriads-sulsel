// src/components/ModalNego.tsx
"use client";

import React, { useState } from "react";

interface ModalNegoProps {
  isOpen: boolean;
  onClose: () => void;
  listingTitle: string;
  hargaAwal: number;
  nomorWhatsAppPenjual: string;
}

export default function ModalNego({
  isOpen,
  onClose,
  listingTitle,
  hargaAwal,
  nomorWhatsAppPenjual,
}: ModalNegoProps) {
  const [tawaranHarga, setTawaranHarga] = useState("");
  const [tawaranVolume, setTawaranVolume] = useState("");
  const [catatan, setCatatan] = useState("");

  if (!isOpen) return null;

  const handleKirimNegoWA = (e: React.FormEvent) => {
    e.preventDefault();

    // Format nomor HP ke 62
    let formattedPhone = nomorWhatsAppPenjual.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    }

    // Susun pesan WhatsApp otomatis
    const pesanWA = `Halo, saya tertarik dengan komoditas Anda di *AgriAds Sulsel*:
📌 *Produk:* ${listingTitle}
💰 *Harga Penawaran Awal:* Rp ${hargaAwal.toLocaleString("id-ID")}
🤝 *Tawaran Harga Nego:* Rp ${parseFloat(tawaranHarga).toLocaleString("id-ID")}
📦 *Volume Kebutuhan:* ${tawaranVolume}
📝 *Catatan Tambahan:* ${catatan || "-"}

Apakah penawaran ini disetujui?`;

    const encodedURL = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(pesanWA)}`;
    
    // Buka WhatsApp di tab baru
    window.open(encodedURL, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
        <h3 className="text-lg font-bold text-emerald-900 mb-1">Pengajuan Nego Dua Arah</h3>
        <p className="text-xs text-gray-600 mb-4">Komoditas: {listingTitle}</p>

        <form onSubmit={handleKirimNegoWA} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700">Tawaran Harga Anda (Rp)</label>
            <input
              type="number"
              required
              value={tawaranHarga}
              onChange={(e) => setTawaranHarga(e.target.value)}
              placeholder={`Harga awal: ${hargaAwal}`}
              className="w-full border p-2 text-sm rounded mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Volume / Jumlah Kebutuhan</label>
            <input
              type="text"
              required
              value={tawaranVolume}
              onChange={(e) => setTawaranVolume(e.target.value)}
              placeholder="Contoh: 500 Kg / 10 Ekor / 2 Ton"
              className="w-full border p-2 text-sm rounded mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Pesan / Catatan Tambahan</label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Bisa dijemput langsung di kebun?"
              className="w-full border p-2 text-sm rounded mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 border rounded hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded transition"
            >
              Kirim Nego via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}