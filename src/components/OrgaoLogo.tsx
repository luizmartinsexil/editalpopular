/* eslint-disable @next/next/no-img-element -- logos são servidas por rota própria, sem otimização */

const TAMANHOS = {
  sm: "h-12 w-12 text-sm",
  md: "h-20 w-20 text-xl",
  lg: "h-28 w-28 text-3xl",
};

function iniciais(nome: string) {
  const palavras = nome
    .replace(/\b(prefeitura|municipal|de|do|da|dos|das|estado|instituto|c[âa]mara)\b/gi, " ")
    .split(/\s+/)
    .filter(Boolean);
  return (palavras.length ? palavras : nome.split(/\s+/)).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

/** Logo do órgão; se não houver, mostra as iniciais para manter o alinhamento. */
export default function OrgaoLogo({
  nome,
  logo,
  size = "md",
}: {
  nome: string;
  logo?: string;
  size?: keyof typeof TAMANHOS;
}) {
  const base = `${TAMANHOS[size]} shrink-0 rounded-md border border-slate-200 bg-white flex items-center justify-center overflow-hidden`;
  if (logo) {
    return (
      <div className={`${base} p-1`}>
        <img src={`/logos/${logo}`} alt={`Logo ${nome}`} className="max-h-full max-w-full object-contain" />
      </div>
    );
  }
  return (
    <div className={`${base} bg-slate-100 font-serif font-bold text-slate-500`} aria-hidden="true">
      {iniciais(nome)}
    </div>
  );
}
