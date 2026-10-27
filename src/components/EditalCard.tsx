import { CalendarClock, ExternalLink, GraduationCap, MapPin, Users, Wallet } from "lucide-react";
import OrgaoLogo from "@/components/OrgaoLogo";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { diasRestantes, formatDate, formatSalario, whatsappShareUrl } from "@/lib/format";
import type { Edital, StatusEdital } from "@/types";

const statusStyle: Record<StatusEdital, string> = {
  "Inscrições Abertas": "bg-emerald-50 text-emerald-800 border-emerald-200",
  Previsto: "bg-amber-50 text-amber-800 border-amber-200",
  Retificado: "bg-blue-50 text-blue-800 border-blue-200",
  Encerrado: "bg-slate-100 text-slate-600 border-slate-200",
};

function Prazo({ edital }: { edital: Edital }) {
  if (edital.status === "Previsto") {
    return (
      <p className="text-sm text-slate-600">
        Inscrições previstas a partir de{" "}
        <strong className="text-slate-800">{formatDate(edital.inscricaoInicio)}</strong>
      </p>
    );
  }
  const dias = diasRestantes(edital.inscricaoFim);
  const urgente = dias >= 0 && dias <= 7;
  const aviso =
    dias < 0 ? "Prazo encerrado" : dias === 0 ? "Último dia!" : `Faltam ${dias} dia${dias > 1 ? "s" : ""}`;
  return (
    <p className="text-sm text-slate-600 flex flex-wrap items-center gap-x-2">
      <span>
        Inscrições até <strong className="text-slate-800">{formatDate(edital.inscricaoFim)}</strong>
      </span>
      <span
        className={`text-xs font-bold px-1.5 py-0.5 rounded-sm ${
          urgente ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
        }`}
      >
        {aviso}
      </span>
    </p>
  );
}

function Dado({ icon: Icon, label, valor }: { icon: typeof Users; label: string; valor: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-[11px] uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="text-sm font-semibold text-slate-800">{valor}</dd>
      </div>
    </div>
  );
}

export default function EditalCard({ edital, whatsappUrl }: { edital: Edital; whatsappUrl: string }) {
  return (
    <article className="bg-white border border-slate-200 rounded-md flex flex-col hover:border-slate-300 transition-colors">
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 border rounded-sm ${statusStyle[edital.status]}`}
          >
            {edital.status}
          </span>
          <span className="text-xs text-slate-500">{edital.categoria}</span>
        </div>

        <div className="flex items-start gap-3">
          <OrgaoLogo nome={edital.orgao} logo={edital.logo} />
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-800 leading-snug">{edital.orgao}</h3>
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">{edital.cargos.join(" · ")}</p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-slate-100 pt-4">
          <Dado icon={Wallet} label="Salário" valor={formatSalario(edital)} />
          <Dado
            icon={Users}
            label="Vagas"
            valor={`${edital.vagas}${edital.cadastroReserva ? " + CR" : ""}`}
          />
          <Dado icon={GraduationCap} label="Escolaridade" valor={edital.escolaridade.join(" / ")} />
          <Dado icon={MapPin} label="Localidade" valor={edital.cidade ? `${edital.cidade}/${edital.uf}` : edital.uf} />
        </dl>

        <div className="mt-4 flex items-start gap-2 bg-slate-50 border border-slate-200 rounded px-3 py-2">
          <CalendarClock className="h-4 w-4 mt-0.5 text-slate-500 shrink-0" aria-hidden="true" />
          <Prazo edital={edital} />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 p-3 bg-slate-50/60">
        <a
          href={`/editais/${edital.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-brand hover:bg-navy text-white text-sm font-semibold px-3 py-2 rounded-md transition-colors"
        >
          Ver Detalhes do Edital
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={whatsappShareUrl(edital, whatsappUrl)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartilhar ${edital.orgao} no WhatsApp`}
          title="Compartilhar no WhatsApp"
          className="inline-flex items-center justify-center bg-white border border-slate-300 hover:border-[#128C7E] hover:text-[#128C7E] text-slate-600 p-2 rounded-md transition-colors"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </div>
    </article>
  );
}
