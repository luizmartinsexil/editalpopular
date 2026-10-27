"use client";

import { btnDanger } from "@/components/admin/ui";

export default function ExcluirButton({ mensagem }: { mensagem: string }) {
  return (
    <button
      type="submit"
      className={btnDanger}
      onClick={(e) => {
        if (!confirm(mensagem)) e.preventDefault();
      }}
    >
      Excluir
    </button>
  );
}
