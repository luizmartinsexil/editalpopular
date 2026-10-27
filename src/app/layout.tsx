import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif-head",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Edital Popular — Concursos Públicos e Editais Regionais",
  description:
    "Notícias de concursos públicos, editais de prefeituras e processos seletivos regionais. Receba alertas no WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${serif.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
