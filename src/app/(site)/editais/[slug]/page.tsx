import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  GraduationCap,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";
import OrgaoLogo from "@/components/OrgaoLogo";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { diasRestantes, formatBRL, formatDate, whatsappShareUrl } from "@/lib/format";
import { getConfiguracoes, getEditalPublicadoPorSlug } from "@/lib/store";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const e = await getEditalPublicadoPorSlug((await params).slug);
  return e
    ? { title: `${e.orgao} — ${e.categoria} | Edital Popular`, description: e.resumo }
    : { title: "Edital não encontrado | Edital Popular" };
}

function Item({ icon: Icon, label, children }: { icon: typeof Users; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 mt-0.5 text-slate-400 shrink-0" aria-hidden="true" />
      <div>
        <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="font-semibold text-slate-800">{children}</dd>
      </div>
    </div>
  );
}

export default async function EditalPage({ params }: Params) {
  const e = await getEditalPublicadoPorSlug((await params).slug);
  if (!e) notFound();
  const { whatsappUrl } = await getConfiguracoes();
  const dias = diasRestantes(e.inscricaoFim);

  const totalProvas = e.provasAnteriores?.length ?? 0;
  const totalAnexos = e.anexos?.length ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar aos editais
      </Link>

      <article className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
        <header className="p-5 md:p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start gap-4">
          <OrgaoLogo nome={e.orgao} logo={e.logo} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                {e.categoria}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {e.status}
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              {e.orgao}
            </h1>
            {e.resumo && <p className="mt-2 text-slate-600 leading-relaxed text-sm md:text-base">{e.resumo}</p>}
          </div>
        </header>

        {/* Barra de Ações Rápidas */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#provas-anteriores"
              className="inline-flex items-center gap-1.5 bg-brand hover:bg-navy text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-md transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Provas Anteriores &amp; Similares {totalProvas > 0 && `(${totalProvas})`}
            </a>
            {totalAnexos > 0 && (
              <a
                href="#arquivos-edital"
                className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs md:text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                <FileDown className="h-4 w-4 text-slate-500" />
                Arquivos do Edital ({totalAnexos})
              </a>
            )}
          </div>

          <a
            href={whatsappShareUrl(e, whatsappUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> Compartilhar no WhatsApp
          </a>
        </div>

        {/* Dados objetivos */}
        <dl className="p-5 md:p-6 grid sm:grid-cols-2 gap-5 border-b border-slate-200">
          <Item icon={Wallet} label="Salário">
            {e.salarioMin === e.salarioMax
              ? formatBRL(e.salarioMax)
              : `${formatBRL(e.salarioMin)} a ${formatBRL(e.salarioMax)}`}
          </Item>
          <Item icon={Users} label="Vagas">
            {e.vagas}
            {e.cadastroReserva ? " + cadastro de reserva" : ""}
          </Item>
          <Item icon={GraduationCap} label="Escolaridade">
            {e.escolaridade.join(" / ") || "—"}
          </Item>
          <Item icon={MapPin} label="Localidade">
            {e.cidade ? `${e.cidade}/${e.uf}` : e.uf} · {e.regiao}
          </Item>
          <Item icon={CalendarClock} label="Inscrições">
            {formatDate(e.inscricaoInicio)} a {formatDate(e.inscricaoFim)}
            {dias >= 0 && e.status !== "Previsto" && (
              <span className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded-sm bg-red-100 text-red-700">
                {dias === 0 ? "Último dia!" : `Faltam ${dias} dia${dias > 1 ? "s" : ""}`}
              </span>
            )}
          </Item>
          <Item icon={FileText} label="Banca organizadora">
            {e.banca || "—"}
          </Item>
          {e.dataProva && (
            <Item icon={CalendarClock} label="Data prevista da prova">
              {formatDate(e.dataProva)}
            </Item>
          )}
        </dl>

        {/* Cargos */}
        {e.cargos.length > 0 && (
          <section className="p-5 md:p-6 border-b border-slate-200">
            <h2 className="font-bold text-slate-900 mb-3 text-base">Cargos em Disputa</h2>
            <ul className="list-disc pl-5 text-slate-700 space-y-1 text-sm">
              {e.cargos.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Seção 1: Arquivos e Documentos Oficiais do Edital */}
        <section id="arquivos-edital" className="p-5 md:p-6 border-b border-slate-200 scroll-mt-24">
          <h2 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand" />
            Arquivos e Anexos Oficiais do Edital
          </h2>

          {e.anexos.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum anexo em PDF foi disponibilizado até o momento. Acesse o link oficial abaixo.
            </p>
          ) : (
            <div className="space-y-2">
              {e.anexos.map((a, i) => (
                <div
                  key={`${a.titulo}-${i}`}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{a.titulo}</p>
                      {a.tamanho && <p className="text-xs text-slate-500">{a.tamanho}</p>}
                    </div>
                  </div>

                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-md transition-colors shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Baixar Arquivo
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção 2: Provas Anteriores & Similares para Download */}
        <section id="provas-anteriores" className="p-5 md:p-6 border-b border-slate-200 scroll-mt-24 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                Provas Anteriores &amp; Cadernos de Questões
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Baixe gratuitamente os cadernos de provas anteriores da banca {e.banca || "organizadora"} para treinar.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full self-start sm:self-auto flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Material de Estudo
            </span>
          </div>

          {!e.provasAnteriores || e.provasAnteriores.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-md p-5 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-800">
                Ainda não há provas anteriores adicionadas diretamente para este edital.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Você pode solicitar provas anteriores da banca <strong>{e.banca || "organizadora"}</strong> ou de cargos similares entrando na nossa comunidade do WhatsApp.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                Solicitar Provas no Grupo
              </a>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {e.provasAnteriores.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 rounded-md p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {p.ano ? `Prova ${p.ano}` : "Prova Anterior"}
                      </span>
                      {p.temGabarito && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Com Gabarito
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug">{p.titulo}</h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Formato PDF</span>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-navy hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Baixar Prova
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rodapé institucional com link externo oficial */}
        <footer className="p-5 md:p-6 flex flex-wrap gap-3 bg-white">
          <a
            href={e.linkOficial}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand hover:bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors shadow-sm"
          >
            Acessar página oficial da inscrição
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={whatsappShareUrl(e, whatsappUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors shadow-sm"
          >
            <WhatsAppIcon className="h-4 w-4" /> Compartilhar no WhatsApp
          </a>
        </footer>
      </article>

      <p className="text-xs text-slate-500 text-center">
        Aviso de utilidade pública: consulte sempre as publicações oficiais no Diário Oficial e o edital completo da banca organizadora antes de realizar a inscrição ou pagamento da taxa.
      </p>
    </div>
  );
}
