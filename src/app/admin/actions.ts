"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { credenciaisValidas, criarSessao, encerrarSessao, requireAdmin } from "@/lib/auth";
import * as store from "@/lib/store";
import { removerLogo, salvarLogo } from "@/lib/logos";
import { removerDocumento, salvarDocumento } from "@/lib/arquivos";
import type {
  Anexo,
  CategoriaEdital,
  CategoriaNoticia,
  Edital,
  Escolaridade,
  GrupoWhatsApp,
  Noticia,
  ProvaAnterior,
  StatusEdital,
  TipoGrupoWhatsApp,
} from "@/types";

const REGIOES: Record<string, string> = {
  AC: "Norte", AP: "Norte", AM: "Norte", PA: "Norte", RO: "Norte", RR: "Norte", TO: "Norte",
  AL: "Nordeste", BA: "Nordeste", CE: "Nordeste", MA: "Nordeste", PB: "Nordeste",
  PE: "Nordeste", PI: "Nordeste", RN: "Nordeste", SE: "Nordeste",
  DF: "Centro-Oeste", GO: "Centro-Oeste", MT: "Centro-Oeste", MS: "Centro-Oeste",
  ES: "Sudeste", MG: "Sudeste", RJ: "Sudeste", SP: "Sudeste",
  PR: "Sul", RS: "Sul", SC: "Sul",
};

const NIVEIS: Escolaridade[] = ["Fundamental", "Médio", "Técnico", "Superior"];
const STATUS: StatusEdital[] = ["Inscrições Abertas", "Previsto", "Retificado", "Encerrado"];
const CATEGORIAS_EDITAL: CategoriaEdital[] = ["Concurso Público", "Processo Seletivo"];
const CATEGORIAS_NOTICIA: CategoriaNoticia[] = [
  "Convocação", "Comunicado da Banca", "Retificação", "Resultado", "Gabarito", "Geral",
];

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const num = (f: FormData, k: string) => {
  const n = Number(str(f, k).replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const oneOf = <T extends string>(v: string, lista: readonly T[], padrao: T): T =>
  (lista as readonly string[]).includes(v) ? (v as T) : padrao;

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/** Só aceita http(s) ou caminho interno; bloqueia javascript: e afins. */
function urlSegura(u: string): string {
  if (u === "#" || u.startsWith("/")) return u;
  try {
    const p = new URL(u);
    return p.protocol === "http:" || p.protocol === "https:" ? p.toString() : "#";
  } catch {
    return "#";
  }
}

function parseAnexos(texto: string): Anexo[] {
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [titulo, url = "#", tamanho] = l.split("|").map((p) => p.trim());
      return { titulo, url: urlSegura(url), tamanho: tamanho || undefined };
    })
    .filter((a) => a.titulo);
}

function parseProvas(texto: string): ProvaAnterior[] {
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      // Formato: Título | Link | Ano | Com Gabarito (sim/não)
      const [titulo, url = "#", ano, gabarito] = l.split("|").map((p) => p.trim());
      return {
        id: randomUUID(),
        titulo,
        url: urlSegura(url),
        ano: ano && !isNaN(Number(ano)) ? Number(ano) : undefined,
        temGabarito: gabarito ? !/^(nao|não|no|false|0)$/i.test(gabarito) : true,
      };
    })
    .filter((p) => p.titulo);
}

const hoje = () => new Date().toISOString().slice(0, 10);

// ---------- Sessão ----------
export async function loginAction(formData: FormData) {
  const ok = credenciaisValidas(str(formData, "usuario"), String(formData.get("senha") ?? ""));
  if (!ok) redirect("/admin/login?erro=1");
  await criarSessao();
  redirect("/admin");
}

export async function logoutAction() {
  await encerrarSessao();
  redirect("/admin/login");
}

