"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Filter, X } from "lucide-react";
import EditalCard from "@/components/EditalCard";
import SearchFilter from "@/components/SearchFilter";
import { diasRestantes, formatBRL } from "@/lib/format";
import type { Edital, FiltrosEdital } from "@/types";

const vazio: FiltrosEdital = {
  termo: "",
  escolaridade: "",
  uf: "",
  cidade: "",
  status: "",
  categoria: "",
  salarioMinimo: 0,
  ordenacao: "recentes",
};

const normaliza = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

interface Props {
  editais: Edital[];
  whatsappUrl: string;
  banner: ReactNode;
  sidebar: ReactNode;
}

export default function EditaisExplorer({ editais, whatsappUrl, banner, sidebar }: Props) {
  const [filtros, setFiltros] = useState<FiltrosEdital>(vazio);
  const [aplicados, setAplicados] = useState<FiltrosEdital>(vazio);

  // Cidades disponíveis baseadas nos editais e no estado selecionado
  const cidadesDisponiveis = useMemo(() => {
    const set = new Set<string>();
    editais.forEach((e) => {
      if (e.cidade && (!filtros.uf || e.uf === filtros.uf)) {
        set.add(e.cidade);
      }
    });
    return Array.from(set).sort();
  }, [editais, filtros.uf]);

  const resultado = useMemo(() => {
    const termo = normaliza(aplicados.termo.trim());

    const filtrados = editais.filter((e) => {
      if (aplicados.uf && e.uf !== aplicados.uf) return false;
      if (aplicados.cidade && normaliza(e.cidade) !== normaliza(aplicados.cidade)) return false;
      if (aplicados.escolaridade && !e.escolaridade.includes(aplicados.escolaridade)) return false;
      if (aplicados.status && e.status !== aplicados.status) return false;
      if (aplicados.categoria && e.categoria !== aplicados.categoria) return false;
      if (aplicados.salarioMinimo > 0 && e.salarioMax < aplicados.salarioMinimo) return false;

      if (!termo) return true;
      const alvo = normaliza([e.orgao, e.cidade, e.banca, ...e.cargos].join(" "));
      return alvo.includes(termo);
    });

    // Ordenação
    return filtrados.sort((a, b) => {
      switch (aplicados.ordenacao) {
        case "prazo": {
          const diasA = diasRestantes(a.inscricaoFim);
          const diasB = diasRestantes(b.inscricaoFim);
          if (diasA < 0 && diasB >= 0) return 1;
          if (diasB < 0 && diasA >= 0) return -1;
          return diasA - diasB;
        }
        case "salario":
          return b.salarioMax - a.salarioMax;
        case "vagas":
          return b.vagas - a.vagas;
        case "recentes":
        default:
          return b.atualizadoEm.localeCompare(a.atualizadoEm);
      }
    });
  }, [editais, aplicados]);

  // Lista de filtros ativos para visualização em chips
  const tagsAtivas = useMemo(() => {
    const tags: { id: keyof FiltrosEdital; label: string; valor: string | number }[] = [];
    if (aplicados.termo) tags.push({ id: "termo", label: `Busca: "${aplicados.termo}"`, valor: "" });
    if (aplicados.escolaridade) tags.push({ id: "escolaridade", label: `Nível ${aplicados.escolaridade}`, valor: "" });
    if (aplicados.uf) tags.push({ id: "uf", label: `Estado: ${aplicados.uf}`, valor: "" });
    if (aplicados.cidade) tags.push({ id: "cidade", label: `Cidade: ${aplicados.cidade}`, valor: "" });
    if (aplicados.status) tags.push({ id: "status", label: `Situação: ${aplicados.status}`, valor: "" });
    if (aplicados.categoria) tags.push({ id: "categoria", label: aplicados.categoria, valor: "" });
    if (aplicados.salarioMinimo > 0)
      tags.push({ id: "salarioMinimo", label: `A partir de ${formatBRL(aplicados.salarioMinimo)}`, valor: 0 });
    return tags;
  }, [aplicados]);

  const removerFiltro = (id: keyof FiltrosEdital, valorPadrao: string | number) => {
    const novos = { ...aplicados, [id]: valorPadrao };
    setFiltros(novos);
    setAplicados(novos);
  };

  const limparTudo = () => {
    setFiltros(vazio);
    setAplicados(vazio);
  };

  return (
    <>
      <section className="bg-navy text-white border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
          <h1 className="font-serif text-2xl md:text-4xl font-bold leading-tight max-w-3xl">
            Editais e Concursos Públicos Regionais em Aberto
          </h1>
          <p className="mt-2 text-slate-300 text-sm md:text-base max-w-2xl">
            Acompanhe prefeituras, bancas e prazos de inscrição em um só lugar, com fonte oficial.
          </p>
          <div className="mt-6 bg-white/95 rounded-md p-3 md:p-4 shadow-md">
            <SearchFilter
              value={filtros}
              cidadesDisponiveis={cidadesDisponiveis}
              onChange={setFiltros}
              onSubmit={() => setAplicados(filtros)}
              onReset={limparTudo}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {banner}

        {/* Chips de Filtros Ativos */}
        {tagsAtivas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-slate-200 rounded-md">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mr-1">
              <Filter className="h-3.5 w-3.5 text-brand" /> Filtros ativos:
            </span>
            {tagsAtivas.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
              >
                {tag.label}
                <button
                  type="button"
                  onClick={() => removerFiltro(tag.id, tag.valor)}
                  className="text-slate-400 hover:text-slate-700 ml-0.5"
                  title="Remover filtro"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={limparTudo}
              className="text-xs text-brand font-semibold hover:underline ml-auto"
            >
              Limpar todos
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          <section id="editais" aria-labelledby="editais-titulo" className="scroll-mt-20">
            <div className="flex items-end justify-between border-b-2 border-brand pb-2 mb-4">
              <h2 id="editais-titulo" className="font-serif text-xl md:text-2xl font-bold text-slate-900">
                Editais em Destaque
              </h2>
              <p className="text-sm text-slate-600" aria-live="polite">
                {resultado.length} {resultado.length === 1 ? "edital encontrado" : "editais encontrados"}
              </p>
            </div>

            {resultado.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-md p-8 text-center space-y-3">
                <p className="font-semibold text-slate-800 text-base">
                  Nenhum edital encontrado com os filtros selecionados.
                </p>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Tente alterar a cidade, a escolaridade ou o estado selecionado.
                </p>
                <button
                  type="button"
                  onClick={limparTudo}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-md hover:bg-navy transition-colors"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {resultado.map((e) => (
                  <EditalCard key={e.id} edital={e} whatsappUrl={whatsappUrl} />
                ))}
              </div>
            )}
          </section>

          <div className="lg:sticky lg:top-24">{sidebar}</div>
        </div>
      </div>
    </>
  );
}
