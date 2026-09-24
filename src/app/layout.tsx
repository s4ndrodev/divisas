import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://divisascuba.vercel.app"),
  title: "Divisas — Conversor de divisas",
  description:
    "Consulta las tasas de cambio actualizadas en Cuba. Fuentes: elToque y BCC Oficial.",
  authors: [{ name: "Divisas" }],
  openGraph: {
    type: "website",
    siteName: "Divisas",
    url: "https://divisascuba.vercel.app",
    title: "Divisas — Conversor de divisas",
    description:
      "Consulta las tasas de cambio actualizadas en Cuba. Fuentes: elToque y BCC Oficial.",
    images: [
      {
        url: "/assets/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "Divisas - Conversor de divisas",
      },
    ],
    locale: "es_CU",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@alessan2roo",
    title: "Divisas — Conversor de divisas",
    description:
      "Consulta las tasas de cambio actualizadas en Cuba. Fuentes: elToque y BCC Oficial.",
    images: ["/assets/icons/og-image.png"],
  },
  appleWebApp: { title: "Divisas", capable: true },
  icons: {
    icon: "/assets/icons/favicon.ico",
    apple: "/assets/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  referrer: "strict-origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
