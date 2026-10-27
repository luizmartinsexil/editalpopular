import Link from "next/link";
import { FileText, LayoutDashboard, LogOut, MessageSquare, Newspaper, Settings } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/editais", label: "Editais", icon: FileText },
  { href: "/admin/noticias", label: "Notícias", icon: Newspaper },
  { href: "/admin/grupos", label: "Grupos WhatsApp", icon: MessageSquare },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="bg-navy text-white md:w-60 md:min-h-screen shrink-0">
        <div className="px-4 py-4 border-b border-white/10 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Edital Popular"
            className="h-9 w-auto object-contain rounded bg-white/10 p-0.5"
          />
          <div>
            <p className="font-serif text-lg font-bold leading-tight">Edital Popular</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">Administração</p>
          </div>
        </div>
        <nav aria-label="Admin" className="p-2 flex md:block gap-1 overflow-x-auto">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm text-slate-200 hover:bg-white/10 hover:text-white whitespace-nowrap"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-slate-400 hover:text-white whitespace-nowrap"
          >
            Ver site ↗
          </Link>
        </nav>
        <form action={logoutAction} className="p-2 md:mt-4">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-slate-300 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
          </button>
        </form>
      </aside>
      <div className="flex-1 min-w-0 p-4 md:p-8 max-w-6xl">{children}</div>
    </div>
  );
}
