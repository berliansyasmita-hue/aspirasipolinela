"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect to admin dashboard
        window.location.href = "/portal-advo";
      } else {
        alert("Gagal masuk admin: " + (result.message || "Username atau password salah."));
      }
    } catch (error) {
      console.error("Admin Login Error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-polinela-gold mb-6 transition-colors z-10">
        ← Kembali ke Beranda Utama
      </Link>

      <div className="max-w-md w-full bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-8 relative z-10">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-polinela-gold uppercase tracking-wider rounded-full mb-3">
            Admin Portal
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">Advokesma Admin</h2>
          <p className="text-sm text-slate-400 mt-1">
            Masuk untuk mengelola keluhan, mahasiswa, dan berita
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Username Admin</label>
            <input
              type="text"
              required
              placeholder="Contoh: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-polinela-gold text-sm text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Kata Sandi</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-polinela-gold text-sm text-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-polinela-gold hover:bg-amber-400 text-gray-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isLoading ? "Memverifikasi..." : "Masuk Panel Admin"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
