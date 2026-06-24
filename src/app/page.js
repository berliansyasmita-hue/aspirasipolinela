"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingGold from "./LoadingGold";

export default function Home() {
  const [beritaList, setBeritaList] = useState([]);
  const [loadingBerita, setLoadingBerita] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi Tipe Perangkat (Mobile vs Desktop)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Panggil saat pertama kali dimuat di sisi klien
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tarik data berita terbaru dari Supabase
  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const response = await fetch("/api/berita");
        const result = await response.json();
        if (response.ok && result.success) {
          setBeritaList(result.data || []);
        }
      } catch (error) {
        console.error("Gagal memuat berita:", error);
      } finally {
        setLoadingBerita(false);
      }
    };

    fetchBerita();
  }, []);

  // Format Tanggal
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
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col justify-between">
      
      {/* 1. HERO SECTION: GRADIENT DECORATION & DYNAMIC INFO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner text-center">
        {/* Dekorasi Cahaya Latar */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
          {/* Logo besar dinamis (Desktop & Mobile) */}
          <div className="mb-10 relative group">
            {/* Pendaran Cahaya Emas Tebal di Belakang Logo */}
            <div className="absolute inset-0 bg-amber-400/35 rounded-full blur-3xl scale-125 group-hover:bg-amber-400/50 transition-all duration-500"></div>
            <img 
              src="/logo.png" 
              alt="Logo Advokesma Polinela" 
              className="h-36 sm:h-56 md:h-64 w-auto object-contain drop-shadow-[0_15px_35px_rgba(255,199,44,0.65)] animate-float relative z-10"
            />
          </div>

          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs bg-amber-500/15 text-polinela-gold border border-amber-500/30 uppercase tracking-widest mb-6">
            &quot;Langkah berpijak pada hak, karsa bergerak menolak jarak.&quot;
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-6 text-white">
          HALAMAN RESMI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
          Advokasi dan Kesejahteraan Mahasiswa
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            &quot;Suarakan lelahmu di muara ini, biarkan suaramu yang mencari arah tak lagi merasa sendiri. Melalui portal resmi Advokesma BEM KBM Politeknik Negeri Lampung, kami merentangkan tangan merengkuh beban akademik mahasiswa dan menghidupkan kembali denyut di wadah juang. Temukan pula rekam jejak kami dalam lembaran warta terkini seputar Politeknik Negeri Lampung.&quot;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/buat-aspirasi"
              className="w-full sm:w-auto bg-polinela-gold hover:bg-amber-400 text-gray-950 font-extrabold px-8 py-4 rounded-2xl shadow-lg hover:shadow-amber-500/10 transform hover:-translate-y-0.5 transition-all text-base text-center"
            >
              Sampaikan Aspirasi Sekarang
            </Link>
            <Link
              href="/aspirasi"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-bold border border-white/20 px-8 py-4 rounded-2xl backdrop-blur-md transform hover:-translate-y-0.5 transition-all text-base text-center"
            >
              Lihat Daftar Aspirasi
            </Link>
          </div>
        </div>
      </section>

      {/* DEVICE-SPECIFIC WELCOME & SOCIAL QUICK LINKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className={`p-6 rounded-3xl border backdrop-blur-md shadow-sm transition-all duration-300 ${
          isMobile 
            ? "bg-emerald-500/5 border-emerald-500/10" 
            : "bg-sky-500/5 border-sky-500/10"
        }`}>
        </div>
      </section>

      {/* 2. TABEL BERITA TERBARU (DIKELOLA ADMIN DENGAN FOTO & NARASI) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Kabar & Berita Terbaru</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            Dapatkan informasi terpercaya mengenai penyelesaian masalah mahasiswa langsung dari tim Advokesma Polinela.
          </p>
        </div>

        {/* Keadaan Memuat Berita */}
        {loadingBerita ? (
          <LoadingGold text="Memuat berita terbaru dari server..." textColor="text-gray-400" />
        ) : beritaList.length === 0 ? (
          // Jika Berita Kosong
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              📰
            </div>
            <h4 className="text-gray-800 font-extrabold text-base mb-1">Belum Ada Kabar Berita</h4>
            <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
              Admin Advokesma belum menerbitkan berita terbaru untuk saat ini. Tetap pantau terus halaman ini untuk pembaruan berikutnya!
            </p>
          </div>
        ) : (
          // Grid Berita Terbaru (Dengan Foto Frame & Narasi)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beritaList.map((berita) => (
              <div 
                key={berita.id} 
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl hover-glow-gold flex flex-col group transition-all duration-300"
              >
                {/* Kerangka Foto Berita (Photo Frame) */}
                <div className="h-52 w-full overflow-hidden bg-slate-100 relative border-b border-gray-50">
                  <img 
                    src={berita.fotoUrl} 
                    alt={berita.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-sm">
                    <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest">Berita Resmi</span>
                  </div>
                </div>

                {/* Narasi & Konten */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4 bg-gradient-to-b from-white to-gray-50/20">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-widest mb-2">
                      Diterbitkan: {formatDate(berita.createdAt)}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-900 transition-colors">
                      {berita.judul}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-3 line-clamp-4">
                      {berita.narasi}
                    </p>
                  </div>
                  
                  {/* Read More Trigger Link/Modal (Optional mockup click) */}
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-blue-900 hover:text-blue-700 font-extrabold flex items-center gap-1 group-hover:underline cursor-pointer">
                      Baca Selengkapnya 
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <span className="text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100">
                      Oleh Admin Advokesma
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. WORKFLOW SECTION: BAGAIMANA INI BEKERJA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-gray-150">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Bagaimana Aspirasi Diproses?</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            Prosedur transparan Advokesma Polinela untuk memastikan setiap laporan Anda ditindaklanjuti secara profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {/* Garis penghubung proses dekoratif di desktop */}
          <div className="hidden md:block absolute top-10 left-16 right-16 h-0.5 bg-gradient-to-r from-blue-900 via-indigo-900/40 to-blue-900/10 -z-10"></div>

          {/* Step 1 */}
          <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm text-center md:text-left hover:shadow-lg transition-all duration-300 relative group">
            <span className="absolute -top-4 left-1/2 md:left-6 transform -translate-x-1/2 md:translate-x-0 w-9 h-9 bg-blue-900 text-white rounded-full flex items-center justify-center font-extrabold text-sm shadow-md group-hover:scale-110 transition-transform">
              1
            </span>
            <h4 className="font-extrabold text-gray-800 text-base mt-2 mb-2 group-hover:text-blue-900 transition-colors">Kirim Laporan</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Mahasiswa mengisi formulir aspirasi secara detail. Dapat memilih opsi anonim demi kenyamanan privasi.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm text-center md:text-left hover:shadow-lg transition-all duration-300 relative group">
            <span className="absolute -top-4 left-1/2 md:left-6 transform -translate-x-1/2 md:translate-x-0 w-9 h-9 bg-blue-900 text-white rounded-full flex items-center justify-center font-extrabold text-sm shadow-md group-hover:scale-110 transition-transform">
              2
            </span>
            <h4 className="font-extrabold text-gray-800 text-base mt-2 mb-2 group-hover:text-blue-900 transition-colors">Validasi Data</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Tim Advokesma memverifikasi kesesuaian berkas identitas (NPM/KTM) dan keaslian laporan keluhan.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm text-center md:text-left hover:shadow-lg transition-all duration-300 relative group">
            <span className="absolute -top-4 left-1/2 md:left-6 transform -translate-x-1/2 md:translate-x-0 w-9 h-9 bg-blue-900 text-white rounded-full flex items-center justify-center font-extrabold text-sm shadow-md group-hover:scale-110 transition-transform">
              3
            </span>
            <h4 className="font-extrabold text-gray-800 text-base mt-2 mb-2 group-hover:text-blue-900 transition-colors">Tindak Lanjut</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Advokesma berkoordinasi langsung dengan pihak Birokrasi, Dosen, atau Pengelola Sarana Polinela.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm text-center md:text-left hover:shadow-lg transition-all duration-300 relative group">
            <span className="absolute -top-4 left-1/2 md:left-6 transform -translate-x-1/2 md:translate-x-0 w-9 h-9 bg-blue-900 text-white rounded-full flex items-center justify-center font-extrabold text-sm shadow-md group-hover:scale-110 transition-transform">
              4
            </span>
            <h4 className="font-extrabold text-gray-800 text-base mt-2 mb-2 group-hover:text-blue-900 transition-colors">Selesai & Evaluasi</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Status diperbarui menjadi selesai dan mahasiswa dapat melihat hasil resolusi di portal secara transparan.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-center w-full">
        <div className="max-w-5xl mx-auto space-y-5">
          <p className="text-sm font-bold text-white">ADVOKESMA BEM KBM Politeknik Negeri Lampung</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Jl. Soekarno Hatta No.10, Rajabasa, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35141
          </p>
          
          {/* Tombol media sosial di footer */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 text-xs font-semibold border border-slate-700/50 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.513 5.35 1.515 5.548 0 10.061-4.512 10.064-10.062.002-2.69-1.047-5.216-2.953-7.124C17.202 1.674 14.68 0.622 12.01 0.622c-5.553 0-10.067 4.513-10.07 10.065-.001 2.12.553 4.189 1.606 5.992l-.997 3.646 3.734-.979a9.92 9.92 0 0 0 3.774.838zm11.396-7.731c-.307-.154-1.82-.899-2.102-1.002-.282-.102-.487-.154-.691.154-.204.307-.792.997-.971 1.202-.18.204-.359.228-.666.074-1.127-.565-1.957-1.022-2.738-2.36-.208-.358.208-.332.595-1.106.066-.134.033-.251-.017-.354-.05-.102-.487-1.173-.667-1.606-.176-.425-.37-.367-.506-.374-.131-.007-.282-.008-.433-.008-.151 0-.397.056-.604.28-.206.225-.788.77-.788 1.876 0 1.106.804 2.174.915 2.328.112.154 1.582 2.416 3.832 3.387 1.34.579 2.062.709 2.8.601.405-.06 1.82-.743 2.076-1.46.256-.718.256-1.332.18-1.46-.077-.128-.282-.204-.589-.358z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="https://instagram.com/advokesma_polinela"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 text-xs font-semibold border border-slate-700/50 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
              Instagram
            </a>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Advokesma Polinela. All rights reserved.
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION PANEL (ADAPTIVE FOR MOBILE & DESKTOP) */}
      <div className={`fixed z-50 transition-all duration-300 ${isMobile ? "bottom-4 left-4 right-4" : "bottom-6 right-6"}`}>
        {isMobile ? (
          /* Mobile layout: horizontal bar docked at the bottom */
          <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl px-4 py-3 flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">Advokesma Hub</span>
              <span className="text-[11px] text-white font-medium">Ada Kendala Akademik?</span>
            </div>
            <div className="flex gap-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.513 5.35 1.515 5.548 0 10.061-4.512 10.064-10.062.002-2.69-1.047-5.216-2.953-7.124C17.202 1.674 14.68 0.622 12.01 0.622c-5.553 0-10.067 4.513-10.07 10.065-.001 2.12.553 4.189 1.606 5.992l-.997 3.646 3.734-.979a9.92 9.92 0 0 0 3.774.838zm11.396-7.731c-.307-.154-1.82-.899-2.102-1.002-.282-.102-.487-.154-.691.154-.204.307-.792.997-.971 1.202-.18.204-.359.228-.666.074-1.127-.565-1.957-1.022-2.738-2.36-.208-.358.208-.332.595-1.106.066-.134.033-.251-.017-.354-.05-.102-.487-1.173-.667-1.606-.176-.425-.37-.367-.506-.374-.131-.007-.282-.008-.433-.008-.151 0-.397.056-.604.28-.206.225-.788.77-.788 1.876 0 1.106.804 2.174.915 2.328.112.154 1.582 2.416 3.832 3.387 1.34.579 2.062.709 2.8.601.405-.06 1.82-.743 2.076-1.46.256-.718.256-1.332.18-1.46-.077-.128-.282-.204-.589-.358z"/>
                </svg>
                WA
              </a>
              <a
                href="https://instagram.com/advokesma.polinela"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                IG
              </a>
            </div>
          </div>
        ) : (
          /* Desktop layout: floating vertical bar on the bottom right */
          <div className="flex flex-col gap-2.5 items-end">
            <div className="bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/10 shadow-lg animate-bounce">
              Respon Cepat Advokasi
            </div>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4.5 py-3 rounded-2xl shadow-xl hover:shadow-emerald-600/20 transform hover:-translate-y-1 transition-all duration-300 text-xs cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.513 5.35 1.515 5.548 0 10.061-4.512 10.064-10.062.002-2.69-1.047-5.216-2.953-7.124C17.202 1.674 14.68 0.622 12.01 0.622c-5.553 0-10.067 4.513-10.07 10.065-.001 2.12.553 4.189 1.606 5.992l-.997 3.646 3.734-.979a9.92 9.92 0 0 0 3.774.838zm11.396-7.731c-.307-.154-1.82-.899-2.102-1.002-.282-.102-.487-.154-.691.154-.204.307-.792.997-.971 1.202-.18.204-.359.228-.666.074-1.127-.565-1.957-1.022-2.738-2.36-.208-.358.208-.332.595-1.106.066-.134.033-.251-.017-.354-.05-.102-.487-1.173-.667-1.606-.176-.425-.37-.367-.506-.374-.131-.007-.282-.008-.433-.008-.151 0-.397.056-.604.28-.206.225-.788.77-.788 1.876 0 1.106.804 2.174.915 2.328.112.154 1.582 2.416 3.832 3.387 1.34.579 2.062.709 2.8.601.405-.06 1.82-.743 2.076-1.46.256-.718.256-1.332.18-1.46-.077-.128-.282-.204-.589-.358z"/>
              </svg>
              Hubungi via WhatsApp
            </a>
            <a
              href="https://instagram.com/advokesma.polinela"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-extrabold px-4.5 py-3 rounded-2xl shadow-xl hover:shadow-pink-600/20 transform hover:-translate-y-1 transition-all duration-300 text-xs cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
              Instagram Advokesma
            </a>
          </div>
        )}
      </div>

    </div>
  );
}