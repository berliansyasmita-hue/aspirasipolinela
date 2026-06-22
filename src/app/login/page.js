"use client";
import { useState } from "react";
import Link from "next/link";

export default function Login({ defaultIsLoginView = true }) {
  // State untuk menentukan apakah layar sedang menampilkan 'login' or 'daftar'
  const [isLoginView, setIsLoginView] = useState(defaultIsLoginView);
  
  // State input data
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ktmFile, setKtmFile] = useState(null); // State baru untuk menyimpan file KTM
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginView) {
        // Melakukan Login ke API
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ npm, password }),
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          // Berhasil login, redirect ke beranda dengan reload agar Navbar terupdate
          window.location.href = "/";
        } else {
          alert("Gagal Masuk: " + (result.message || "Username atau password salah."));
        }
      } else {
        // Melakukan Registrasi ke API
        if (!nama.trim()) {
          alert("Nama lengkap wajib diisi!");
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          alert("Kata sandi dan konfirmasi kata sandi tidak cocok!");
          setIsLoading(false);
          return;
        }
        if (!ktmFile) {
          alert("Harap unggah foto KTM Anda terlebih dahulu!");
          setIsLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("nama", nama);
        formDataToSend.append("npm", npm);
        formDataToSend.append("password", password);
        formDataToSend.append("ktmFile", ktmFile);

        const response = await fetch("/api/auth/register", {
          method: "POST",
          body: formDataToSend,
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert("Pendaftaran berhasil! Akun Anda telah dibuat.");
          window.location.href = "/";
        } else {
          alert("Gagal Daftar: " + (result.message || "Terjadi kesalahan pendaftaran."));
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Tautan kecil untuk kembali ke Beranda utama website */}
      <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-polinela-gold mb-4 transition-colors">
        ← Kembali ke Beranda Utama
      </Link>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        
        {/* Header Form (Berubah dinamis sesuai pilihan) */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isLoginView ? "Selamat Datang" : "Daftar Akun Baru"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isLoginView 
              ? "Silakan masuk menggunakan akun yang telah anda daftarkan" 
              : "Gunakan NPM dan KTM yang sesuai agar terverifikasi admin untuk proses advokasi"}
          </p>
        </div>

        {/* Formulir Utama */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isLoginView ? (
            /* TAMPILAN LOGIN: Hanya NPM dan Password */
            <>
              {/* Input NPM */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">NPM (Nomor Pokok Mahasiswa)</label>
                <input
                  type="text"
                  required
                  maxLength="8"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="Contoh: 23753001"
                  value={npm}
                  onChange={(e) => setNpm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-polinela-gold text-sm tracking-wider"
                />
              </div>

              {/* Input Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-polinela-gold text-sm"
                />
              </div>
            </>
          ) : (
            /* TAMPILAN REGISTRASI: Urutannya Nama, NPM, Foto KTM, Password, Konfirmasi Password */
            <>
              {/* 1. Nama Lengkap */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mulyono"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-polinela-gold text-sm"
                />
              </div>

              {/* 2. NPM */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Pokok Mahasiswa Valid</label>
                <input
                  type="text"
                  required
                  maxLength="8"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder="Contoh: 23753001"
                  value={npm}
                  onChange={(e) => setNpm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-polinela-gold text-sm tracking-wider"
                />
              </div>

              {/* 3. Upload Foto KTM */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Unggah Foto KTM (Validasi Identitas)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-polinela-gold transition-colors bg-gray-50 cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="relative rounded-md font-medium text-blue-900 hover:underline">
                        {ktmFile ? ktmFile.name : "Pilih file gambar KTM"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">Format JPG, PNG, atau WEBP maksimal 5MB</p>
                  </div>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => setKtmFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Kata Sandi */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-polinela-gold text-sm"
                />
              </div>

              {/* 5. Konfirmasi Kata Sandi */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-polinela-gold text-sm"
                />
              </div>
            </>
          )}

          {/* Tombol Aksi Utama */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-polinela-gold hover:bg-amber-400 text-gray-900 font-extrabold py-3 px-4 rounded-xl shadow-sm transition duration-300 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>
              {isLoading 
                ? (isLoginView ? "Memproses Masuk..." : "Mendaftarkan Akun...") 
                : (isLoginView ? "Masuk ke Sistem" : "Daftar Akun Sekarang")}
            </span>
          </button>
        </form>

        {/* BAGIAN FOOTER: Tempat tombol beralih Masuk / Daftar */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100 text-sm text-gray-600">
          {isLoginView ? (
            <>
              Belum memiliki akun?{" "}
              <button
                type="button"
                onClick={() => { setIsLoginView(false); setNama(""); setNpm(""); setPassword(""); }}
                className="text-blue-900 font-bold hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
              >
                Daftar Akun
              </button>
            </>
          ) : (
            <>
              Sudah memiliki akun?{" "}
              <button
                type="button"
                onClick={() => { setIsLoginView(true); setNama(""); setNpm(""); setPassword(""); setConfirmPassword(""); setKtmFile(null); }}
                className="text-blue-900 font-bold hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
              >
                Masuk di Sini
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}