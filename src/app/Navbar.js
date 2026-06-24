"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // State ini berfungsi untuk membuka dan menutup menu pada layar HP
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Periksa status login pengguna saat pertama kali komponen di-render
  useEffect(() => {
    if (pathname && pathname.startsWith("/portal-advo")) {
      return;
    }
    const checkUserSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const result = await response.json();
        if (response.ok && result.success && result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Gagal memeriksa sesi pengguna:", error);
      }
    };

    checkUserSession();
  }, [pathname]);

  // Sembunyikan navbar jika sedang berada di portal admin
  if (pathname && pathname.startsWith("/portal-advo")) {
    return null;
  }

  // Handler untuk keluar dari sistem
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setUser(null);
        // Refresh penuh agar seluruh status state ter-reset dengan bersih
        window.location.href = "/";
      } else {
        alert("Gagal keluar dari sesi.");
      }
    } catch (error) {
      console.error("Gagal koneksi logout:", error);
      alert("Terjadi kesalahan koneksi saat keluar.");
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* SISI KIRI: LOGO & IDENTITAS WEBSITE */}
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Logo Advokesma Polinela" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                // Pengaman jika berkas logo.png belum dimasukkan ke folder public
                e.target.style.display = 'none';
              }}
            />
            <div>
              <span className="font-extrabold text-gray-900 text-base block leading-tight tracking-tight">
                ADVOKESMA
              </span>
              <span className="text-xs font-bold text-polinela-gold uppercase tracking-wider block">
                POLINELA
              </span>
            </div>
          </div>

          {/* SISI KANAN DESKTOP: MENU NAVIGASI UTAMA (Akan otomatis tersembunyi di layar HP) */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-gray-600">
            <Link href="/" className="hover:text-polinela-gold transition-colors text-sm">
              Beranda
            </Link>
            <Link href="/profil" className="hover:text-polinela-gold transition-colors text-sm">
              Profil Kementerian
            </Link>
            <Link href="/aspirasi" className="hover:text-polinela-gold transition-colors text-sm">
              Daftar Aspirasi
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-gray-700">
                  Halo, <span className="text-polinela-gold font-extrabold">{user.nama || user.npm}</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 hover:text-rose-700 px-4 py-2 rounded-xl transition-all text-sm font-bold cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="bg-white text-gray-700 border border-gray-200 hover:border-polinela-gold px-4 py-2 rounded-xl transition-all text-sm font-semibold">
                  Masuk
                </Link>
                <Link href="/register" className="bg-polinela-gold text-gray-900 hover:bg-amber-400 px-4 py-2 rounded-xl transition-all text-sm font-bold shadow-sm">
                  Daftar Akun
                </Link>
              </>
            )}
          </div>

          {/* SISI KANAN MOBILE: TOMBOL HAMBURGER MENU (Hanya muncul di HP/Tablet) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-polinela-gold focus:outline-none p-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  // Ikon tanda silang (X) saat menu terbuka
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Ikon garis tiga (Hamburger) saat menu tertutup
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* DROPDOWN MENU MOBILE: Hanya tampil di HP ketika tombol hamburger di-klik */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-polinela-gold font-medium py-2 text-sm transition-colors"
          >
            Beranda
          </Link>
          <Link 
            href="/profil" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-polinela-gold font-medium py-2 text-sm transition-colors"
          >
            Profil Kementerian
          </Link>
          <Link 
            href="/aspirasi" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-polinela-gold font-medium py-2 text-sm transition-colors"
          >
            Daftar Aspirasi
          </Link>
          
          {user ? (
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between px-2">
              <span className="text-sm font-semibold text-gray-700">
                Halo, <span className="text-polinela-gold font-extrabold">{user.nama || user.npm}</span>
              </span>
              <button 
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link 
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-gray-50 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-sm border border-gray-100"
              >
                Masuk
              </Link>
              <Link 
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-polinela-gold text-gray-900 font-bold px-4 py-2.5 rounded-xl text-sm shadow-sm"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}