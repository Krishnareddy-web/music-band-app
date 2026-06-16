import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BookingForm from "@/components/BookingForm";
import Providers from "@/components/Providers";
import CustomCursor from "@/components/CustomCursor";
import ActivityTracker from "@/components/ActivityTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Devotional Band | Spiritual Music Ensemble",
    template: "%s | Devotional Band"
  },
  description: "Experience the divine rhythm with our 15-member devotional band. Sacred music, live events, and digital content.",
  keywords: ["Devotional Music", "Ayyappa Swami", "Spiritual Band", "Bhajans", "Devotional Song Books"],
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>

          <CustomCursor />
          <ActivityTracker />
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
          <BookingForm />
        </Providers>
      </body>
    </html>
  );
}
