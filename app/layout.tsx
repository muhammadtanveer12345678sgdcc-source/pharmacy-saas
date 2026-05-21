import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers"; // نیکسٹ آتھ (NextAuth) کا ریپر امپورٹ کر لیا

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pharmacy SaaS VIP", // میں نے ٹائٹل بھی اپڈیٹ کر دیا ہے
  description: "Advanced Pharmacy Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* یہاں ہم نے پوری ایپ کو سیکیورٹی پرووائیڈر کے اندر پیک کر دیا ہے */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}