// ---------- Editais ----------
export async function salvarEditalAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const existente = id ? await store.getEdital(id) : undefined;

  const orgao = str(formData, "orgao");
  const uf = str(formData, "uf").toUpperCase();
  if (!orgao || !REGIOES[uf]) redirect(`/admin/editais/${id || "novo"}?erro=1`);

  const novoId = existente?.id ?? randomUUID();

  let logo = existente?.logo;
  const arquivo = formData.get("logo");
  if (arquivo instanceof File && arquivo.size > 0) {
    const r = await salvarLogo(arquivo);
    if ("erro" in r) redirect(`/admin/editais/${id || "novo"}?erro=${encodeURIComponent(r.erro)}`);
    await removerLogo(logo);
    logo = r.nome;
  } else if (formData.get("removerLogo") === "on") {
    await removerLogo(logo);
    logo = undefined;
  }

  // Anexos base digitados
  const anexos = parseAnexos(str(formData, "anexos"));

  // Upload direto de arquivo de edital
  const uploadEdital = formData.get("uploadEdital");
  if (uploadEdital instanceof File && uploadEdital.size > 0) {
    const r = await salvarDocumento(uploadEdital);
    if ("erro" in r) redirect(`/admin/editais/${id || "novo"}?erro=${encodeURIComponent(r.erro)}`);
    anexos.unshift({
      titulo: str(formData, "uploadEditalTitulo") || uploadEdital.name,
      url: `/arquivos/${r.nome}`,
      tamanho: r.tamanho,
    });
  }

  // Provas anteriores digitadas
  const provasAnteriores = parseProvas(str(formData, "provasAnteriores"));

  // Upload direto de caderno de prova anterior
  const uploadProva = formData.get("uploadProva");
  if (uploadProva instanceof File && uploadProva.size > 0) {
    const r = await salvarDocumento(uploadProva);
    if ("erro" in r) redirect(`/admin/editais/${id || "novo"}?erro=${encodeURIComponent(r.erro)}`);
    provasAnteriores.unshift({
      id: randomUUID(),
      titulo: str(formData, "uploadProvaTitulo") || `Caderno de Prova — ${uploadProva.name}`,
      url: `/arquivos/${r.nome}`,
      ano: Number(str(formData, "uploadProvaAno")) || new Date().getFullYear() - 1,
      temGabarito: true,
    });
  }

  const edital: Edital = {
    id: novoId,
    slug: existente?.slug ?? `${slugify(orgao)}-${novoId.slice(0, 6)}`,
    orgao,
    logo,
    cidade: str(formData, "cidade"),
    uf,
    regiao: REGIOES[uf],
    banca: str(formData, "banca"),
    categoria: oneOf(str(formData, "categoria"), CATEGORIAS_EDITAL, "Concurso Público"),
    status: oneOf(str(formData, "status"), STATUS, "Inscrições Abertas"),
    publicado: formData.get("publicado") === "on",
    escolaridade: formData.getAll("escolaridade").map(String).filter((n): n is Escolaridade =>
      (NIVEIS as string[]).includes(n),
    ),
    cargos: str(formData, "cargos").split(/[\n,]/).map((c) => c.trim()).filter(Boolean),
    vagas: Math.floor(num(formData, "vagas")),
    cadastroReserva: formData.get("cadastroReserva") === "on",
    salarioMin: num(formData, "salarioMin"),
    salarioMax: num(formData, "salarioMax"),
    inscricaoInicio: str(formData, "inscricaoInicio"),
    inscricaoFim: str(formData, "inscricaoFim"),
    dataProva: str(formData, "dataProva") || undefined,
    publicadoEm: existente?.publicadoEm ?? hoje(),
    atualizadoEm: hoje(),
    resumo: str(formData, "resumo"),
    anexos,
    provasAnteriores,
    linkOficial: urlSegura(str(formData, "linkOficial") || "#"),
  };

  await store.saveEdital(edital);
  revalidatePath("/");
  redirect("/admin/editais");
}

export async function alternarEditalAction(formData: FormData) {
  await requireAdmin();
  const e = await store.getEdital(str(formData, "id"));
  if (e) await store.saveEdital({ ...e, publicado: !e.publicado, atualizadoEm: hoje() });
  revalidatePath("/");
  revalidatePath("/admin/editais");
}

