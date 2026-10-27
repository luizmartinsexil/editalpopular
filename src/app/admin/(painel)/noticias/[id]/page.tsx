import Link from "next/link";
import { notFound } from "next/navigation";
import { salvarNoticiaAction } from "@/app/admin/actions";
import { Field, PageTitle, btnGhost, btnPrimary, inputCls, textareaCls } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getNoticia } from "@/lib/store";
import type { Noticia } from "@/types";

const CATEGORIAS = ["Convocação", "Comunicado da Banca", "Retificação", "Resultado", "Gabarito", "Geral"];

export default async function NoticiaForm({
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
  const n: Partial<Noticia> | undefined = novo ? {} : await getNoticia(id);
  if (!n) notFound();

  return (
    <>
      <PageTitle>{novo ? "Nova notícia" : "Editar notícia"}</PageTitle>
      {erro && (
        <p role="alert" className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2">
          Informe o título da notícia.
        </p>
      )}

      <form action={salvarNoticiaAction} className="bg-white border border-slate-200 rounded-md p-5 space-y-5">
        <input type="hidden" name="id" value={novo ? "" : id} />

        <Field label="Título" htmlFor="titulo">
          <input id="titulo" name="titulo" required defaultValue={n.titulo} className={inputCls} />
        </Field>
        <Field label="Resumo" htmlFor="resumo">
          <textarea id="resumo" name="resumo" rows={3} defaultValue={n.resumo} className={textareaCls} />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Categoria" htmlFor="categoria">
            <select id="categoria" name="categoria" defaultValue={n.categoria ?? "Geral"} className={inputCls}>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Fonte" htmlFor="fonte" hint="Ex.: Diário Oficial, Prefeitura de Campinas.">
            <input id="fonte" name="fonte" defaultValue={n.fonte} className={inputCls} />
          </Field>
        </div>
        <Field label="Link da notícia / fonte" htmlFor="url" hint="Endereço completo (https://…).">
          <input id="url" name="url" defaultValue={n.url} className={inputCls} />
        </Field>
        <Field label="Anexos" htmlFor="anexos" hint="Um por linha, no formato: Título | https://link">
          <textarea
            id="anexos"
            name="anexos"
            rows={3}
            defaultValue={n.anexos?.map((a) => `${a.titulo} | ${a.url}`).join("\n")}
            className={textareaCls}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 border-t border-slate-100 pt-4">
          <input type="checkbox" name="publicado" defaultChecked={n.publicado} />
          Publicar no site (desmarcado = rascunho)
        </label>

        <div className="flex gap-2">
          <button type="submit" className={btnPrimary}>
            Salvar
          </button>
          <Link href="/admin/noticias" className={btnGhost}>
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
