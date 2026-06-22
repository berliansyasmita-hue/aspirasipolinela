import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/session";

// GET: Mendapatkan daftar mahasiswa untuk diverifikasi
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak. Silakan login admin." }, { status: 401 });
    }

    const listMahasiswa = await prisma.mahasiswa.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        npm: true,
        nama: true,
        fotoKtmUrl: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: listMahasiswa });
  } catch (error) {
    console.error("Fetch Mahasiswa Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data." }, { status: 500 });
  }
}

// PUT: Memverifikasi / Menyetujui mahasiswa
export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    const body = await request.json();
    const { id, isVerified } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID mahasiswa diperlukan." }, { status: 400 });
    }

    const updated = await prisma.mahasiswa.update({
      where: { id: Number(id) },
      data: { isVerified: Boolean(isVerified) },
    });

    return NextResponse.json({
      success: true,
      message: `Status verifikasi mahasiswa NPM ${updated.npm} berhasil diperbarui!`,
      data: updated,
    });
  } catch (error) {
    console.error("Verify Mahasiswa Error:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui status verifikasi." }, { status: 500 });
  }
}

// DELETE: Menolak / Menghapus akun mahasiswa
export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID mahasiswa diperlukan." }, { status: 400 });
    }

    const deleted = await prisma.mahasiswa.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: `Akun mahasiswa dengan NPM ${deleted.npm} berhasil dihapus!`,
    });
  } catch (error) {
    console.error("Delete Mahasiswa Error:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus data mahasiswa." }, { status: 500 });
  }
}
