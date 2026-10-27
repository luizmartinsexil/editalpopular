import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "data", "uploads", "documentos");
export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

const MIMES: Record<string, string> = {
  pdf: "application/pdf",
  zip: "application/zip",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export const NOME_DOCUMENTO_VALIDO = /^[0-9a-f-]{36}\.(pdf|zip|doc|docx)$/i;

export function mimeDocumento(nome: string): string {
  const ext = nome.split(".").pop()?.toLowerCase() ?? "";
  return MIMES[ext] ?? "application/octet-stream";
}

export function formatTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Salva o arquivo enviado e retorna o nome do arquivo gerado e tamanho formatado. */
export async function salvarDocumento(
  file: File,
): Promise<{ nome: string; tamanho: string } | { erro: string }> {
  if (file.size > MAX_FILE_BYTES) {
    return { erro: "O arquivo excede o limite máximo de 25 MB." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!MIMES[ext]) {
    return { erro: "Formato não suportado. Envie arquivos PDF, ZIP ou DOCX." };
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const nome = `${randomUUID()}.${ext}`;

  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, nome), buf);

  return { nome, tamanho: formatTamanho(file.size) };
}

export async function lerDocumento(nome: string): Promise<Buffer | null> {
  if (!NOME_DOCUMENTO_VALIDO.test(nome)) return null;
  try {
    return await fs.readFile(path.join(DIR, nome));
  } catch {
    return null;
  }
}

export async function removerDocumento(nome?: string) {
  if (!nome || !NOME_DOCUMENTO_VALIDO.test(nome)) return;
  await fs.rm(path.join(DIR, nome), { force: true });
}
