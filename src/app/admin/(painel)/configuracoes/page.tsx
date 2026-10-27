import { salvarConfiguracoesAction } from "@/app/admin/actions";
import { Field, PageTitle, btnPrimary, inputCls } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getConfiguracoes } from "@/lib/store";

export default async function Configuracoes({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; ok?: string }>;
}) {
  await requireAdmin();
  const { erro, ok } = await searchParams;
  const cfg = await getConfiguracoes();

  return (
    <>
      <PageTitle>Configurações</PageTitle>
      {ok && (
        <p role="status" className="mb-4 text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 rounded px-3 py-2">
          Configurações salvas.
        </p>
      )}
      {erro && (
        <p role="alert" className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 rounded px-3 py-2">
          Informe um link válido do WhatsApp (https://chat.whatsapp.com/…).
        </p>
      )}
      <form action={salvarConfiguracoesAction} className="bg-white border border-slate-200 rounded-md p-5 space-y-4 max-w-xl">
        <Field label="Link do grupo de WhatsApp" htmlFor="whatsappUrl" hint="Usado no cabeçalho, no banner e nos compartilhamentos.">
          <input id="whatsappUrl" name="whatsappUrl" required defaultValue={cfg.whatsappUrl} className={inputCls} />
        </Field>
        <button type="submit" className={btnPrimary}>
          Salvar
        </button>
      </form>
    </>
  );
}
