import { BellRing } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function WhatsAppBanner({ whatsappUrl }: { whatsappUrl: string }) {
  return (
    <section
      aria-labelledby="wpp-titulo"
      className="bg-white border border-slate-200 border-l-4 border-l-[#25D366] rounded-md p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4"
    >
      <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#25D366] text-white">
        <WhatsAppIcon className="h-7 w-7" />
      </div>
      <div className="flex-1">
        <h2 id="wpp-titulo" className="text-base md:text-lg font-bold text-slate-900">
          Receba alertas de abertura de inscrições da sua cidade diretamente no celular
        </h2>
        <p className="mt-1 text-sm text-slate-600 flex items-center gap-1.5">
          <BellRing className="h-4 w-4 text-[#128C7E]" aria-hidden="true" />
          Grupo regional gratuito. Somente avisos de editais, sem spam e sem conversa paralela.
        </p>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors whitespace-nowrap"
      >
        <WhatsAppIcon />
        Entrar no Grupo
      </a>
    </section>
  );
}
