import type { Edital } from "@/types";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatBRL = (v: number) => brl.format(v);

export function formatSalario(e: Edital): string {
  return e.salarioMin === e.salarioMax
    ? formatBRL(e.salarioMax)
    : `até ${formatBRL(e.salarioMax)}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR");
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Dias restantes até a data (inclusive hoje = 0). Negativo se passou. */
export function diasRestantes(iso: string, hoje: Date = new Date()): number {
  const [y, m, d] = iso.split("-").map(Number);
  const alvo = new Date(y, m - 1, d).getTime();
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime();
  return Math.round((alvo - base) / 86400000);
}

export function whatsappShareUrl(
  e: Edital,
  groupUrl: string,
  origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://editalpopular.com.br",
): string {
  const texto =
    `📢 *${e.orgao}* — ${e.categoria}\n` +
    `Vagas: ${e.vagas} | Salário ${formatSalario(e)}\n` +
    `Inscrições até ${formatDate(e.inscricaoFim)}\n` +
    `Detalhes: ${origin}/editais/${e.slug}\n\n` +
    `Receba alertas no grupo: ${groupUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}
