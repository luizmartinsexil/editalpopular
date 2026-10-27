import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { loginAction } from "@/app/admin/actions";
import { Field, btnPrimary, inputCls } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { erro } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm bg-white border border-slate-200 border-t-4 border-t-brand rounded-md p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Edital Popular"
            className="h-12 w-auto object-contain rounded"
          />
          <div>
            <p className="font-serif text-2xl font-bold text-navy leading-tight">Edital Popular</p>
            <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Acesso restrito à administração
            </p>
          </div>
        </div>

        {erro && (
          <p role="alert" className="text-sm bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2">
            Usuário ou senha inválidos.
          </p>
        )}

        <Field label="Usuário" htmlFor="usuario">
          <input id="usuario" name="usuario" autoComplete="username" required className={inputCls} />
        </Field>
        <Field label="Senha" htmlFor="senha">
          <input
            id="senha"
            name="senha"
            type="password"
            autoComplete="current-password"
            required
            className={inputCls}
          />
        </Field>
        <button type="submit" className={`${btnPrimary} w-full`}>
          Entrar
        </button>
      </form>
    </div>
  );
}
