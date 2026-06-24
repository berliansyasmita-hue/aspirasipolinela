"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingGold from "../LoadingGold";

export default function AdminDashboard() {
  // Authentication states
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  // Active tab state: "mahasiswa" | "aspirasi" | "berita"
  const [activeTab, setActiveTab] = useState("mahasiswa");

  // Data states
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [aspirasiList, setAspirasiList] = useState([]);
  const [beritaList, setBeritaList] = useState([]);
  
  // Loading and error states
  const [loadingData, setLoadingData] = useState(false);
  
  // Image preview modal state
  const [previewImage, setPreviewImage] = useState(null);

  // States for pengurus management
  const [pengurusList, setPengurusList] = useState([]);
  const [editingPengurus, setEditingPengurus] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editJabatan, setEditJabatan] = useState("");
  const [editDetail, setEditDetail] = useState("");
  const [editFotoFile, setEditFotoFile] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const startEditPengurus = (member) => {
    setEditingPengurus(member);
    setEditNama(member.nama);
    setEditJabatan(member.jabatan);
    setEditDetail(member.detail);
    setEditFotoFile(null);
  };

  const handleUpdatePengurus = async (e) => {
    e.preventDefault();
    if (!editingPengurus) return;
    setEditSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("key", editingPengurus.key);
      formData.append("nama", editNama);
      formData.append("jabatan", editJabatan);
      formData.append("detail", editDetail);
      if (editFotoFile) {
        formData.append("fotoFile", editFotoFile);
      }

      const response = await fetch("/api/admin/pengurus", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert("Data pengurus berhasil diperbarui!");
        setEditingPengurus(null);
        fetchTabContent("pengurus");
      } else {
        alert("Gagal memperbarui: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Form states for creating news
  const [newsTitle, setNewsTitle] = useState("");
  const [newsNarration, setNewsNarration] = useState("");
  const [newsFile, setNewsFile] = useState(null);
  const [newsSubmitting, setNewsSubmitting] = useState(false);

  // 1. Verifikasi Sesi Admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/me");
        const result = await response.json();
        if (response.ok && result.success && result.admin) {
          setAdminUser(result.admin);
          setCheckingAuth(false);
          // Mulai ambil data awal
          fetchTabContent("mahasiswa");
        } else {
          window.location.href = "/portal-advo/masuk";
        }
      } catch (err) {
        console.error(err);
        window.location.href = "/portal-advo/masuk";
      }
    };
    checkAuth();
  }, []);

  // 2. Fetch data based on active tab
  async function fetchTabContent(tab) {
    setLoadingData(true);
    try {
      if (tab === "mahasiswa") {
        const res = await fetch("/api/admin/mahasiswa");
        const json = await res.json();
        if (res.ok && json.success) setMahasiswaList(json.data || []);
      } else if (tab === "aspirasi") {
        const res = await fetch("/api/admin/aspirasi");
        const json = await res.json();
        if (res.ok && json.success) setAspirasiList(json.data || []);
      } else if (tab === "berita") {
        const res = await fetch("/api/berita"); // Endpoint public bisa digunakan
        const json = await res.json();
        if (res.ok && json.success) setBeritaList(json.data || []);
      } else if (tab === "pengurus") {
        const res = await fetch("/api/pengurus");
        const json = await res.json();
        if (res.ok && json.success) setPengurusList(json.data || []);
      }
    } catch (error) {
      console.error(`Gagal menarik data untuk tab ${tab}:`, error);
    } finally {
      setLoadingData(false);
    }
  }

  // Ubah tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchTabContent(tab);
  };

  // 3. Aksi Mahasiswa: Verifikasi / Tolak
  const handleVerifyMahasiswa = async (id, currentStatus) => {
    try {
      const response = await fetch("/api/admin/mahasiswa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVerified: !currentStatus }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert(result.message);
        // Refresh daftar
        fetchTabContent("mahasiswa");
      } else {
        alert("Gagal memperbarui verifikasi: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Kesalahan koneksi ke server.");
    }
  };

  const handleDeleteMahasiswa = async (id, npm) => {
    if (!confirm(`Apakah Anda yakin ingin menolak & menghapus akun mahasiswa NPM ${npm}?`)) return;
    try {
      const response = await fetch(`/api/admin/mahasiswa?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert(result.message);
        fetchTabContent("mahasiswa");
      } else {
        alert("Gagal menghapus mahasiswa: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Kesalahan koneksi.");
    }
  };

  // 4. Aksi Aspirasi: Perlihatkan / Sembunyikan, Ubah Status, Hapus
  const handleToggleAspirasiVisibility = async (id, currentVisibility) => {
    try {
      const response = await fetch("/api/admin/aspirasi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVisible: !currentVisibility }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        // Refresh data
        fetchTabContent("aspirasi");
      } else {
        alert("Gagal memperbarui visibilitas: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAspirasiStatus = async (id, newStatus) => {
    try {
      const response = await fetch("/api/admin/aspirasi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchTabContent("aspirasi");
      } else {
        alert("Gagal memperbarui status: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAspirasi = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus keluhan/aspirasi ini secara permanen dari database?")) return;
    try {
      const response = await fetch(`/api/admin/aspirasi?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert(result.message);
        fetchTabContent("aspirasi");
      } else {
        alert("Gagal menghapus aspirasi: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Aksi Berita: Kirim Baru & Hapus
  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (!newsTitle || !newsNarration || !newsFile) {
      alert("Harap lengkapi semua kolom!");
      return;
    }
    setNewsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("judul", newsTitle);
      formData.append("narasi", newsNarration);
      formData.append("fotoFile", newsFile);

      const response = await fetch("/api/admin/berita", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert("Berita baru berhasil diterbitkan!");
        setNewsTitle("");
        setNewsNarration("");
        setNewsFile(null);
        // Reset file input element
        document.getElementById("news-file-input").value = "";
        fetchTabContent("berita");
      } else {
        alert("Gagal membuat berita: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setNewsSubmitting(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini secara permanen?")) return;
    try {
      const response = await fetch(`/api/admin/berita?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert(result.message);
        fetchTabContent("berita");
      } else {
        alert("Gagal menghapus berita: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Admin Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });
      const result = await response.json();
      if (response.ok && result.success) {
        window.location.href = "/portal-advo/masuk";
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Format Tanggal
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }) + " WIB";
    } catch (e) {
      return dateString;
    }
  };

  if (checkingAuth) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <LoadingGold text="Memeriksa hak akses admin..." textColor="text-slate-400" />
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col justify-between">
      
      {/* HEADER BAR DASHBOARD */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 sm:px-10 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-polinela-gold text-slate-950 rounded-xl flex items-center justify-center font-black text-lg">
            A
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">ADVOKESMA ADMIN</h1>
            <p className="text-xs text-slate-400">Masuk sebagai: <span className="text-amber-400 font-semibold">{adminUser?.username}</span></p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            Lihat Laman Publik
          </Link>
          <button 
            onClick={handleLogout}
            className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Keluar Panel
          </button>
        </div>
      </header>

      {/* INNER DASHBOARD LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* TABS SELECTOR */}
        <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border border-slate-800 max-w-2xl mb-8 gap-1">
          <button
            onClick={() => handleTabChange("mahasiswa")}
            className={`flex-1 py-3 px-2 text-center text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "mahasiswa" 
                ? "bg-polinela-gold text-slate-950 shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Verifikasi KTM ({mahasiswaList.length})
          </button>
          <button
            onClick={() => handleTabChange("aspirasi")}
            className={`flex-1 py-3 px-2 text-center text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "aspirasi" 
                ? "bg-polinela-gold text-slate-950 shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Moderasi Aspirasi ({aspirasiList.length})
          </button>
          <button
            onClick={() => handleTabChange("berita")}
            className={`flex-1 py-3 px-2 text-center text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "berita" 
                ? "bg-polinela-gold text-slate-950 shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Kelola Berita ({beritaList.length})
          </button>
          <button
            onClick={() => handleTabChange("pengurus")}
            className={`flex-1 py-3 px-2 text-center text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "pengurus" 
                ? "bg-polinela-gold text-slate-950 shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Kelola Pengurus ({pengurusList.length})
          </button>
        </div>

        {/* LOADING INDICATOR FOR TAB DATA */}
        {loadingData ? (
          <LoadingGold text="Menarik data terbaru dari Supabase..." textColor="text-slate-500" />
        ) : (
          <div className="space-y-6">
            
            {/* ============================================================== */}
            {/* TAB 1: VERIFIKASI MAHASISWA                                    */}
            {/* ============================================================== */}
            {activeTab === "mahasiswa" && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Verifikasi Akun KTM Mahasiswa</h3>
                
                {mahasiswaList.length === 0 ? (
                  <p className="text-slate-400 text-sm py-10 text-center">Belum ada data pendaftaran mahasiswa di database.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs text-slate-400 font-bold uppercase">
                          <th className="py-3 px-4">Tanggal Daftar</th>
                          <th className="py-3 px-4">Nama Lengkap</th>
                          <th className="py-3 px-4">NPM Mahasiswa</th>
                          <th className="py-3 px-4">Foto KTM</th>
                          <th className="py-3 px-4">Status Sesi</th>
                          <th className="py-3 px-4 text-right">Aksi Tindak Lanjut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                        {mahasiswaList.map((mhs) => (
                          <tr key={mhs.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-4 px-4 text-xs">{formatDateTime(mhs.createdAt)}</td>
                            <td className="py-4 px-4 font-semibold">{mhs.nama || "-"}</td>
                            <td className="py-4 px-4 font-extrabold tracking-wider">{mhs.npm}</td>
                            <td className="py-4 px-4">
                              <img 
                                src={mhs.fotoKtmUrl} 
                                alt="KTM" 
                                className="h-10 w-16 object-cover rounded-md border border-slate-700 hover:scale-105 transition-transform cursor-zoom-in"
                                onClick={() => setPreviewImage(mhs.fotoKtmUrl)}
                              />
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                mhs.isVerified 
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" 
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/25 animate-pulse"
                              }`}>
                                {mhs.isVerified ? "Terverifikasi" : "Pending"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <button
                                onClick={() => handleVerifyMahasiswa(mhs.id, mhs.isVerified)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  mhs.isVerified 
                                    ? "bg-slate-800 hover:bg-amber-500/10 hover:text-amber-400 text-slate-400" 
                                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                                }`}
                              >
                                {mhs.isVerified ? "Batalkan Verifikasi" : "Verifikasi KTM"}
                              </button>
                              <button
                                onClick={() => handleDeleteMahasiswa(mhs.id, mhs.npm)}
                                className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                Tolak & Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: MODERASI ASPIRASI                                       */}
            {/* ============================================================== */}
            {activeTab === "aspirasi" && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
                <h3 className="text-lg font-bold text-white">Moderasi Pengaduan & Keluhan Mahasiswa</h3>

                {aspirasiList.length === 0 ? (
                  <p className="text-slate-400 text-sm py-10 text-center">Belum ada aspirasi yang dikirim mahasiswa.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {aspirasiList.map((asp) => (
                      <div key={asp.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between gap-6 hover:border-slate-700 transition-colors">
                        
                        {/* Detail Keluhan */}
                        <div className="space-y-3 flex-grow max-w-3xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                              {asp.kategori}
                            </span>
                            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                              asp.status === "Selesai" 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                                : asp.status === "Ditolak"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/25"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                            }`}>
                              • {asp.status}
                            </span>
                            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                              asp.isVisible 
                                ? "bg-purple-500/10 text-purple-400 border border-purple-500/25" 
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              {asp.isVisible ? "👁 Publik" : "🔒 Tersembunyi"}
                            </span>
                          </div>

                          <h4 className="text-base font-extrabold text-white">{asp.judul}</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{asp.deskripsi}</p>
                          
                          <div className="text-xs text-slate-500 font-medium pt-2 border-t border-slate-900 flex flex-wrap gap-4">
                            <span>Pelapor: <strong className="text-slate-300">{asp.isAnonymous ? `Anonim (Oleh: ${asp.mahasiswa ? `${asp.mahasiswa.nama || "Tanpa Nama"} - NPM ${asp.mahasiswa.npm}` : "Tamu"})` : (asp.mahasiswa ? `${asp.mahasiswa.nama || "Tanpa Nama"} (NPM ${asp.mahasiswa.npm})` : "Tamu")}</strong></span>
                            <span>Dikirim: <strong className="text-slate-300">{formatDateTime(asp.createdAt)}</strong></span>
                          </div>
                        </div>

                        {/* Panel Aksi Moderasi */}
                        <div className="flex flex-row md:flex-col justify-end items-end gap-3 flex-wrap md:flex-nowrap border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                          
                          {/* 1. Toggle Tampilkan / Sembunyikan */}
                          <button
                            onClick={() => handleToggleAspirasiVisibility(asp.id, asp.isVisible)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all w-full text-center cursor-pointer ${
                              asp.isVisible 
                                ? "bg-slate-800 text-slate-300 hover:bg-slate-700" 
                                : "bg-purple-600 hover:bg-purple-500 text-white"
                            }`}
                          >
                            {asp.isVisible ? "Sembunyikan Publik" : "Perlihatkan Aspirasi"}
                          </button>

                          {/* 2. Ubah Status Keluhan */}
                          <div className="flex gap-1 w-full">
                            <button
                              onClick={() => handleUpdateAspirasiStatus(asp.id, "Diproses")}
                              className="flex-1 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/20 py-1.5 rounded-lg text-[10px] font-black cursor-pointer"
                            >
                              Proses
                            </button>
                            <button
                              onClick={() => handleUpdateAspirasiStatus(asp.id, "Selesai")}
                              className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/20 py-1.5 rounded-lg text-[10px] font-black cursor-pointer"
                            >
                              Selesai
                            </button>
                            <button
                              onClick={() => handleUpdateAspirasiStatus(asp.id, "Ditolak")}
                              className="flex-1 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 py-1.5 rounded-lg text-[10px] font-black cursor-pointer"
                            >
                              Tolak
                            </button>
                          </div>

                          {/* 3. Tombol Hapus Keluhan */}
                          <button
                            onClick={() => handleDeleteAspirasi(asp.id)}
                            className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all w-full text-center mt-2 cursor-pointer"
                          >
                            Hapus Aspirasi
                          </button>

                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: KELOLA BERITA                                           */}
            {/* ============================================================== */}
            {activeTab === "berita" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 3A. Formulir Tulis Berita Baru */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 h-fit space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Tulis Berita Baru</h3>
                  
                  <form onSubmit={handleCreateNews} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Judul Berita</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Advokesma Melakukan audiensi UKT"
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-polinela-gold text-sm text-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Narasi Lengkap</label>
                      <textarea
                        required
                        rows="5"
                        placeholder="Ketik detail isi informasi berita/narasi di sini..."
                        value={newsNarration}
                        onChange={(e) => setNewsNarration(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-polinela-gold text-sm text-white transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kerangka Foto Berita</label>
                      <input
                        type="file"
                        id="news-file-input"
                        required
                        accept="image/*"
                        onChange={(e) => setNewsFile(e.target.files[0])}
                        className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-950 file:text-polinela-gold hover:file:bg-slate-850 cursor-pointer"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={newsSubmitting}
                      className="w-full bg-polinela-gold hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2"
                    >
                      {newsSubmitting && (
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span>{newsSubmitting ? "Menerbitkan..." : "Terbitkan Berita"}</span>
                    </button>
                  </form>
                </div>

                {/* 3B. Daftar Berita yang Sudah Ada */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Daftar Berita Aktif</h3>

                  {beritaList.length === 0 ? (
                    <p className="text-slate-400 text-sm py-10 text-center">Belum ada berita yang diterbitkan admin.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {beritaList.map((berita) => (
                        <div key={berita.id} className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group">
                          
                          {/* Image Box */}
                          <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                            <img 
                              src={berita.fotoUrl} 
                              alt={berita.judul}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 to-transparent p-4 pt-10">
                              <span className="text-[10px] text-slate-400 font-medium">{formatDateTime(berita.createdAt)}</span>
                            </div>
                          </div>

                          {/* Detail Box */}
                          <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                            <div>
                              <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-2">{berita.judul}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-3">{berita.narasi}</p>
                            </div>
                            
                            <button
                              onClick={() => handleDeleteNews(berita.id)}
                              className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 py-2 rounded-xl text-xs font-bold transition-all w-full text-center cursor-pointer"
                            >
                              Hapus Berita
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: KELOLA PENGURUS                                         */}
            {/* ============================================================== */}
            {activeTab === "pengurus" && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Kelola Susunan Pengurus</h3>
                    <p className="text-xs text-slate-400 mt-1">Ubah nama, detail tugas, dan unggah foto jajaran pimpinan serta staff ahli kementerian secara dinamis.</p>
                  </div>
                </div>

                {pengurusList.length === 0 ? (
                  <p className="text-slate-400 text-sm py-10 text-center">Belum ada data pengurus di database.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pengurusList.map((member) => (
                      <div key={member.key} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                        <div>
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                              {member.fotoUrl ? (
                                <img src={member.fotoUrl} alt={member.nama} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl select-none">👤</span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-white text-sm line-clamp-1">{member.nama}</h4>
                              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-0.5">{member.jabatan}</p>
                              <span className="text-[9px] bg-slate-900/60 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-800/80 mt-1.5 inline-block font-mono">
                                Key: {member.key}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed text-justify line-clamp-3 bg-slate-900/60 p-3 rounded-xl border border-slate-900 mb-4">
                            {member.detail}
                          </p>
                        </div>
                        <button
                          onClick={() => startEditPengurus(member)}
                          className="bg-polinela-gold hover:bg-amber-400 text-slate-950 py-2.5 rounded-xl text-xs font-black transition-all w-full text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          ✏️ Edit Anggota
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* 7. MODAL LIGHTBOX FOTO KTM */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-3xl w-full max-h-[85vh] relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-2 animate-zoomIn">
            <img 
              src={previewImage} 
              alt="Preview KTM Berkas" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/75 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 8. MODAL EDIT PENGURUS */}
      {editingPengurus && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-2xl animate-zoomIn space-y-6">
            <div className="border-b border-slate-850 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-white">Edit Susunan Pengurus</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Key: <span className="text-amber-400 font-mono font-bold">{editingPengurus.key}</span></p>
              </div>
              <button 
                onClick={() => setEditingPengurus(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePengurus} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nama Lengkap Anggota</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap pengurus..."
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-polinela-gold text-xs text-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Nama Jabatan / Posisi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Menteri Advokesma..."
                  value={editJabatan}
                  onChange={(e) => setEditJabatan(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-polinela-gold text-xs text-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Fokus Tugas / Detail Peran</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Ketik detail tugas atau peran khusus..."
                  value={editDetail}
                  onChange={(e) => setEditDetail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-polinela-gold text-xs text-white transition-colors resize-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Ganti Foto Profil</label>
                
                {/* Current Photo preview inside modal */}
                <div className="flex items-center gap-4 mb-3 p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                    {editingPengurus.fotoUrl ? (
                      <img src={editingPengurus.fotoUrl} alt="Current" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {editingPengurus.fotoUrl ? "Ada foto profil saat ini." : "Belum ada foto profil."}
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFotoFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-slate-950 file:text-polinela-gold hover:file:bg-slate-850 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPengurus(null)}
                  className="flex-1 bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-800 py-3 rounded-xl transition duration-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="flex-1 bg-polinela-gold hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition duration-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {editSubmitting && (
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>{editSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 w-full mt-10">
        Panel Admin Advokesma Polinela &copy; {new Date().getFullYear()}
      </footer>

    </div>
  );
}
