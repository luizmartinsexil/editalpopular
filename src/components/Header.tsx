"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const menu = [
  { label: "Início", href: "/" },
  { label: "Concursos Abertos", href: "/#editais" },
  { label: "Grupos no WhatsApp", href: "/grupos" },
  { label: "Prefeituras", href: "/#editais" },
  { label: "Notícias", href: "/#noticias" },
];

export default function Header({ whatsappUrl }: { whatsappUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white text-slate-900 border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 h-20 md:h-24 flex items-center justify-between gap-4">
        {/* Apenas a logo com destaque máximo */}
        <Link href="/" className="flex items-center shrink-0 py-1" title="Edital Popular — Página Inicial">
          <img
            src="/logo.png"
            alt="Edital Popular"
            className="h-14 md:h-18 w-auto max-w-[280px] md:max-w-[360px] object-contain transition-transform hover:scale-[1.02]"
          />
        </Link>

        {/* Menu de navegação */}
        <nav aria-label="Principal" className="hidden lg:flex items-center gap-1">
          {menu.map((m) => (
            <Link
              key={m.label}
              href={m.href}
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-brand hover:bg-slate-100 rounded-md transition-colors"
            >
              {m.label}
            </Link>
          ))}
        </nav>

        {/* Botão de conversão WhatsApp & Mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold text-sm px-4 py-2.5 rounded-md transition-all shadow-sm hover:shadow flex items-center gap-2"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Receber Editais no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {open && (
        <nav aria-label="Mobile" className="lg:hidden border-t border-slate-200 bg-white px-4 py-2 shadow-lg">
          {menu.map((m) => (
            <Link
              key={m.label}
              href={m.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-semibold text-slate-700 hover:text-brand border-b border-slate-100 last:border-0"
            >
              {m.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
