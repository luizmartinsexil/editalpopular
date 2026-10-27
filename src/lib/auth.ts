import { createHmac, createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "ep_admin";
const DURACAO_S = 60 * 60 * 8;

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET ausente ou curto demais (.env.local).");
  return s;
}

const assinar = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");

function iguais(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function credenciaisValidas(usuario: string, senha: string): boolean {
  const u = process.env.ADMIN_USER;
  const p = process.env.ADMIN_PASSWORD;
  if (!u || !p) return false;
  // avalia ambos para não vazar qual campo errou
  const okU = iguais(usuario, u);
  const okP = iguais(senha, p);
  return okU && okP;
}

export async function criarSessao() {
  const exp = String(Math.floor(Date.now() / 1000) + DURACAO_S);
  (await cookies()).set(COOKIE, `${exp}.${assinar(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_S,
  });
}

export async function encerrarSessao() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [exp, sig] = v.split(".");
  if (!exp || !sig || !iguais(sig, assinar(exp))) return false;
  return Number(exp) > Date.now() / 1000;
}

/** Chame no início de toda página e server action do painel. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
