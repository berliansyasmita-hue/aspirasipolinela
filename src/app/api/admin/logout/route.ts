import { NextResponse } from "next/server";
import { clearAdminSession } from "../../../../lib/session";

export async function POST() {
  try {
    await clearAdminSession();
    return NextResponse.json({
      success: true,
      message: "Berhasil keluar dari sesi Admin!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memproses keluar." },
      { status: 500 }
    );
  }
}
