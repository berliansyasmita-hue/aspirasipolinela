import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: Mengambil berita terbaru untuk publik
export async function GET() {
  try {
    const listBerita = await prisma.berita.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: listBerita,
    });
  } catch (error) {
    console.error("Fetch Public Berita Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat berita terbaru." },
      { status: 500 }
    );
  }
}
