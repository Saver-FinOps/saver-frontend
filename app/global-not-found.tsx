import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const calSans = localFont({
  src: "./fonts/CalSans-Regular.ttf",
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "404 — Signal",
  description: "Esta página se fue. Como un volumen EBS de un test que corriste en 2023.",
};

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`h-full antialiased ${inter.variable} ${calSans.variable}`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
          <div
            className="text-8xl font-display font-bold mb-4 leading-none tracking-[-0.025em]"
            style={{
              background: "linear-gradient(45deg, #3b82f6, #10b981)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            404
          </div>
          <h1 className="text-3xl font-display font-semibold text-slate-900 leading-[1.1] tracking-[-0.025em] mb-3">
            Esta página se fue.
          </h1>
          <p className="text-base text-slate-600 max-w-md mb-8 leading-relaxed">
            Como un volumen EBS de un test que corriste en 2023 — solo que esta no te está cobrando $84 al mes.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              href="/es"
              className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold no-underline"
            >
              Volver al inicio
            </Link>
            <Link
              href="/es/contact"
              className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-900 text-sm font-semibold no-underline border border-slate-200"
            >
              Contanos qué se rompió
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