export async function excluirEditalAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await removerLogo((await store.getEdital(id))?.logo);
  await store.deleteEdital(id);
  revalidatePath("/");
  revalidatePath("/admin/editais");
}

// ---------- Notícias ----------
export async function salvarNoticiaAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const existente = id ? await store.getNoticia(id) : undefined;

  const titulo = str(formData, "titulo");
  if (!titulo) redirect(`/admin/noticias/${id || "novo"}?erro=1`);

  const novoId = existente?.id ?? randomUUID();
  const noticia: Noticia = {
    id: novoId,
    slug: existente?.slug ?? `${slugify(titulo)}-${novoId.slice(0, 6)}`,
    titulo,
    resumo: str(formData, "resumo"),
    categoria: oneOf(str(formData, "categoria"), CATEGORIAS_NOTICIA, "Geral"),
    fonte: str(formData, "fonte"),
    publicado: formData.get("publicado") === "on",
    publicadoEm: existente?.publicadoEm ?? new Date().toISOString(),
    url: urlSegura(str(formData, "url") || "#"),
    anexos: parseAnexos(str(formData, "anexos")),
  };

  await store.saveNoticia(noticia);
  revalidatePath("/");
  redirect("/admin/noticias");
}

export async function alternarNoticiaAction(formData: FormData) {
  await requireAdmin();
  const n = await store.getNoticia(str(formData, "id"));
  if (n) await store.saveNoticia({ ...n, publicado: !n.publicado });
  revalidatePath("/");
  revalidatePath("/admin/noticias");
}

export async function excluirNoticiaAction(formData: FormData) {
  await requireAdmin();
  await store.deleteNoticia(str(formData, "id"));
  revalidatePath("/");
  revalidatePath("/admin/noticias");
}

// ---------- Configurações ----------
export async function salvarConfiguracoesAction(formData: FormData) {
  await requireAdmin();
  const url = str(formData, "whatsappUrl");
  if (!/^https:\/\/(chat\.whatsapp\.com|wa\.me|api\.whatsapp\.com)\//.test(url)) {
    redirect("/admin/configuracoes?erro=1");
  }
  await store.saveConfiguracoes({ whatsappUrl: url });
  revalidatePath("/", "layout");
  redirect("/admin/configuracoes?ok=1");
}

// ---------- Grupos de WhatsApp ----------
export async function salvarGrupoAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const existente = id ? await store.getGrupo(id) : undefined;

  const nome = str(formData, "nome");
  const link = str(formData, "link");
  const tipo = (str(formData, "tipo") === "area" ? "area" : "regional") as TipoGrupoWhatsApp;
  const uf = str(formData, "uf").toUpperCase();

  if (!nome || !link) {
    redirect(`/admin/grupos/${id || "novo"}?erro=1`);
  }

  const grupo: GrupoWhatsApp = {
    id: existente?.id ?? `g-${randomUUID().slice(0, 8)}`,
    nome,
    tipo,
    uf: tipo === "regional" && uf ? uf : undefined,
    regiao: tipo === "regional" && uf && REGIOES[uf] ? REGIOES[uf] : str(formData, "regiao") || undefined,
    area: tipo === "area" ? str(formData, "area") || undefined : undefined,
    descricao: str(formData, "descricao"),
    link: urlSegura(link),
    ativo: formData.get("ativo") === "on",
    membrosAprox: str(formData, "membrosAprox") || undefined,
  };

  await store.saveGrupo(grupo);
  revalidatePath("/grupos");
  revalidatePath("/admin/grupos");
  redirect("/admin/grupos");
}

export async function alternarGrupoAction(formData: FormData) {
  await requireAdmin();
  const g = await store.getGrupo(str(formData, "id"));
  if (g) await store.saveGrupo({ ...g, ativo: !g.ativo });
  revalidatePath("/grupos");
  revalidatePath("/admin/grupos");
}

export async function excluirGrupoAction(formData: FormData) {
  await requireAdmin();
  await store.deleteGrupo(str(formData, "id"));
  revalidatePath("/grupos");
  revalidatePath("/admin/grupos");
}
