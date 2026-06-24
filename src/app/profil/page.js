"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingGold from "../LoadingGold";

export default function ProfilKementerian() {
  // Active tab state: "about" | "logo" | "visi-misi" | "anggota"
  const [activeTab, setActiveTab] = useState("about");
  const [pengurusList, setPengurusList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data pengurus saat pertama kali dimuat
  useEffect(() => {
    const fetchPengurus = async () => {
      try {
        const response = await fetch("/api/pengurus");
        const result = await response.json();
        if (response.ok && result.success) {
          setPengurusList(result.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat data pengurus:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPengurus();
  }, []);

  const renderCard = (key, avatarPlaceholder) => {
    const member = pengurusList.find((p) => p.key === key);
    if (!member) return null;

    return (
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-6 text-center group hover:shadow-md hover:border-amber-400/20 transition-all duration-300 flex flex-col justify-between h-full">
        <div>
          <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-50 border-2 border-amber-400 mx-auto mb-4 relative shadow-inner flex items-center justify-center shrink-0">
            {member.fotoUrl ? (
              <img 
                src={member.fotoUrl} 
                alt={member.nama} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl text-slate-300 font-bold select-none">{avatarPlaceholder}</div>
            )}
          </div>
          <h4 className="font-extrabold text-gray-900 text-base">{member.nama}</h4>
          <p className="text-xs text-amber-600 font-bold tracking-wider mt-1.5 min-h-[1.5rem] flex items-center justify-center">{member.jabatan}</p>
        </div>
        <p className="text-gray-500 text-xs mt-4 leading-relaxed text-justify bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100 flex-grow">
          {member.detail}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Tombol Kembali ke Beranda */}
        <Link href="/" className="text-sm font-bold text-gray-500 hover:text-polinela-gold flex items-center mb-8 transition-colors gap-1">
          ← Kembali ke Beranda Utama
        </Link>

        {/* HEADER SECTION */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-widest mb-4">
            Profil Resmi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
            KEMENTERIAN <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-950">
              ADVOKASI & KESEJAHTERAAN MAHASISWA
            </span>
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Mengenal lebih dekat visi, misi, filosofi wadah perjuangan, serta jajaran pengurus Kementerian Advokesma BEM KBM Politeknik Negeri Lampung.
          </p>
        </div>

        {/* TABS CONTROLLER (TAB MENU INTERAKTIF) */}
        <div className="flex flex-wrap bg-white p-2 rounded-2xl border border-gray-150 shadow-sm gap-1.5 justify-center mb-10 max-w-3xl mx-auto">
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 min-w-[120px] py-3.5 text-center text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "about"
                ? "bg-slate-900 text-white shadow-md"
                : "text-gray-500 hover:text-slate-900 hover:bg-gray-50"
            }`}
          >
            Tentang Kami
          </button>
          <button
            onClick={() => setActiveTab("logo")}
            className={`flex-1 min-w-[120px] py-3.5 text-center text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "logo"
                ? "bg-slate-900 text-white shadow-md"
                : "text-gray-500 hover:text-slate-900 hover:bg-gray-50"
            }`}
          >
            Makna Logo
          </button>
          <button
            onClick={() => setActiveTab("visi-misi")}
            className={`flex-1 min-w-[120px] py-3.5 text-center text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "visi-misi"
                ? "bg-slate-900 text-white shadow-md"
                : "text-gray-500 hover:text-slate-900 hover:bg-gray-50"
            }`}
          >
            Visi & Misi
          </button>
          <button
            onClick={() => setActiveTab("anggota")}
            className={`flex-1 min-w-[120px] py-3.5 text-center text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === "anggota"
                ? "bg-slate-900 text-white shadow-md"
                : "text-gray-500 hover:text-slate-900 hover:bg-gray-50"
            }`}
          >
            Susunan Pengurus
          </button>
        </div>

        {/* TAB CONTENTS (RENDERED DYNAMICALLY) */}
        <div className="transition-all duration-300">
          
          {/* TAB 1: TENTANG ADVOKESMA */}
          {activeTab === "about" && (
            <div className="bg-white rounded-3xl border border-gray-150 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8 animate-fade-in">
              <div className="md:w-1/3 flex justify-center relative group">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl scale-110"></div>
                <img
                  src="/logo.png"
                  alt="Logo Advokesma"
                  className="h-44 sm:h-52 w-auto object-contain drop-shadow-[0_10px_20px_rgba(255,199,44,0.3)] relative z-10 animate-float"
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">Tentang Advokesma</h3>
                <div className="h-1 w-20 bg-polinela-gold rounded-full"></div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-justify">
                  Advokasi dan Kesejahteraan Mahasiswa (Advokesma) adalah wadah dedikatif yang berfokus pada pelayanan, pendampingan, serta pembelaan hak-hak mahasiswa. Kami hadir sebagai jembatan antara mahasiswa dan pihak birokrasi kampus untuk memastikan terciptanya lingkungan akademis yang adil, sejahtera, dan kondusif bagi seluruh elemen mahasiswa.
                </p>
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 text-xs sm:text-sm text-amber-800">
                  <span>💡</span>
                  <span><strong>Info Cepat:</strong> Anda bisa menyampaikan laporan permasalahan akademik, fasilitas, maupun UKT secara aman dan terverifikasi melalui fitur kirim aspirasi di halaman utama.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MAKNA LOGO */}
          {activeTab === "logo" && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/4 flex justify-center">
                  <img src="/logo.png" alt="Logo" className="h-32 w-auto object-contain drop-shadow-md" />
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Filosofi & Identitas Lambang</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    Logo Advokesma memiliki elemen-elemen visual kuat yang dipilih secara mendalam untuk merepresentasikan tegaknya pilar keadilan dan jaminan kesejahteraan mahasiswa di Politeknik Negeri Lampung.
                  </p>
                </div>
              </div>

              {/* Grid Elemen Logo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Timbangan Keadilan */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-400/30 transition-all duration-300 flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 font-bold text-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    ⚖️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">Timbangan Keadilan</h4>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1.5">
                      Melambangkan keseimbangan, keadilan, dan kesetaraan. Ini menunjukkan komitmen Advokesma untuk selalu bersikap objektif dan adil dalam memperjuangkan hak-hak mahasiswa tanpa pandang bulu.
                    </p>
                  </div>
                </div>

                {/* 2. Pedang yang Menjulang */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-400/30 transition-all duration-300 flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 font-bold text-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    🗡️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">Pedang yang Menjulang</h4>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1.5">
                      Merupakan representasi dari keberanian, ketegasan, dan pelindung. Pedang ini bermakna bahwa Advokesma siap menjadi garda terdepan yang tangguh dalam membela dan mengadvokasi permasalahan mahasiswa.
                    </p>
                  </div>
                </div>

                {/* 3. Daun Laurel Melingkar */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-400/30 transition-all duration-300 flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 font-bold text-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    🌿
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">Untaian Daun Laurel</h4>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1.5">
                      Simbol universal untuk pencapaian, kejayaan, dan kemakmuran (padi/gandum). Dalam konteks ini, elemen ini melambangkan tujuan utama Advokesma, yaitu mewujudkan kesejahteraan bagi seluruh mahasiswa.
                    </p>
                  </div>
                </div>

                {/* 4. Tumpukan Buku */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-400/30 transition-all duration-300 flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 font-bold text-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    📚
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">Tumpukan Buku</h4>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1.5">
                      Merepresentasikan pondasi ilmu pengetahuan, kebijaksanaan, dan identitas mahasiswa sebagai insan akademis. Segala bentuk advokasi selalu dilandasi oleh kajian, data, dan pemikiran yang rasional.
                    </p>
                  </div>
                </div>

                {/* 5. Tunas Dinamis */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-400/30 transition-all duration-300 flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 font-bold text-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    🌱
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">Siluet Tunas Dinamis</h4>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1.5">
                      Terletak di sisi pedang melambangkan mahasiswa itu sendiri yang dinamis, terus bertumbuh, dan memiliki semangat yang membara menyala untuk terus berprogres ke arah lebih baik.
                    </p>
                  </div>
                </div>

                {/* 6. Warna Emas */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-400/30 transition-all duration-300 flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 font-bold text-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    👑
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">Warna Emas (Gold)</h4>
                    <p className="text-gray-500 text-xs leading-relaxed mt-1.5">
                      Menyimbolkan kebijaksanaan luhur, kualitas pelayanan yang prima (eksellensi), dan kemuliaan tujuan akhir dari departemen pelayanan mahasiswa ini.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: VISI & MISI */}
          {activeTab === "visi-misi" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              {/* Box Visi */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl border border-white/5 shadow-md flex flex-col justify-center">
                <span className="text-polinela-gold text-xs font-bold uppercase tracking-widest mb-3">Visi Utama</span>
                <h3 className="text-2xl font-black tracking-tight leading-snug mb-4">Visi Advokesma</h3>
                <div className="h-1 w-14 bg-polinela-gold mb-6 rounded-full"></div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic text-left">
                  &quot;Mewujudkan Advokesma sebagai garda terdepan yang responsif, inklusif, dan solutif dalam menjamin terpenuhinya hak serta kesejahteraan mahasiswa.&quot;
                </p>
              </div>

              {/* Box Misi */}
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
                <div>
                  <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest block mb-1">Misi Strategis</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-950">Misi Advokesma</h3>
                </div>
                <div className="space-y-4">
                  {/* Misi 1 */}
                  <div className="flex gap-4 items-start text-sm sm:text-base">
                    <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-900 shrink-0">1</span>
                    <p className="text-gray-600 leading-relaxed pt-0.5">
                      Membangun sistem pelayanan advokasi yang cepat tanggap dan mudah diakses oleh seluruh mahasiswa.
                    </p>
                  </div>

                  {/* Misi 2 */}
                  <div className="flex gap-4 items-start text-sm sm:text-base">
                    <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-900 shrink-0">2</span>
                    <p className="text-gray-600 leading-relaxed pt-0.5">
                      Menjadi fasilitator yang proaktif antara mahasiswa dan birokrasi kampus.
                    </p>
                  </div>

                  {/* Misi 3 */}
                  <div className="flex gap-4 items-start text-sm sm:text-base">
                    <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-900 shrink-0">3</span>
                    <p className="text-gray-600 leading-relaxed pt-0.5">
                      Mengawal dan mengkaji kebijakan kampus yang berdampak langsung pada kesejahteraan mahasiswa.
                    </p>
                  </div>

                  {/* Misi 4 */}
                  <div className="flex gap-4 items-start text-sm sm:text-base">
                    <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-900 shrink-0">4</span>
                    <p className="text-gray-600 leading-relaxed pt-0.5">
                      Menyediakan informasi terkait beasiswa, fasilitas, dan bantuan finansial.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STRUKTUR PENGURUS */}
          {activeTab === "anggota" && (
            <div className="space-y-12 animate-fade-in">
              {loading ? (
                <LoadingGold text="Memuat data pengurus..." textColor="text-gray-500" />
              ) : (
                <>
                  {/* Jajaran Pimpinan */}
                  <div>
                    <div className="text-center max-w-lg mx-auto mb-10">
                      <h3 className="text-2xl font-black text-gray-950">Jajaran Pengurus Kementerian Advokesma BEM KBM Politeknik Negeri Lampung</h3>
                      <div className="h-1 w-14 bg-amber-400 mx-auto mt-3 rounded-full"></div>
                    </div>

                    {/* Menteri (Centered) */}
                    <div className="max-w-md mx-auto mb-10">
                      {renderCard("menteri", "👨‍💼")}
                    </div>

                    {/* Wakil Menteri 1 & 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                      {renderCard("wamen1", "👩‍💼")}
                      {renderCard("wamen2", "👨‍💼")}
                    </div>
                  </div>

                  {/* Bidang 1: Advokasi & Aspirasi */}
                  <div className="pt-10 border-t border-gray-150">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                      <h3 className="text-xl font-bold text-gray-950">🏛️ Bidang 1: Advokasi & Aspirasi</h3>
                      <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-1">Di bawah Koordinasi Wakil Menteri 1</p>
                      <p className="text-xs text-gray-500 mt-1">Berfokus pada penyerapan suara mahasiswa, kajian regulasi kampus, dan pendampingan kasus nyata.</p>
                      <div className="h-0.5 w-10 bg-indigo-500 mx-auto mt-3 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {renderCard("staff1", "👤")}
                      {renderCard("staff2", "👤")}
                      {renderCard("staff3", "👤")}
                    </div>
                  </div>

                  {/* Bidang 2: Kesejahteraan & Informasi */}
                  <div className="pt-10 border-t border-gray-150">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                      <h3 className="text-xl font-bold text-gray-950">🤝 Bidang 2: Kesejahteraan & Informasi</h3>
                      <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-1">Di bawah Koordinasi Wakil Menteri 2</p>
                      <p className="text-xs text-gray-500 mt-1">Berfokus pada administrasi internal, layanan dasar finansial/UKT, dan pengelolaan media digital.</p>
                      <div className="h-0.5 w-10 bg-indigo-500 mx-auto mt-3 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {renderCard("staff4", "👤")}
                      {renderCard("staff5", "👤")}
                      {renderCard("staff6", "👤")}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
