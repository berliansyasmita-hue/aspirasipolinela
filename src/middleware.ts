import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/crypto";

// Store Token Bucket untuk pembatasan laju (Rate Limiting) in-memory
interface TokenBucket {
  tokens: number;
  lastRefill: number;
}
const rateLimitStore = new Map<string, TokenBucket>();

function isRateLimited(ip: string, endpoint: string, maxTokens: number, refillWindowMs: number): boolean {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const bucket = rateLimitStore.get(key) || { tokens: maxTokens, lastRefill: now };

  // Hitung penambahan token berdasarkan waktu yang telah berlalu
  const elapsed = now - bucket.lastRefill;
  const refilled = elapsed * (maxTokens / refillWindowMs);
  
  bucket.tokens = Math.min(maxTokens, bucket.tokens + refilled);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    rateLimitStore.set(key, bucket);
    return false; // Tidak terkena limit (lolos)
  }

  rateLimitStore.set(key, bucket);
  return true; // Terkena limit (diblokir)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = (request as any).ip || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  // --- A. RATE LIMITING ---

  // Aturan A: Endpoint login admin (/api/admin/login) maksimal 5 kali per 15 menit per IP
  if (pathname === "/api/admin/login" && request.method === "POST") {
    // 15 menit = 15 * 60 * 1000 = 900.000 ms
    if (isRateLimited(ip, "admin-login", 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak percobaan masuk! Silakan coba lagi dalam 15 menit." },
        { status: 429 }
      );
    }
  }

  // Aturan B: Endpoint form aduan/aspirasi (/api/aspirasi) maksimal 3 kali pengiriman per jam per IP
  if (pathname === "/api/aspirasi" && request.method === "POST") {
    // 1 jam = 60 * 60 * 1000 = 3.600.000 ms
    if (isRateLimited(ip, "aspirasi-post", 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, message: "Batas pengiriman aspirasi terlampaui! Maksimal 3 keluhan per jam." },
        { status: 429 }
      );
    }
  }

  // --- B. URL OBFUSCATION ---

  // Jika rute lama /admin diakses, kembalikan respons 404 Not Found secara langsung untuk mengecoh bot.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // --- C. ROUTE GUARDING ---

  // Proteksi semua rute di bawah /portal-advo/* kecuali halaman login (/portal-advo/masuk)
  if (pathname.startsWith("/portal-advo") && pathname !== "/portal-advo/masuk") {
    // Ambil cookie 'admin_session'
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      // Jika cookie tidak ada, arahkan ke login
      const loginUrl = new URL("/portal-advo/masuk", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Dekripsi sesi untuk verifikasi
    const session = await decrypt(token);

    // Pastikan sesi valid dan memiliki role 'admin'
    if (!session || session.role !== "admin") {
      const loginUrl = new URL("/portal-advo/masuk", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Batasi matcher agar middleware memproses rute admin dan rute API yang dilindungi
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/portal-advo/:path*",
    "/api/admin/login",
    "/api/aspirasi",
  ],
};
