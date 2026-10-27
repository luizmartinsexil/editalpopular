import Link from "next/link";
import { alternarGrupoAction, excluirGrupoAction } from "@/app/admin/actions";
import ExcluirButton from "@/components/admin/ExcluirButton";
import { PageTitle, PublicadoBadge, btnGhost, btnPrimary } from "@/components/admin/ui";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { requireAdmin } from "@/lib/auth";
import { listGrupos } from "@/lib/store";

export default async function GruposAdmin() {
  await requireAdmin();
  const grupos = await listGrupos();

  const regionais = grupos.filter((g) => g.tipo === "regional");
  const areas = grupos.filter((g) => g.tipo === "area");

  return (
    <>
      <PageTitle
        action={
          <Link href="/admin/grupos/novo" className={btnPrimary}>
            + Novo grupo
          </Link>
        }
      >
        Grupos de WhatsApp
      </PageTitle>

      <p className="text-sm text-slate-600 mb-6 max-w-2xl">
        Gerencie os canais e comunidades no WhatsApp divididos por Estados/Regiões ou Áreas Temáticas (Educação, Saúde, Administrativo, etc.).
      </p>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-md p-3.5">
          <p className="text-2xl font-bold text-slate-900">{grupos.filter((g) => g.ativo).length}</p>
          <p className="text-xs text-slate-500">Grupos ativos na página pública</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-3.5">
          <p className="text-2xl font-bold text-slate-900">{regionais.length}</p>
          <p className="text-xs text-slate-500">Grupos Regionais / Estados</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-3.5">
          <p className="text-2xl font-bold text-slate-900">{areas.length}</p>
          <p className="text-xs text-slate-500">Grupos por Área de Atuação</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md divide-y divide-slate-100">
        {grupos.length === 0 && (
          <p className="p-6 text-sm text-slate-600">Nenhum grupo cadastrado.</p>
        )}
        {grupos.map((g) => (
          <div key={g.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <PublicadoBadge publicado={g.ativo} />
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {g.tipo === "regional" ? `Regional ${g.uf ? `(${g.uf})` : ""}` : `Área: ${g.area || "Geral"}`}
                </span>
                {g.membrosAprox && (
                  <span className="text-xs text-slate-500">{g.membrosAprox}</span>
                )}
              </div>
              <p className="font-bold text-slate-800">{g.nome}</p>
              <p className="text-xs text-slate-500 line-clamp-1">{g.descricao}</p>
              <a
                href={g.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand hover:underline inline-flex items-center gap-1 mt-1"
              >
                <WhatsAppIcon className="h-3 w-3 text-[#25D366]" /> {g.link}
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <form action={alternarGrupoAction}>
                <input type="hidden" name="id" value={g.id} />
                <button type="submit" className={btnGhost}>
                  {g.ativo ? "Desativar" : "Ativar"}
                </button>
              </form>
              <Link href={`/admin/grupos/${g.id}`} className={btnGhost}>
                Editar
              </Link>
              <form action={excluirGrupoAction}>
                <input type="hidden" name="id" value={g.id} />
                <ExcluirButton mensagem={`Excluir o grupo "${g.nome}"? Esta ação não pode ser desfeita.`} />
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
