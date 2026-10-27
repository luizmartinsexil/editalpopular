import { Clock } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { CategoriaNoticia, Noticia } from "@/types";

const catStyle: Record<CategoriaNoticia, string> = {
  Convocação: "text-emerald-700",
  "Comunicado da Banca": "text-brand",
  Retificação: "text-blue-700",
  Resultado: "text-violet-700",
  Gabarito: "text-amber-700",
  Geral: "text-slate-600",
};

export default function NoticiasLateral({ noticias }: { noticias: Noticia[] }) {
  return (
    <aside id="noticias" aria-labelledby="noticias-titulo" className="bg-white border border-slate-200 rounded-md">
      <h2
        id="noticias-titulo"
        className="px-4 py-3 border-b-2 border-brand font-serif text-lg font-bold text-slate-900"
      >
        Últimas Atualizações
      </h2>
      <ul className="divide-y divide-slate-100">
        {noticias.map((n) => (
          <li key={n.id}>
            <a href={n.url} className="block px-4 py-3 hover:bg-slate-50 transition-colors">
              <span className={`text-[11px] font-bold uppercase tracking-wide ${catStyle[n.categoria]}`}>
                {n.categoria}
              </span>
              <h3 className="mt-0.5 text-sm font-semibold text-slate-800 leading-snug">{n.titulo}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {formatDateTime(n.publicadoEm)} · {n.fonte}
              </p>
            </a>
          </li>
        ))}
      </ul>
      <a href="#" className="block px-4 py-3 text-sm font-semibold text-brand hover:underline border-t border-slate-200">
        Ver todas as notícias →
      </a>
    </aside>
  );
}
