import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/session";
import path from "path";
import { supabase } from "../../../../lib/supabase";

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

    // Simpan foto berita ke Supabase Storage (atau lokal sebagai fallback)
    let fotoUrl = "";
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("isi_");
    const originalExt = path.extname(fotoFile.name) || ".png";
    const filename = `berita_${Date.now()}${originalExt}`;

    if (isSupabaseConfigured) {
      const bytes = await fotoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("ktm-uploads")
        .upload(`berita/${filename}`, buffer, {
          contentType: fotoFile.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        return NextResponse.json(
          { success: false, message: "Gagal mengunggah foto berita ke Supabase Storage!" },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage.from("ktm-uploads").getPublicUrl(`berita/${filename}`);
      fotoUrl = publicUrlData.publicUrl;
    } else {
      // Fallback ke penyimpanan base64 data URL jika Supabase belum siap (untuk dev environment/deploy tanpa Supabase Storage)
      const bytes = await fotoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      fotoUrl = `data:${fotoFile.type};base64,${base64}`;
    }

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
