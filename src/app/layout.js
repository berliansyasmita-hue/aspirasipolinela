import Navbar from "./Navbar";
import "./globals.css";

export const metadata = {
  title: "Advokesma Polinela",
  description: "Sistem Informasi Aspirasi Mahasiswa Politeknik Negeri Lampung",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* Navbar langsung dipanggil dari folder yang sama */}
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}