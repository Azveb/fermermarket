import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import AdBanner from "@/components/AdBanner";
import { getAdSlotContent } from "@/lib/adSlots";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fermermarket.az";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FermerMarket — Aqrar Bazar Platforması | Heyvan, Gübrə, Texnika Satışı",
    template: "%s | FermerMarket",
  },
  description:
    "FermerMarket — Azərbaycanda fermerlər, mağazalar, aqronomlar və alıcıları birləşdirən AI dəstəkli kənd təsərrüfatı marketplace-i. Mal-qara, gübrə, toxum, texnika elanları, AI aqronom məsləhəti.",
  keywords: ["kənd təsərrüfatı", "gübrə", "traktor satılır", "dana satılır", "qoyun satılır", "bal satışı", "aqronom", "fermer bazarı", "azərbaycan marketplace"],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "az_AZ",
    siteName: "FermerMarket",
    title: "FermerMarket — Aqrar Bazar Platforması",
    description: "Fermerlər, mağazalar, aqronomlar və alıcılar üçün AI dəstəkli vahid kənd təsərrüfatı ekosistemi.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FermerMarket",
  },
};

export const revalidate = 300;

export const viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  let footerAd = null;
  try { footerAd = await getAdSlotContent("FOOTER_STRIP"); } catch (_) {}

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <ServiceWorkerRegister />
          <Header />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          {footerAd && (
            <div className="max-w-6xl mx-auto px-4 pt-4 pb-24 md:pb-4">
              <AdBanner content={footerAd} className="w-full h-20 md:h-24 overflow-hidden rounded-xl" imgClassName="w-full h-20 md:h-24 object-cover" />
            </div>
          )}
          <Footer />
          <BottomNav />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
