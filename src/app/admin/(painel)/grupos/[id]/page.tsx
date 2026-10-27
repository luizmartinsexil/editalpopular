import Link from "next/link";
import { notFound } from "next/navigation";
import { salvarGrupoAction } from "@/app/admin/actions";
import { Field, PageTitle, btnGhost, btnPrimary, inputCls, textareaCls } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getGrupo } from "@/lib/store";
import type { GrupoWhatsApp } from "@/types";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const AREAS_SUGERIDAS = [
  "Administrativo & Gestão",
  "Educação & Magistério",
  "Saúde & Enfermagem",
  "Segurança & Guardas Municipais",
  "Tribunais & Judiciário",
  "Fiscal & Tributário",
  "Tecnologia & Informática",
  "Operacional & Serviços Gerais",
];

export default async function GrupoForm({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { erro } = await searchParams;
  const novo = id === "novo";
  const g: Partial<GrupoWhatsApp> | undefined = novo ? { ativo: true, tipo: "regional" } : await getGrupo(id);
  if (!g) notFound();

  return (
    <>
      <PageTitle>{novo ? "Novo grupo de WhatsApp" : "Editar grupo de WhatsApp"}</PageTitle>

      {erro && (
        <p role="alert" className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2">
          Informe o nome do grupo e o link oficial do WhatsApp.
        </p>
      )}

      <form action={salvarGrupoAction} className="bg-white border border-slate-200 rounded-md p-5 space-y-5 max-w-2xl">
        <input type="hidden" name="id" value={novo ? "" : id} />

        <Field label="Nome do Grupo" htmlFor="nome" hint="Ex: São Paulo — Capital & Interior, ou Área de Saúde & Enfermagem">
          <input id="nome" name="nome" required defaultValue={g.nome} className={inputCls} />
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Classificação do Grupo" htmlFor="tipo">
            <select
              id="tipo"
              name="tipo"
              defaultValue={g.tipo ?? "regional"}
              className={inputCls}
            >
              <option value="regional">Regional / Por Estado</option>
              <option value="area">Por Área Temática / Carreira</option>
            </select>
          </Field>

          <Field label="Estado (UF)" htmlFor="uf" hint="Opcional (se for grupo regional específico)">
            <select id="uf" name="uf" defaultValue={g.uf ?? ""} className={inputCls}>
              <option value="">Nenhum / Vários Estados</option>
              {UFS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Área de Atuação (se aplicável)"
          htmlFor="area"
          hint="Ex: Educação, Saúde, Administrativo, Segurança"
        >
          <input
            id="area"
            name="area"
            list="areas-sugeridas"
            defaultValue={g.area}
            placeholder="Selecione ou digite a área..."
            className={inputCls}
          />
          <datalist id="areas-sugeridas">
            {AREAS_SUGERIDAS.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </Field>

        <Field label="Descrição Curta" htmlFor="descricao" hint="Explique o que os membros receberão no grupo">
          <textarea
            id="descricao"
            name="descricao"
            rows={2}
            defaultValue={g.descricao}
            placeholder="Ex: Receba avisos de editais abertos para prefeituras e órgãos da região..."
            className={textareaCls}
          />
        </Field>

        <Field label="Link do Grupo no WhatsApp" htmlFor="link" hint="Ex: https://chat.whatsapp.com/...">
          <input
            id="link"
            name="link"
            type="url"
            required
            defaultValue={g.link}
            placeholder="https://chat.whatsapp.com/..."
            className={inputCls}
          />
        </Field>

        <Field
          label="Estimativa de Membros (Selo Social)"
          htmlFor="membrosAprox"
          hint="Ex: 1.800 membros, +2.000 concurseiros"
        >
          <input
            id="membrosAprox"
            name="membrosAprox"
            defaultValue={g.membrosAprox}
            placeholder="Ex: 1.500 membros"
            className={inputCls}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 border-t border-slate-100 pt-4">
          <input type="checkbox" name="ativo" defaultChecked={g.ativo !== false} />
          Grupo ativo (visível na página pública de comunidades)
        </label>

        <div className="flex gap-2">
          <button type="submit" className={btnPrimary}>
            Salvar Grupo
          </button>
          <Link href="/admin/grupos" className={btnGhost}>
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
