import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listEditais, listGrupos, listNoticias } from "@/lib/store";
import { PageTitle, btnGhost, btnPrimary } from "@/components/admin/ui";

export default async function Painel() {
  await requireAdmin();
  const [editais, noticias, grupos] = await Promise.all([
    listEditais(),
    listNoticias(),
    listGrupos(),
  ]);

  const cards = [
    { titulo: "Editais publicados", valor: editais.filter((e) => e.publicado).length },
    { titulo: "Editais em rascunho", valor: editais.filter((e) => !e.publicado).length },
    { titulo: "Notícias publicadas", valor: noticias.filter((n) => n.publicado).length },
    { titulo: "Grupos WhatsApp ativos", valor: grupos.filter((g) => g.ativo).length },
  ];

  return (
    <>
      <PageTitle>Painel Geral</PageTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.titulo} className="bg-white border border-slate-200 rounded-md p-4">
            <p className="text-3xl font-bold text-slate-900">{c.valor}</p>
            <p className="text-sm text-slate-600">{c.titulo}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/editais/novo" className={btnPrimary}>
          + Novo edital
        </Link>
        <Link href="/admin/noticias/novo" className={btnPrimary}>
          + Nova notícia
        </Link>
        <Link href="/admin/grupos/novo" className={btnGhost}>
          + Novo grupo WhatsApp
        </Link>
      </div>
    </>
  );
}
