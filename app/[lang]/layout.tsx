import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { hasLocale, locales } from "./dictionaries";
import { SITE_URL } from "@/app/lib/site";
import { PostHogProvider } from "./_components/PostHogProvider";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const calSans = localFont({
  src: "../fonts/CalSans-Regular.ttf",
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Signal \u2014 Stop paying for AWS you don\u2019t use",
  description:
    "Find idle EC2, over-provisioned RDS and forgotten NAT gateways. Read-only IAM, 5-minute scan, Terraform patches ready to merge.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`h-full antialiased ${inter.variable} ${calSans.variable}`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
