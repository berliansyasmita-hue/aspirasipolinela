import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const pengurus = (prisma as any).pengurus;

const DEFAULT_PENGURUS = [
  {
    key: "menteri",
    nama: "Nama Lengkap Menteri",
    jabatan: "Menteri Advokesma",
    detail: "Bertanggung jawab memimpin jalannya kementerian, menentukan arah gerak strategis, mengoordinasikan seluruh kebijakan, serta menjadi representasi utama mahasiswa dalam negosiasi tingkat tinggi dengan birokrasi kampus.",
    fotoUrl: null
  },
  {
    key: "wamen1",
    nama: "Nama Lengkap Wamen 1",
    jabatan: "Wakil Menteri 1 (Advokasi & Kebijakan)",
    detail: "Mendampingi menteri dengan fokus pada pergerakan eksternal, mengawal isu-isu kebijakan kampus, serta memastikan setiap aspirasi mahasiswa dan kasus ketidakadilan tertangani hingga tuntas.",
    fotoUrl: null
  },
  {
    key: "wamen2",
    nama: "Nama Lengkap Wamen 2",
    jabatan: "Wakil Menteri 2 (Kesejahteraan & Informasi)",
    detail: "Mendampingi menteri dengan fokus pada ranah internal, pelayanan nyata, serta arus informasi. Bertanggung jawab memastikan distribusi informasi kesejahteraan berjalan masif dan tepat sasaran.",
    fotoUrl: null
  },
  {
    key: "staff1",
    nama: "Nama Staff Ahli 1",
    jabatan: "Staff Ahli Penyerapan Aspirasi & Pengaduan",
    detail: "Menjadi pintu pertama yang menampung keluhan mahasiswa, mengklasifikasikan masalah yang masuk, dan memastikan setiap laporan mendapatkan tindak lanjut dari kementerian.",
    fotoUrl: null
  },
  {
    key: "staff2",
    nama: "Nama Staff Ahli 2",
    jabatan: "Staff Ahli Kajian & Kebijakan Publik",
    detail: "Melakukan riset dan analisis data terhadap kebijakan birokrasi kampus dan menyusun draf tuntutan atau rekomendasi solusi yang logis.",
    fotoUrl: null
  },
  {
    key: "staff3",
    nama: "Nama Staff Ahli 3",
    jabatan: "Staff Ahli Aksi & Pendampingan Kasus",
    detail: "Menjadi mediator lapangan yang mendampingi mahasiswa secara langsung saat berhadapan dengan pihak fakultas atau rektorat untuk menyelesaikan kasus spesifik dan mendesak.",
    fotoUrl: null
  },
  {
    key: "staff4",
    nama: "Nama Staff Ahli 4",
    jabatan: "Staff Ahli Kesekretariatan & Keuangan (Sekretaris & Bendahara)",
    detail: "Mengelola administrasi kesekretariatan, pengarsipan surat-menyurat, serta mengatur sirkulasi keuangan internal kementerian agar seluruh operasional berjalan transparan, tertib, dan rapi.",
    fotoUrl: null
  },
  {
    key: "staff5",
    nama: "Nama Staff Ahli 5",
    jabatan: "Staff Ahli Kesejahteraan & Layanan Finansial Mahasiswa",
    detail: "Memantau kelayakan fasilitas kampus dan mengurus program kesejahteraan dasar mahasiswa. Secara khusus, bertugas penuh mengawal proses banding Uang Kuliah Tunggal (UKT) mahasiswa serta menginisiasi program-program beasiswa dari pihak kampus.",
    fotoUrl: null
  },
  {
    key: "staff6",
    nama: "Nama Staff Ahli 6",
    jabatan: "Staff Ahli Media & Sistem Informasi",
    detail: "Mengelola seluruh wajah digital kementerian. Bertanggung jawab atas pembaruan konten di Website, membuat publikasi visual di Instagram, serta menjadi operator utama layanan komunikasi WhatsApp agar mahasiswa mendapat informasi yang cepat dan akurat.",
    fotoUrl: null
  }
];

export async function GET() {
  try {
    // Cari data pengurus
    let list = await pengurus.findMany({
      orderBy: { id: "asc" }
    });

    // Jika kosong, lakukan inisialisasi awal (auto-seeding)
    if (list.length === 0) {
      await pengurus.createMany({
        data: DEFAULT_PENGURUS
      });
      // Ambil kembali data setelah dibuat
      list = await pengurus.findMany({
        orderBy: { id: "asc" }
      });
    }

    return NextResponse.json({
      success: true,
      data: list
    });
  } catch (error: any) {
    console.error("Fetch Pengurus Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data pengurus." },
      { status: 500 }
    );
  }
}
