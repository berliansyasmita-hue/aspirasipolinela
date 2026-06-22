import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/session";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, admin: null, message: "Belum masuk sesi admin" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: session.id,
        username: session.username,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
