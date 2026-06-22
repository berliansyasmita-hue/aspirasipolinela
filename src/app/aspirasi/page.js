"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DaftarAspirasi() {
  const [aspirasiList, setAspirasiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data aspirasi dari API database Supabase
  useEffect(() => {
    const fetchAspirasi = async () => {
      try {
        const response = await fetch("/api/aspirasi");
        const result = await response.json();
        
        if (response.ok && result.success) {
          setAspirasiList(result.data || []);
        } else {
          setError(result.error || "Gagal mengambil data aspirasi.");
        }
      } catch (err) {
        console.error("Kesalahan fetch:", err);
        setError("Gagal terhubung ke server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAspirasi();
  }, []);

  // Fungsi pembantu warna status
  const getStatusStyle = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Ditolak":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default: // Diproses
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  // Format tanggal Indonesia
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Halaman */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Daftar Aspirasi Mahasiswa</h1>
            <p className="text-sm text-gray-500 mt-1">
              Pantau dan kawal bersama semua aspirasi yang telah disampaikan oleh mahasiswa Polinela.
            </p>
          </div>
          <Link 
            href="/buat-aspirasi" 
            className="inline-block bg-polinela-gold hover:bg-amber-400 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm text-center transition-all"
          >
            + Sampaikan Aspirasi Baru
          </Link>
        </div>

        {/* Keadaan Memuat (Loading) */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-polinela-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Menarik data aspirasi dari Supabase...</p>
          </div>
        )}

        {/* Keadaan Eror */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-center text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Keadaan Daftar Kosong */}
        {!isLoading && !error && aspirasiList.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-gray-400 text-base mb-4">Belum ada aspirasi yang disampaikan saat ini.</p>
            <Link 
              href="/buat-aspirasi" 
              className="inline-block bg-polinela-gold hover:bg-amber-400 text-gray-900 font-bold px-5 py-2 rounded-xl text-sm"
            >
              Kirim Aspirasi Pertama
            </Link>
          </div>
        )}

        {/* Ruang List Kartu Aspirasi */}
        {!isLoading && !error && aspirasiList.length > 0 && (
          <div className="space-y-6">
            {aspirasiList.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                
                {/* Baris Atas Kartu: Kategori & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {item.kategori}
                  </span>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getStatusStyle(item.status)}`}>
                    • {item.status}
                  </span>
                </div>

                {/* Judul & Deskripsi */}
                <h2 className="text-lg font-bold text-gray-800 mb-2 leading-snug">
                  {item.judul}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {item.deskripsi}
                </p>

                {/* Garis Pembatas Tipis */}
                <div className="border-t border-gray-50 pt-4 flex flex-wrap items-center justify-between text-xs text-gray-400 font-medium gap-2">
                  <div>
                    Oleh: <span className="text-gray-600 font-semibold">
                      {item.isAnonymous ? "Anonim" : (item.mahasiswa ? `${item.mahasiswa.nama || "Tanpa Nama"} (NPM ${item.mahasiswa.npm})` : "Tamu")}
                    </span>
                  </div>
                  <div>
                    Dilaporkan pada: <span className="text-gray-500 font-semibold">{formatDate(item.createdAt)}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}