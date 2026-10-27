import { notFound } from "next/navigation";
import { salvarEditalAction } from "@/app/admin/actions";
import { Field, PageTitle, btnGhost, btnPrimary, inputCls, textareaCls } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getEdital } from "@/lib/store";
import type { Edital } from "@/types";
import Link from "next/link";
import OrgaoLogo from "@/components/OrgaoLogo";

const NIVEIS = ["Fundamental", "Médio", "Técnico", "Superior"] as const;
const STATUS = ["Inscrições Abertas", "Previsto", "Retificado", "Encerrado"] as const;
const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default async function EditalForm({
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
  const e: Partial<Edital> | undefined = novo ? {} : await getEdital(id);
  if (!e) notFound();

  return (
    <>
      <PageTitle>{novo ? "Novo edital" : "Editar edital"}</PageTitle>
      {erro && (
        <p role="alert" className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2">
          {erro === "1" ? "Preencha o órgão e escolha um estado válido." : erro}
        </p>
      )}

      <form action={salvarEditalAction} className="bg-white border border-slate-200 rounded-md p-5 space-y-5">
        <input type="hidden" name="id" value={novo ? "" : id} />

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Órgão / Prefeitura" htmlFor="orgao" className="md:col-span-2">
            <input id="orgao" name="orgao" required defaultValue={e.orgao} className={inputCls} />
          </Field>
          <div className="md:col-span-2">
            <Field
              label="Logo do órgão / prefeitura"
              htmlFor="logo"
              hint="PNG, JPG ou WebP, até 1 MB. Prefira imagem quadrada ou com fundo transparente."
            >
              <div className="flex items-center gap-4">
                <OrgaoLogo nome={e.orgao || "Logo"} logo={e.logo} />
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="text-sm file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:border-slate-400"
                />
              </div>
            </Field>
            {e.logo && (
              <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="removerLogo" /> Remover a logo atual
              </label>
            )}
          </div>
          <Field label="Cidade" htmlFor="cidade">
            <input id="cidade" name="cidade" defaultValue={e.cidade} className={inputCls} />
          </Field>
          <Field label="Estado" htmlFor="uf">
            <select id="uf" name="uf" required defaultValue={e.uf ?? ""} className={inputCls}>
              <option value="" disabled>
                Selecione
              </option>
              {UFS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </Field>
          <Field label="Banca organizadora" htmlFor="banca">
            <input id="banca" name="banca" defaultValue={e.banca} className={inputCls} />
          </Field>
          <Field label="Tipo" htmlFor="categoria">
            <select id="categoria" name="categoria" defaultValue={e.categoria ?? "Concurso Público"} className={inputCls}>
              <option>Concurso Público</option>
              <option>Processo Seletivo</option>
            </select>
          </Field>
          <Field label="Situação" htmlFor="status">
            <select id="status" name="status" defaultValue={e.status ?? "Inscrições Abertas"} className={inputCls}>
              {STATUS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <fieldset>
            <legend className="block text-sm font-semibold text-slate-700 mb-1">Escolaridade</legend>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              {NIVEIS.map((n) => (
                <label key={n} className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" name="escolaridade" value={n} defaultChecked={e.escolaridade?.includes(n)} />
                  {n}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <Field label="Cargos" htmlFor="cargos" hint="Um por linha ou separados por vírgula.">
          <textarea id="cargos" name="cargos" rows={3} defaultValue={e.cargos?.join("\n")} className={textareaCls} />
        </Field>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Vagas" htmlFor="vagas">
            <input id="vagas" name="vagas" type="number" min={0} defaultValue={e.vagas ?? 0} className={inputCls} />
          </Field>
          <Field label="Salário mínimo (R$)" htmlFor="salarioMin">
            <input id="salarioMin" name="salarioMin" type="number" step="0.01" min={0} defaultValue={e.salarioMin ?? 0} className={inputCls} />
          </Field>
          <Field label="Salário máximo (R$)" htmlFor="salarioMax">
            <input id="salarioMax" name="salarioMax" type="number" step="0.01" min={0} defaultValue={e.salarioMax ?? 0} className={inputCls} />
          </Field>
          <label className="flex items-end gap-2 text-sm pb-2">
            <input type="checkbox" name="cadastroReserva" defaultChecked={e.cadastroReserva} />
            Cadastro reserva
          </label>
          <Field label="Início das inscrições" htmlFor="inscricaoInicio">
            <input id="inscricaoInicio" name="inscricaoInicio" type="date" required defaultValue={e.inscricaoInicio} className={inputCls} />
          </Field>
          <Field label="Fim das inscrições" htmlFor="inscricaoFim">
            <input id="inscricaoFim" name="inscricaoFim" type="date" required defaultValue={e.inscricaoFim} className={inputCls} />
          </Field>
          <Field label="Data da prova" htmlFor="dataProva">
            <input id="dataProva" name="dataProva" type="date" defaultValue={e.dataProva} className={inputCls} />
          </Field>
        </div>

        <Field label="Resumo" htmlFor="resumo">
          <textarea id="resumo" name="resumo" rows={3} defaultValue={e.resumo} className={textareaCls} />
        </Field>
        <Field label="Link oficial" htmlFor="linkOficial" hint="Endereço completo (https://…).">
          <input id="linkOficial" name="linkOficial" defaultValue={e.linkOficial} className={inputCls} />
        </Field>
        {/* Seção Documentos e Arquivos do Edital */}
        <div className="border-t border-slate-200 pt-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Arquivos e Anexos do Edital (PDFs)</h3>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Upload direto de arquivo (PDF, ZIP até 25 MB)
            </p>
            <div className="grid sm:grid-cols-[1fr_200px] gap-3">
              <input
                name="uploadEditalTitulo"
                placeholder="Título do arquivo (ex: Edital Completo de Abertura)"
                className={inputCls}
              />
              <input
                name="uploadEdital"
                type="file"
                accept=".pdf,.zip,.doc,.docx"
                className="text-sm file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:border-slate-400"
              />
            </div>
          </div>

          <Field
            label="Documentos Cadastrados / Links Externos"
            htmlFor="anexos"
            hint="Um documento por linha no formato: Título | Link ou /arquivos/nome.pdf"
          >
            <textarea
              id="anexos"
              name="anexos"
              rows={3}
              defaultValue={e.anexos?.map((a) => `${a.titulo} | ${a.url}${a.tamanho ? ` | ${a.tamanho}` : ""}`).join("\n")}
              placeholder="Edital de Abertura (PDF) | /arquivos/... ou https://..."
              className={textareaCls}
            />
          </Field>
        </div>

        {/* Seção Provas Anteriores & Similares */}
        <div className="border-t border-slate-200 pt-5 space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Provas Anteriores &amp; Similares para Download
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Disponibilize cadernos de provas e gabaritos de concursos anteriores para os candidatos estudarem.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Upload de Caderno de Prova (PDF até 25 MB)
            </p>
            <div className="grid sm:grid-cols-[1fr_120px_auto] gap-3">
              <input
                name="uploadProvaTitulo"
                placeholder="Título da prova (ex: Prova Escrevente TJSP 2023)"
                className={inputCls}
              />
              <input
                name="uploadProvaAno"
                type="number"
                placeholder="Ano (2023)"
                defaultValue={new Date().getFullYear() - 1}
                className={inputCls}
              />
              <input
                name="uploadProva"
                type="file"
                accept=".pdf,.zip"
                className="text-sm file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:border-slate-400"
              />
            </div>
          </div>

          <Field
            label="Lista de Provas Anteriores / Links"
            htmlFor="provasAnteriores"
            hint="Um por linha no formato: Título da Prova | Link/URL | Ano | Gabarito (sim/não)"
          >
            <textarea
              id="provasAnteriores"
              name="provasAnteriores"
              rows={3}
              defaultValue={e.provasAnteriores?.map((p) => `${p.titulo} | ${p.url} | ${p.ano ?? ""} | ${p.temGabarito ? "sim" : "não"}`).join("\n")}
              placeholder="Prova Oficial de Justiça - VUNESP | https://... | 2023 | sim"
              className={textareaCls}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 border-t border-slate-100 pt-4">
          <input type="checkbox" name="publicado" defaultChecked={e.publicado} />
          Publicar no site (desmarcado = rascunho)
        </label>

        <div className="flex gap-2">
          <button type="submit" className={btnPrimary}>
            Salvar
          </button>
          <Link href="/admin/editais" className={btnGhost}>
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
