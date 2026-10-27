import { promises as fs } from "fs";
import path from "path";
import {
  editais as seedEditais,
  gruposSeed,
  noticias as seedNoticias,
  WHATSAPP_GROUP_URL,
} from "@/data/mock";
import type { Configuracoes, Edital, GrupoWhatsApp, Noticia, TipoGrupoWhatsApp } from "@/types";

interface DB {
  editais: Edital[];
  noticias: Noticia[];
  grupos: GrupoWhatsApp[];
  configuracoes: Configuracoes;
}

const FILE = path.join(process.cwd(), "data", "db.json");

async function read(): Promise<DB> {
  try {
    const raw = JSON.parse(await fs.readFile(FILE, "utf-8")) as Partial<DB>;
    let alterado = false;
    const db: DB = {
      editais: raw.editais ?? seedEditais.map((e) => ({ ...e, publicado: true })),
      noticias: raw.noticias ?? seedNoticias.map((n) => ({ ...n, publicado: true })),
      grupos: raw.grupos ?? gruposSeed,
      configuracoes: raw.configuracoes ?? { whatsappUrl: WHATSAPP_GROUP_URL },
    };

    if (!raw.grupos) {
      alterado = true;
    }

    if (alterado) {
      await write(db);
    }

    return db;
  } catch {
    const db: DB = {
      editais: seedEditais.map((e) => ({ ...e, publicado: true })),
      noticias: seedNoticias.map((n) => ({ ...n, publicado: true })),
      grupos: gruposSeed,
      configuracoes: { whatsappUrl: WHATSAPP_GROUP_URL },
    };
    await write(db);
    return db;
  }
}

async function write(db: DB) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf-8");
}

// ---- Editais ----
export async function listEditais(opts: { somentePublicados?: boolean } = {}) {
  const { editais } = await read();
  const lista = opts.somentePublicados ? editais.filter((e) => e.publicado) : editais;
  return [...lista].sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
}

export async function getEdital(id: string) {
  return (await read()).editais.find((e) => e.id === id);
}

export async function getEditalPublicadoPorSlug(slug: string) {
  return (await read()).editais.find((e) => e.slug === slug && e.publicado);
}

export async function saveEdital(edital: Edital) {
  const db = await read();
  const i = db.editais.findIndex((e) => e.id === edital.id);
  if (i >= 0) db.editais[i] = edital;
  else db.editais.push(edital);
  await write(db);
}

export async function deleteEdital(id: string) {
  const db = await read();
  db.editais = db.editais.filter((e) => e.id !== id);
  await write(db);
}

// ---- Notícias ----
export async function listNoticias(opts: { somentePublicadas?: boolean } = {}) {
  const { noticias } = await read();
  const lista = opts.somentePublicadas ? noticias.filter((n) => n.publicado) : noticias;
  return [...lista].sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
}

export async function getNoticia(id: string) {
  return (await read()).noticias.find((n) => n.id === id);
}

export async function saveNoticia(noticia: Noticia) {
  const db = await read();
  const i = db.noticias.findIndex((n) => n.id === noticia.id);
  if (i >= 0) db.noticias[i] = noticia;
  else db.noticias.push(noticia);
  await write(db);
}

export async function deleteNoticia(id: string) {
  const db = await read();
  db.noticias = db.noticias.filter((n) => n.id !== id);
  await write(db);
}

// ---- Grupos de WhatsApp ----
export async function listGrupos(opts: { somenteAtivos?: boolean; tipo?: TipoGrupoWhatsApp } = {}) {
  const { grupos } = await read();
  let lista = grupos;
  if (opts.somenteAtivos) lista = lista.filter((g) => g.ativo);
  if (opts.tipo) lista = lista.filter((g) => g.tipo === opts.tipo);
  return lista;
}

export async function getGrupo(id: string) {
  return (await read()).grupos.find((g) => g.id === id);
}

export async function saveGrupo(grupo: GrupoWhatsApp) {
  const db = await read();
  const i = db.grupos.findIndex((g) => g.id === grupo.id);
  if (i >= 0) db.grupos[i] = grupo;
  else db.grupos.push(grupo);
  await write(db);
}

export async function deleteGrupo(id: string) {
  const db = await read();
  db.grupos = db.grupos.filter((g) => g.id !== id);
  await write(db);
}

// ---- Configurações ----
export async function getConfiguracoes(): Promise<Configuracoes> {
  return (await read()).configuracoes;
}

export async function saveConfiguracoes(c: Configuracoes) {
  const db = await read();
  db.configuracoes = c;
  await write(db);
}
