"use client";

import { useState } from "react";
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type {
  CategoriaEdital,
  Escolaridade,
  FiltrosEdital,
  OrdenacaoEdital,
  StatusEdital,
} from "@/types";

const niveis: Escolaridade[] = ["Fundamental", "Médio", "Técnico", "Superior"];

const statusLista: StatusEdital[] = [
  "Inscrições Abertas",
  "Previsto",
  "Retificado",
  "Encerrado",
];

const categorias: CategoriaEdital[] = ["Concurso Público", "Processo Seletivo"];

const ufs = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const faixasSalario = [
  { label: "Qualquer valor", valor: 0 },
  { label: "A partir de R$ 2.000", valor: 2000 },
  { label: "A partir de R$ 4.000", valor: 4000 },
  { label: "A partir de R$ 7.000", valor: 7000 },
  { label: "A partir de R$ 10.000", valor: 10000 },
  { label: "A partir de R$ 15.000", valor: 15000 },
];

const ordenacoes: { label: string; valor: OrdenacaoEdital }[] = [
  { label: "Mais recentes", valor: "recentes" },
  { label: "Prazo encerrando antes", valor: "prazo" },
  { label: "Maior salário", valor: "salario" },
  { label: "Mais vagas", valor: "vagas" },
];

const fieldCls =
  "w-full h-11 bg-white border border-slate-300 rounded-md px-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all";

interface Props {
  value: FiltrosEdital;
  cidadesDisponiveis: string[];
  onChange: (f: FiltrosEdital) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export default function SearchFilter({
  value,
  cidadesDisponiveis,
  onChange,
  onSubmit,
  onReset,
}: Props) {
  const [expandido, setExpandido] = useState(false);

  // Conta quantos filtros avançados estão ativos
  const filtrosAvancadosAtivos = [
    Boolean(value.cidade),
    Boolean(value.status),
    Boolean(value.categoria),
    value.salarioMinimo > 0,
    value.ordenacao !== "recentes",
  ].filter(Boolean).length;

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-3"
    >
      {/* Linha principal */}
      <div className="grid gap-2.5 md:grid-cols-[1fr_180px_160px_auto_auto]">
        <div>
          <label htmlFor="busca" className="sr-only">
            Buscar por cargo, prefeitura ou cidade
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              id="busca"
              type="search"
              value={value.termo}
              onChange={(e) => onChange({ ...value, termo: e.target.value })}
              placeholder="Cargo, órgão, prefeitura ou cidade..."
              className={`${fieldCls} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="escolaridade" className="sr-only">
            Escolaridade
          </label>
          <select
            id="escolaridade"
            value={value.escolaridade}
            onChange={(e) =>
              onChange({
                ...value,
                escolaridade: e.target.value as FiltrosEdital["escolaridade"],
              })
            }
            className={fieldCls}
          >
            <option value="">Escolaridade (todas)</option>
            {niveis.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="uf" className="sr-only">
            Estado
          </label>
          <select
            id="uf"
            value={value.uf}
            onChange={(e) => onChange({ ...value, uf: e.target.value, cidade: "" })}
            className={fieldCls}
          >
            <option value="">Estado (todos)</option>
            {ufs.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className={`h-11 px-3.5 border rounded-md text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
            expandido || filtrosAvancadosAtivos > 0
              ? "bg-slate-100 border-slate-300 text-slate-800"
              : "bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
          title="Filtros adicionais incluindo Cidade"
        >
          <SlidersHorizontal className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span className="hidden sm:inline">Mais Filtros</span>
          {filtrosAvancadosAtivos > 0 && (
            <span className="h-5 min-w-5 px-1.5 flex items-center justify-center text-xs font-bold rounded-full bg-brand text-white">
              {filtrosAvancadosAtivos}
            </span>
          )}
        </button>

        <button
          type="submit"
          className="h-11 px-6 bg-brand hover:bg-navy text-white text-sm font-semibold rounded-md transition-colors whitespace-nowrap shadow-sm"
        >
          Buscar Editais
        </button>
      </div>

      {/* Painel de Filtros Avançados Expansível */}
      {expandido && (
        <div className="pt-3 mt-3 border-t border-slate-200/80 grid gap-3 sm:grid-cols-2 md:grid-cols-5 bg-slate-50/70 p-3.5 rounded-md border border-slate-200">
          {/* Novo Filtro de Cidade */}
          <div>
            <label htmlFor="cidade" className="block text-xs font-semibold text-slate-600 mb-1">
              Cidade / Município
            </label>
            <select
              id="cidade"
              value={value.cidade}
              onChange={(e) => onChange({ ...value, cidade: e.target.value })}
              className={fieldCls}
            >
              <option value="">Todas as cidades</option>
              {cidadesDisponiveis.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-slate-600 mb-1">
              Situação do Edital
            </label>
            <select
              id="status"
              value={value.status}
              onChange={(e) =>
                onChange({
                  ...value,
                  status: e.target.value as FiltrosEdital["status"],
                })
              }
              className={fieldCls}
            >
              <option value="">Todas as situações</option>
              {statusLista.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="categoria" className="block text-xs font-semibold text-slate-600 mb-1">
              Tipo de Seleção
            </label>
            <select
              id="categoria"
              value={value.categoria}
              onChange={(e) =>
                onChange({
                  ...value,
                  categoria: e.target.value as FiltrosEdital["categoria"],
                })
              }
              className={fieldCls}
            >
              <option value="">Concursos e Processos</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="salario" className="block text-xs font-semibold text-slate-600 mb-1">
              Faixa Salarial
            </label>
            <select
              id="salario"
              value={value.salarioMinimo}
              onChange={(e) =>
                onChange({ ...value, salarioMinimo: Number(e.target.value) })
              }
              className={fieldCls}
            >
              {faixasSalario.map((f) => (
                <option key={f.valor} value={f.valor}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ordenacao" className="block text-xs font-semibold text-slate-600 mb-1">
              Ordenar Resultados
            </label>
            <select
              id="ordenacao"
              value={value.ordenacao}
              onChange={(e) =>
                onChange({
                  ...value,
                  ordenacao: e.target.value as FiltrosEdital["ordenacao"],
                })
              }
              className={fieldCls}
            >
              {ordenacoes.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 md:col-span-5 flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Personalize sua busca por município ou carreira para encontrar as oportunidades certas.
            </span>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Limpar todos os filtros
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
