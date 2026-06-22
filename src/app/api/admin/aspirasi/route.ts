import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAdminSession } from "../../../../lib/session";

// GET: Mengembalikan seluruh data aspirasi (untuk dimoderasi admin)
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    const listAspirasi = await prisma.aspirasi.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        mahasiswa: {
          select: {
            npm: true,
            nama: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: listAspirasi });
  } catch (error) {
    console.error("Admin Fetch Aspirasi Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data aspirasi." }, { status: 500 });
  }
}

// PUT: Memperbarui visibilitas publik (perlihatkan/sembunyikan) atau status keluhan
export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    const body = await request.json();
    const { id, isVisible, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID aspirasi diperlukan." }, { status: 400 });
    }

    const updateData: any = {};
    if (isVisible !== undefined) updateData.isVisible = Boolean(isVisible);
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.aspirasi.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Aspirasi berhasil diperbarui oleh Admin!",
      data: updated,
    });
  } catch (error) {
    console.error("Admin Update Aspirasi Error:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui data aspirasi." }, { status: 500 });
  }
}

// DELETE: Menghapus aspirasi
export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID aspirasi diperlukan." }, { status: 400 });
    }

    const deleted = await prisma.aspirasi.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: `Aspirasi "${deleted.judul}" berhasil dihapus dari database!`,
    });
  } catch (error) {
    console.error("Admin Delete Aspirasi Error:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus aspirasi." }, { status: 500 });
  }
}
