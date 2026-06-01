import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Punnett Lab — ฝึกพันเน็ตสแควร์ ม.3",
  description:
    "เว็บฝึกทำโจทย์ Punnett Square สำหรับนักเรียน ม.3 เข้าใจการคำนวณพันธุศาสตร์ คิดเปอร์เซ็นต์ และใช้สูตรลัดได้จริง",
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full">
        <Nav />
        {/* เผื่อพื้นที่ให้แถบเมนูล่างบนมือถือ */}
        <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4 sm:pt-6 md:pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
