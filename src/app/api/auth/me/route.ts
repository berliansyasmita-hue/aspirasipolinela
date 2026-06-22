import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/session";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, user: null, message: "Belum masuk sesi" },
        { status: 200 } // Return 200 with user: null is cleaner for client-side queries
      );
    }

    // Ambil data terbaru langsung dari database Supabase
    const mhs = await prisma.mahasiswa.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        npm: true,
        nama: true,
        isVerified: true,
      },
    });

    if (!mhs) {
      return NextResponse.json(
        { success: false, user: null, message: "Data mahasiswa tidak ditemukan" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: mhs.id,
        npm: mhs.npm,
        nama: mhs.nama,
        isVerified: mhs.isVerified,
      },
    });
  } catch (error) {
    console.error("Session Me Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

