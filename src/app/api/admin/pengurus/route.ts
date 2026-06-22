import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/session";
import { promises as fs } from "fs";
import path from "path";

// PUT: Memperbarui data pengurus (Nama, Detail, Foto)
export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    const formData = await request.formData();
    const key = formData.get("key") as string | null;
    const nama = formData.get("nama") as string | null;
    const jabatan = formData.get("jabatan") as string | null;
    const detail = formData.get("detail") as string | null;
    const fotoFile = formData.get("fotoFile") as File | null;

    if (!key || !nama || !detail || !jabatan) {
      return NextResponse.json(
        { success: false, message: "Key, nama, jabatan, dan detail tugas wajib diisi!" },
        { status: 400 }
      );
    }

    // Cari pengurus yang bersangkutan
    const existing = await prisma.pengurus.findUnique({
      where: { key }
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: `Pengurus dengan key ${key} tidak ditemukan.` },
        { status: 404 }
      );
    }

    let fotoUrl = existing.fotoUrl;

    // Jika ada upload foto baru
    if (fotoFile && fotoFile.size > 0) {
      const file = fotoFile;
      // Validasi ukuran berkas foto pengurus (maksimal 2MB)
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "Ukuran foto pengurus maksimal adalah 2MB!" },
          { status: 400 }
        );
      }

      // Validasi tipe berkas foto pengurus (hanya gambar)
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: "Format berkas foto pengurus harus berupa gambar (JPG, JPEG, PNG, WEBP)!" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const originalExt = path.extname(file.name) || ".png";
      const filename = `pengurus_${key}_${Date.now()}${originalExt}`;
      const filepath = path.join(uploadDir, filename);

      await fs.writeFile(filepath, buffer);
      fotoUrl = `/uploads/${filename}`;
    }

    // Update data di DB
    const updated = await prisma.pengurus.update({
      where: { key },
      data: {
        nama,
        jabatan,
        detail,
        fotoUrl
      }
    });

    return NextResponse.json({
      success: true,
      message: `Data ${updated.jabatan} berhasil diperbarui!`,
      data: updated
    });
  } catch (error: any) {
    console.error("Admin Edit Pengurus Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui data pengurus." },
      { status: 500 }
    );
  }
}
