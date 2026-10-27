import type { Metadata } from "next";
import { BellRing, CheckCircle, Shield, Sparkles } from "lucide-react";
import GruposExplorer from "@/components/GruposExplorer";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { listGrupos } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Grupos de WhatsApp — Concursos Regionais e Editais por Área | Edital Popular",
  description:
    "Entre nos grupos oficiais do WhatsApp do Edital Popular. Receba avisos imediatos de abertura de inscrições, retificações e editais do seu estado ou área de atuação.",
};

export default async function GruposPage() {
  const grupos = await listGrupos({ somenteAtivos: true });

  return (
    <div>
      {/* Topo / Hero */}
      <section className="bg-navy text-white border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold uppercase tracking-wider mb-4">
            <WhatsAppIcon className="h-3.5 w-3.5" /> Comunidades Oficiais
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            Receba Editais e Concursos no WhatsApp
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Escolha abaixo o canal do seu estado ou carreira de interesse. Alertas diários com links diretos para diários oficiais, sem spam e sem conversas paralelas.
          </p>

          {/* 3 Garantias de Utilidade Pública */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-md p-3.5 flex items-start gap-3">
              <Shield className="h-5 w-5 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">Fontes Oficiais</p>
                <p className="text-xs text-slate-300">Apenas editais publicados em diários oficiais e bancas confiáveis.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-md p-3.5 flex items-start gap-3">
              <BellRing className="h-5 w-5 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">Sem Spam</p>
                <p className="text-xs text-slate-300">Grupos fechados para conversas. Apenas administradores enviam notificações.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-md p-3.5 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">100% Gratuito</p>
                <p className="text-xs text-slate-300">Utilidade pública para você não perder prazos de inscrição da sua cidade.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo principal com os grupos */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between border-b-2 border-brand pb-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Canais por Estado &amp; Áreas Temáticas
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Clique em &quot;Entrar no Grupo&quot; para abrir diretamente o aplicativo no seu celular ou computador.
            </p>
          </div>
        </div>

        <GruposExplorer grupos={grupos} />
      </div>
    </div>
  );
}
