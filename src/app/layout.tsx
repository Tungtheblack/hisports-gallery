import type { Metadata } from "next";
import { notoSansLao } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hi Sports - ຜົນງານອອກແບບເສື້ອກິລາ",
  description: "ຜົນງານອອກແບບເສື້ອກິລາຄຸນນະພາບຈາກ Hi Sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lo">
      <body
        className={`${notoSansLao.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
