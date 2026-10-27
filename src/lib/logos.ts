import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "data", "uploads");
export const MAX_BYTES = 1024 * 1024; // 1 MB

const TIPOS: Record<string, { ext: string; mime: string }> = {
  png: { ext: "png", mime: "image/png" },
  jpg: { ext: "jpg", mime: "image/jpeg" },
  webp: { ext: "webp", mime: "image/webp" },
};

/** Identifica o formato pelos bytes (não confia no nome/tipo enviado). */
function detectar(buf: Buffer): keyof typeof TIPOS | null {
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}

export const NOME_VALIDO = /^[0-9a-f-]{36}\.(png|jpg|webp)$/;

export function mimeDe(nome: string): string {
  return TIPOS[nome.split(".").pop() ?? ""]?.mime ?? "application/octet-stream";
}

/** Salva o arquivo e devolve o nome, ou um erro legível. */
export async function salvarLogo(file: File): Promise<{ nome: string } | { erro: string }> {
  if (file.size > MAX_BYTES) return { erro: "A logo deve ter no máximo 1 MB." };
  const buf = Buffer.from(await file.arrayBuffer());
  const tipo = detectar(buf);
  if (!tipo) return { erro: "Formato inválido. Use PNG, JPG ou WebP." };
  const nome = `${randomUUID()}.${TIPOS[tipo].ext}`;
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, nome), buf);
  return { nome };
}

export async function lerLogo(nome: string): Promise<Buffer | null> {
  if (!NOME_VALIDO.test(nome)) return null;
  try {
    return await fs.readFile(path.join(DIR, nome));
  } catch {
    return null;
  }
}

export async function removerLogo(nome?: string) {
  if (!nome || !NOME_VALIDO.test(nome)) return;
  await fs.rm(path.join(DIR, nome), { force: true });
}
