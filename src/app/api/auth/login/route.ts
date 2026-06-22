import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { setSession } from "../../../../lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { npm, password } = body;

    if (!npm || !password) {
      return NextResponse.json(
        { success: false, message: "NPM dan kata sandi wajib diisi!" },
        { status: 400 }
      );
    }

    // Cari mahasiswa berdasarkan NPM
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { npm },
    });

    if (!mahasiswa) {
      return NextResponse.json(
        { success: false, message: "NPM tidak terdaftar atau salah!" },
        { status: 401 }
      );
    }

    // Bandingkan password
    const isPasswordMatch = await bcrypt.compare(password, mahasiswa.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: "NPM atau kata sandi Anda salah!" },
        { status: 401 }
      );
    }

    // Set sesi login
    await setSession({ id: mahasiswa.id, npm: mahasiswa.npm });

    return NextResponse.json({
      success: true,
      message: "Berhasil masuk ke sistem!",
      data: {
        id: mahasiswa.id,
        npm: mahasiswa.npm,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server saat masuk." },
      { status: 500 }
    );
  }
}
