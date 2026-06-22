import { NextResponse } from "next/server";
import { clearSession } from "../../../../lib/session";

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({
      success: true,
      message: "Berhasil keluar dari sistem!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memproses keluar sesi." },
      { status: 500 }
    );
  }
}
