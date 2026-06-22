import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { setAdminSession } from "../../../../lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi!" },
        { status: 400 }
      );
    }

    // Cari admin berdasarkan username
    const admin = await (prisma as any).admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Kredensial Admin tidak terdaftar!" },
        { status: 401 }
      );
    }

    // Bandingkan password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: "Username atau password Admin salah!" },
        { status: 401 }
      );
    }

    // Set sesi login admin
    await setAdminSession({ id: admin.id, username: admin.username, role: "admin" });

    return NextResponse.json({
      success: true,
      message: "Berhasil masuk ke panel Admin!",
      data: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
