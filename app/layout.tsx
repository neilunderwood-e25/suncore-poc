import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Suncor",
  description: "Contentful-driven, multi-language website",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={locale ?? "en-ca"} suppressHydrationWarning>
      <body className={`${notoSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
