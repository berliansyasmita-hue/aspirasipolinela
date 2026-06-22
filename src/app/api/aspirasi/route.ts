import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getSession } from "../../../lib/session"
import DOMPurify from "isomorphic-dompurify"

// 1. GET: Menarik daftar aspirasi dari database Supabase
export async function GET() {
  try {
    const listAspirasi = await prisma.aspirasi.findMany({
      where: {
        isVisible: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        mahasiswa: {
          select: {
            npm: true,
            nama: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: listAspirasi,
    });
  } catch (error) {
    console.error("Gagal menarik data aspirasi:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menarik data dari database server." },
      { status: 500 }
    );
  }
}

// 2. POST: Menyimpan aspirasi baru ke database Supabase
export async function POST(request: Request) {
  try {
    // Ambil data kiriman dari formulir frontend
    const body = await request.json()
    const { judul, kategori, deskripsi, isAnonymous } = body

    // Validasi sederhana agar tidak ada data kosong yang masuk database
    if (!judul || !kategori || !deskripsi) {
      return NextResponse.json(
        { success: false, error: "Semua kolom wajib diisi, sobat!" },
        { status: 400 }
      )
    }

    // Sanitasi input menggunakan DOMPurify untuk mencegah serangan Stored XSS
    const sanitizedJudul = DOMPurify.sanitize(judul);
    const sanitizedDeskripsi = DOMPurify.sanitize(deskripsi);

    // Ambil sesi mahasiswa jika ada (jika sedang login)
    const session = await getSession();
    const mahasiswaId = session ? session.id : null;

    // Perintah Sakti: Masukkan data langsung ke tabel Aspirasi di Supabase
    const aspirasiBaru = await prisma.aspirasi.create({
      data: {
        judul: sanitizedJudul,
        kategori,
        deskripsi: sanitizedDeskripsi,
        isAnonymous: Boolean(isAnonymous),
        status: "Diproses", // Status awal default
        mahasiswaId: mahasiswaId, // Hubungkan dengan mahasiswa jika sedang login
      },
    })

    // Beri respon sukses ke frontend jika berhasil masuk database
    return NextResponse.json(
      { 
        success: true,
        message: "Aspirasi Anda berhasil disimpan di Supabase!", 
        data: aspirasiBaru 
      }, 
      { status: 201 }
    )

  } catch (error) {
    console.error("Eror Database:", error)
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data ke database server." },
      { status: 500 }
    )
  }
}
