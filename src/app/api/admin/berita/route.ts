import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/session";
import { promises as fs } from "fs";
import path from "path";

// POST: Membuat Berita Baru
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    const formData = await request.formData();
    const judul = formData.get("judul") as string | null;
    const narasi = formData.get("narasi") as string | null;
    const fotoFile = formData.get("fotoFile") as File | null;

    if (!judul || !narasi || !fotoFile || fotoFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "Judul, narasi, dan foto berita wajib diisi!" },
        { status: 400 }
      );
    }

    // Validasi ukuran berkas foto berita (maksimal 5MB)
    if (fotoFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Ukuran foto berita maksimal adalah 5MB!" },
        { status: 400 }
      );
    }

    // Validasi tipe berkas foto berita (hanya gambar)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(fotoFile.type)) {
      return NextResponse.json(
        { success: false, message: "Format berkas foto berita harus berupa gambar (JPG, JPEG, PNG, WEBP)!" },
        { status: 400 }
      );
    }

    // Simpan foto berita ke public/uploads/
    const bytes = await fotoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const originalExt = path.extname(fotoFile.name) || ".png";
    const filename = `berita_${Date.now()}${originalExt}`;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);
    const fotoUrl = `/uploads/${filename}`;

    // Simpan di DB
    const newBerita = await prisma.berita.create({
      data: {
        judul,
        narasi,
        fotoUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berita baru berhasil diterbitkan!",
      data: newBerita,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Admin Create Berita Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memproses pembuatan berita." },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus Berita
export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID berita diperlukan." }, { status: 400 });
    }

    const deleted = await prisma.berita.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: `Berita "${deleted.judul}" berhasil dihapus!`,
    });
  } catch (error) {
    console.error("Admin Delete Berita Error:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus berita." }, { status: 500 });
  }
}
