// src/components/SmartSearchBar.tsx
"use client";

import React, { useState } from "react";

// Kamus dialek lokal Sulsel internal agar tidak memerlukan file terpisah
const kamusDialekSulsel: Record<string, string[]> = {
  rica: ["rica", "cabe", "cabai", "lombok"],
  cabe: ["rica", "cabe", "cabai", "lombok"],
  cabai: ["rica", "cabe", "cabai", "lombok"],
  ase: ["ase", "padi", "gabah", "beras"],
  padi: ["ase", "padi", "gabah", "beras"],
  beras: ["ase", "padi", "gabah", "beras"],
  tedong: ["tedong", "kerbau"],
  kerbau: ["tedong", "kerbau"],
  balao: ["balao", "tikus"],
  jawa: ["jawa", "jagung"],
  jagung: ["jawa", "jagung"],
  kaluku: ["kaluku", "kelapa"],
  kelapa: ["kaluku", "kelapa"],
  manu: ["manu", "ayam"],
  ayam: ["manu", "ayam"],
  bale: ["bale", "ikan"],
  ikan: ["bale", "ikan"]
};

// Helper pencocokan kata kunci dialek lokal
function cariKataKunciKamus(input: string): string[] {
  const kataBersih = input.trim().toLowerCase();
  if (!kataBersih) return [];

  // Jika kata ada di kamus dialek, kembalikan semua sinonimnya
  if (kamusDialekSulsel[kataBersih]) {
    return kamusDialekSulsel[kataBersih];
  }

  // Jika tidak ada di kamus khusus, gunakan kata input itu sendiri
  return [kataBersih];
}

interface SmartSearchProps {
  onSearch: (keywords: string[], kabupaten: string) => void;
}

export default function SmartSearchBar({ onSearch }: SmartSearchProps) {
  const [inputKeyword, setInputKeyword] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [detectedDialeks, setDetectedDialeks] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKeyword.trim()) return;

    // Pencocokan kata kunci dialek lokal
    const keywords = cariKataKunciKamus(inputKeyword);
    setDetectedDialeks(keywords);
    onSearch(keywords, selectedKabupaten);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-200 mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            placeholder="Cari komoditas (contoh: rica, ase, tedong, kelapa)..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
          />
        </div>
        <div className="w-full md:w-56">
          <select
            value={selectedKabupaten}
            onChange={(e) => setSelectedKabupaten(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
          >
            <option value="">Semua Kabupaten (Sulsel)</option>
            <option value="Gowa">Gowa</option>
            <option value="Bone">Bone</option>
            <option value="Bantaeng">Bantaeng</option>
            <option value="Bulukumba">Bulukumba</option>
            <option value="Maros">Maros</option>
            <option value="Pinrang">Pinrang</option>
            <option value="Sidrap">Sidrap</option>
            <option value="Wajo">Wajo</option>
            <option value="Toraja">Toraja</option>
            <option value="Makassar">Makassar</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Cari Komoditas
        </button>
      </form>

      {detectedDialeks.length > 1 && (
        <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100">
          <span className="font-semibold">Sistem Cerdas Mengidentifikasi Dialek:</span> {detectedDialeks.join(" • ")}
        </div>
      )}
    </div>
  );
}