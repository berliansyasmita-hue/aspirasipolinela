import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { promises as fs } from "fs";
import path from "path";
import { setSession } from "../../../../lib/session";
import { supabase } from "../../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nama = formData.get("nama") as string | null;
    const npm = formData.get("npm") as string | null;
    const password = formData.get("password") as string | null;
    const ktmFile = formData.get("ktmFile") as File | null;

    if (!nama || !npm || !password || !ktmFile || ktmFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "Semua data pendaftaran wajib diisi termasuk nama dan foto KTM!" },
        { status: 400 }
      );
    }

    // 1. Validasi ukuran berkas KTM (Maksimal 2MB sesuai anjuran keamanan)
    if (ktmFile.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Ukuran foto KTM maksimal adalah 2MB!" },
        { status: 400 }
      );
    }

    // 2. Validasi tipe MIME secara ketat (Hanya JPEG dan PNG, SVG diblokir secara eksplisit)
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(ktmFile.type)) {
      return NextResponse.json(
        { success: false, message: "Format berkas KTM harus berupa gambar JPG, JPEG, atau PNG!" },
        { status: 400 }
      );
    }

    // Validasi format NPM (hanya angka)
    if (!/^\d+$/.test(npm)) {
      return NextResponse.json(
        { success: false, message: "NPM hanya boleh berisi angka!" },
        { status: 400 }
      );
    }

    // Cek apakah mahasiswa dengan NPM tersebut sudah terdaftar
    const existingMahasiswa = await prisma.mahasiswa.findUnique({
      where: { npm },
    });

    if (existingMahasiswa) {
      return NextResponse.json(
        { success: false, message: "Mahasiswa dengan NPM ini sudah terdaftar!" },
        { status: 400 }
      );
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Ganti nama file asli menjadi UUID acak untuk mencegah penimpaan file & enumerasi nama file
    const uuid = globalThis.crypto.randomUUID();
    const ext = ktmFile.type === "image/jpeg" ? ".jpg" : ".png";
    const filename = `${uuid}${ext}`;

    let fotoKtmUrl = "";
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (isSupabaseConfigured) {
      // Unggah ke Supabase Storage bucket 'ktm-uploads'
      const bytes = await ktmFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("ktm-uploads")
        .upload(filename, buffer, {
          contentType: ktmFile.type,
          upsert: true
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        return NextResponse.json(
          { success: false, message: "Gagal mengunggah foto KTM ke Supabase Storage!" },
          { status: 500 }
        );
      }

      // Ambil public url file KTM yang sudah ter-upload
      const { data: publicUrlData } = supabase.storage.from("ktm-uploads").getPublicUrl(filename);
      fotoKtmUrl = publicUrlData.publicUrl;
    } else {
      // Fallback ke penyimpanan lokal jika Supabase belum siap (untuk dev environment)
      const bytes = await ktmFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);
      fotoKtmUrl = `/uploads/${filename}`;
    }

    // Buat data Mahasiswa baru di Supabase melalui Prisma
    const newMahasiswa = await prisma.mahasiswa.create({
      data: {
        npm,
        nama,
        password: hashedPassword,
        fotoKtmUrl,
      },
    });

    // Otomatis buat sesi setelah pendaftaran berhasil
    await setSession({ id: newMahasiswa.id, npm: newMahasiswa.npm, nama: newMahasiswa.nama });

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil dan otomatis masuk!",
        data: {
          id: newMahasiswa.id,
          npm: newMahasiswa.npm,
          nama: newMahasiswa.nama,
          fotoKtmUrl: newMahasiswa.fotoKtmUrl,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registrasi Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Terjadi kesalahan internal pada server saat memproses pendaftaran." 
      },
      { status: 500 }
    );
  }
}
