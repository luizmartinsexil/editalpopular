import Link from "next/link";

const col = (titulo: string, links: { label: string; href: string }[]) => (
  <div>
    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{titulo}</h3>
    <ul className="space-y-2 text-sm">
      {links.map((l) => (
        <li key={l.label}>
          <Link href={l.href} className="text-slate-300 hover:text-white hover:underline">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300 mt-12 border-t-4 border-brand">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/logo.png"
              alt="Edital Popular"
              className="h-10 w-auto object-contain rounded bg-white/10 p-0.5"
            />
            <p className="font-serif text-xl font-bold text-white">Edital Popular</p>
          </div>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Portal de utilidade pública com notícias de concursos, editais de prefeituras e processos
            seletivos regionais.
          </p>
        </div>
        {col("Navegação", [
          { label: "Início", href: "/" },
          { label: "Concursos Abertos", href: "/#editais" },
          { label: "Grupos no WhatsApp", href: "/grupos" },
          { label: "Notícias", href: "/#noticias" },
        ])}
        {col("Institucional", [
          { label: "Sobre o portal", href: "#" },
          { label: "Contato", href: "#" },
          { label: "Enviar edital", href: "#" },
        ])}
        {col("Legal", [
          { label: "Política de Privacidade", href: "#" },
          { label: "Termos de Utilidade Pública", href: "#" },
        ])}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Aviso de responsabilidade:</strong> o Edital Popular é um
          portal independente e não possui vínculo com órgãos públicos ou bancas organizadoras. As
          informações são compiladas de fontes oficiais, mas podem sofrer retificações. Consulte
          sempre o edital completo e o Diário Oficial antes de efetuar sua inscrição.
          © {new Date().getFullYear()} Edital Popular.
        </p>
      </div>
    </footer>
  );
}
