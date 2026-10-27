import Link from "next/link";
import { alternarNoticiaAction, excluirNoticiaAction } from "@/app/admin/actions";
import ExcluirButton from "@/components/admin/ExcluirButton";
import { PageTitle, PublicadoBadge, btnGhost, btnPrimary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { listNoticias } from "@/lib/store";

export default async function NoticiasAdmin() {
  await requireAdmin();
  const noticias = await listNoticias();

  return (
    <>
      <PageTitle
        action={
          <Link href="/admin/noticias/novo" className={btnPrimary}>
            + Nova notícia
          </Link>
        }
      >
        Notícias
      </PageTitle>

      <div className="bg-white border border-slate-200 rounded-md divide-y divide-slate-100">
        {noticias.length === 0 && <p className="p-6 text-sm text-slate-600">Nenhuma notícia cadastrada.</p>}
        {noticias.map((n) => (
          <div key={n.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <PublicadoBadge publicado={n.publicado} />
                <span className="text-xs text-slate-500">{n.categoria}</span>
              </div>
              <p className="font-bold text-slate-800">{n.titulo}</p>
              <p className="text-xs text-slate-500">
                {n.fonte} · {formatDateTime(n.publicadoEm)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <form action={alternarNoticiaAction}>
                <input type="hidden" name="id" value={n.id} />
                <button type="submit" className={btnGhost}>
                  {n.publicado ? "Despublicar" : "Publicar"}
                </button>
              </form>
              <Link href={`/admin/noticias/${n.id}`} className={btnGhost}>
                Editar
              </Link>
              <form action={excluirNoticiaAction}>
                <input type="hidden" name="id" value={n.id} />
                <ExcluirButton mensagem={`Excluir a notícia "${n.titulo}"? Esta ação não pode ser desfeita.`} />
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
