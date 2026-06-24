"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingGold from "../LoadingGold";

export default function BuatAspirasi() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  // State untuk menyimpan data inputan mahasiswa
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "",
    deskripsi: "",
    isAnonymous: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Periksa sesi login mahasiswa & status verifikasinya
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const result = await response.json();
        if (response.ok && result.success && result.user) {
          setUser(result.user);
        }
      } catch (err) {
        console.error("Gagal memeriksa sesi pelapor:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkUserSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Harap login terlebih dahulu!");
      return;
    }
    if (!user.isVerified) {
      alert("Akun Anda belum diverifikasi admin!");
      return;
    }
    
    try {
      // Mengirim data form asli ke API Route Handler Backend kita
      const response = await fetch("/api/aspirasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
      } else {
        alert("Gagal mengirim laporan: " + (result.error || result.message || "Kesalahan tidak diketahui"));
      }
    } catch (error) {
      console.error("Terjadi eror pengiriman:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Tombol Kembali ke Beranda */}
        <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-polinela-gold flex items-center mb-6 transition-colors">
          ← Kembali ke Beranda
        </Link>

        {/* Kotak Formulir */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-10">
          
          {checkingAuth ? (
            <LoadingGold text="Memeriksa status akun mahasiswa..." textColor="text-gray-500" />
          ) : !user ? (
            // Jika mahasiswa belum login
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚠️
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Harap Masuk Terlebih Dahulu</h2>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
                Untuk menjaga keabsahan pengaduan, sistem mengharuskan Anda memiliki akun mahasiswa Polinela yang aktif dan terverifikasi untuk menyampaikan aspirasi.
              </p>
              <Link 
                href="/login" 
                className="bg-polinela-gold hover:bg-amber-400 text-gray-900 font-extrabold px-6 py-3 rounded-xl transition text-sm inline-block shadow-sm"
              >
                Masuk / Daftar Akun
              </Link>
            </div>
          ) : !user.isVerified ? (
            // Jika mahasiswa login tapi KTM-nya belum diverifikasi admin
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ⏳
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Akun Menunggu Verifikasi KTM</h2>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
                Sesi masuk aktif untuk <strong className="text-gray-900">{user.nama || user.npm}</strong> (NPM {user.npm}). Namun, berkas foto KTM Anda sedang ditinjau oleh Admin Advokesma.
              </p>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-xs max-w-md mx-auto leading-relaxed">
                ℹ️ Anda akan menerima akses penuh untuk menyuarakan aspirasi segera setelah Admin menyetujui KTM Anda di sistem verifikasi. Silakan hubungi pengurus jika membutuhkan bantuan mendesak.
              </div>
            </div>
          ) : isSubmitted ? (
            // Jika aspirasi berhasil dikirim
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Aspirasi Berhasil Dikirim!</h2>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
                Terima kasih, sobat. Aspirasi Anda telah terrekam dengan aman di sistem Advokesma Polinela dan akan segera kami verifikasi.
              </p>
              <button 
                onClick={() => { setIsSubmitted(false); setFormData({ judul: "", kategori: "", deskripsi: "", isAnonymous: false }); }}
                className="bg-polinela-gold hover:bg-amber-400 text-gray-900 font-bold px-6 py-2.5 rounded-xl transition text-sm"
              >
                Buat Aspirasi Baru Lagi
              </button>
            </div>
          ) : (
            // Tampilan Utama Formulir
            <>
              <div className="mb-8">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Sampaikan Aspirasi Anda</h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Suara Anda sangat berharga untuk perbaikan fasilitas & sistem akademik di Politeknik Negeri Lampung.
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    ● NPM Terverifikasi
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Input Judul */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Judul Aspirasi / Keluhan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: AC Ruang Kuliah Gedung Baru Rusak"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-polinela-gold text-sm transition-colors"
                  />
                </div>

                {/* 2. Pilih Kategori */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                  <select
                    required
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-polinela-gold text-sm transition-colors"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    <option value="Fasilitas">Fasilitas Kampus</option>
                    <option value="Akademik">Sistem Akademik / Dosen</option>
                    <option value="UKT">Masalah UKT / Beasiswa</option>
                    <option value="Lainnya">Lain-lain</option>
                  </select>
                </div>

                {/* 3. Detail Deskripsi */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Lengkap</label>
                  <textarea
                    required
                    rows="5"
                    placeholder="Ceritakan kronologi atau detail keluhan Anda secara jelas..."
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-polinela-gold text-sm transition-colors resize-none"
                  ></textarea>
                </div>

                {/* 4. Fitur Anonim (Checkbox Toggle) */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    className="mt-1 h-4 w-4 text-polinela-gold focus:ring-polinela-gold border-gray-300 rounded transition"
                  />
                  <div className="text-sm">
                    <label htmlFor="anonymous" className="font-bold text-gray-800 cursor-pointer">Kirim sebagai Anonim</label>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Identitas asli Anda (Nama/NPM) tidak akan ditampilkan ke publik. Tim Advokesma tetap menjaga kerahasiaan Anda.
                    </p>
                  </div>
                </div>

                {/* 5. Tombol Submit */}
                <button
                  type="submit"
                  className="w-full bg-polinela-gold hover:bg-amber-400 text-gray-900 font-extrabold py-3.5 px-4 rounded-xl shadow-sm transition duration-300 text-sm mt-4 block text-center"
                >
                  Kirim Aspirasi Sekarang
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}