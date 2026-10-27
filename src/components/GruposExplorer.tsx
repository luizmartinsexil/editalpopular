"use client";

import { useMemo, useState } from "react";
import { BellRing, CheckCircle2, Filter, MapPin, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import type { GrupoWhatsApp, TipoGrupoWhatsApp } from "@/types";

interface Props {
  grupos: GrupoWhatsApp[];
}

export default function GruposExplorer({ grupos }: Props) {
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | TipoGrupoWhatsApp>("todos");
  const [busca, setBusca] = useState("");
  const [ufFiltro, setUfFiltro] = useState("");

  // Lista de UFs presentes nos grupos
  const ufsDisponiveis = useMemo(() => {
    const set = new Set<string>();
    grupos.forEach((g) => {
      if (g.uf) set.add(g.uf);
    });
    return Array.from(set).sort();
  }, [grupos]);

  const filtrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return grupos.filter((g) => {
      if (tipoFiltro !== "todos" && g.tipo !== tipoFiltro) return false;
      if (ufFiltro && g.uf !== ufFiltro) return false;
      if (!termo) return true;
      const alvo = `${g.nome} ${g.descricao} ${g.area ?? ""} ${g.uf ?? ""} ${g.regiao ?? ""}`.toLowerCase();
      return alvo.includes(termo);
    });
  }, [grupos, tipoFiltro, ufFiltro, busca]);

  const totalRegionais = grupos.filter((g) => g.tipo === "regional").length;
  const totalAreas = grupos.filter((g) => g.tipo === "area").length;

  return (
    <div className="space-y-8">
      {/* Filtros e Abas */}
      <div className="bg-white border border-slate-200 rounded-md p-4 space-y-4">
        {/* Abas principais */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => {
              setTipoFiltro("todos");
              setUfFiltro("");
            }}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              tipoFiltro === "todos"
                ? "bg-navy text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Todos os Grupos ({grupos.length})
          </button>
          <button
            type="button"
            onClick={() => setTipoFiltro("regional")}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              tipoFiltro === "regional"
                ? "bg-navy text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Por Estado &amp; Região ({totalRegionais})
          </button>
          <button
            type="button"
            onClick={() => {
              setTipoFiltro("area");
              setUfFiltro("");
            }}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              tipoFiltro === "area"
                ? "bg-navy text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Por Área de Atuação ({totalAreas})
          </button>
        </div>

        {/* Linha de busca e filtro de estado */}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por estado, cidade ou área (ex: São Paulo, Saúde, Educação)..."
              className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-slate-300 rounded-md placeholder:text-slate-500 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {tipoFiltro !== "area" && ufsDisponiveis.length > 0 && (
            <select
              value={ufFiltro}
              onChange={(e) => setUfFiltro(e.target.value)}
              className="h-10 px-3 text-sm bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:border-brand"
            >
              <option value="">Todos os Estados</option>
              {ufsDisponiveis.map((uf) => (
                <option key={uf} value={uf}>
                  Estado: {uf}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Grid de Grupos */}
      {filtrados.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-md p-8 text-center space-y-3">
          <p className="font-semibold text-slate-800 text-base">
            Nenhum grupo encontrado com os filtros selecionados.
          </p>
          <button
            type="button"
            onClick={() => {
              setTipoFiltro("todos");
              setUfFiltro("");
              setBusca("");
            }}
            className="text-sm font-semibold text-brand hover:underline"
          >
            Limpar filtros e ver todos os grupos
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((g) => (
            <article
              key={g.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-md p-5 flex flex-col justify-between transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-sm border ${
                      g.tipo === "regional"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : "bg-purple-50 text-purple-800 border-purple-200"
                    }`}
                  >
                    {g.tipo === "regional" ? `Regional ${g.uf ? `• ${g.uf}` : ""}` : `Carreira • ${g.area ?? "Área"}`}
                  </span>
                  {g.membrosAprox && (
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Users className="h-3 w-3 text-slate-400" />
                      {g.membrosAprox}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {g.nome}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {g.descricao}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Gratuito &amp; Oficial
                </span>
                <a
                  href={g.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold text-xs px-3.5 py-2 rounded-md transition-colors"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  Entrar no Grupo
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
