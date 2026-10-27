import Link from "next/link";
import { alternarEditalAction, excluirEditalAction } from "@/app/admin/actions";
import ExcluirButton from "@/components/admin/ExcluirButton";
import OrgaoLogo from "@/components/OrgaoLogo";
import { PageTitle, PublicadoBadge, btnGhost, btnPrimary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { listEditais } from "@/lib/store";

export default async function EditaisAdmin() {
  await requireAdmin();
  const editais = await listEditais();

  return (
    <>
      <PageTitle
        action={
          <Link href="/admin/editais/novo" className={btnPrimary}>
            + Novo edital
          </Link>
        }
      >
        Editais
      </PageTitle>

      <div className="bg-white border border-slate-200 rounded-md divide-y divide-slate-100">
        {editais.length === 0 && <p className="p-6 text-sm text-slate-600">Nenhum edital cadastrado.</p>}
        {editais.map((e) => (
          <div key={e.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
            <OrgaoLogo nome={e.orgao} logo={e.logo} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <PublicadoBadge publicado={e.publicado} />
                <span className="text-xs text-slate-500">{e.status}</span>
              </div>
              <p className="font-bold text-slate-800 truncate">{e.orgao}</p>
              <p className="text-xs text-slate-500">
                {e.cidade}/{e.uf} · inscrições até {formatDate(e.inscricaoFim)} · atualizado em{" "}
                {formatDate(e.atualizadoEm)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <form action={alternarEditalAction}>
                <input type="hidden" name="id" value={e.id} />
                <button type="submit" className={btnGhost}>
                  {e.publicado ? "Despublicar" : "Publicar"}
                </button>
              </form>
              <Link href={`/admin/editais/${e.id}`} className={btnGhost}>
                Editar
              </Link>
              <form action={excluirEditalAction}>
                <input type="hidden" name="id" value={e.id} />
                <ExcluirButton mensagem={`Excluir o edital "${e.orgao}"? Esta ação não pode ser desfeita.`} />
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
