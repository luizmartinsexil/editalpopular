import type { ReactNode } from "react";

export const inputCls =
  "w-full h-10 bg-white border border-slate-300 rounded-md px-3 text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
export const textareaCls =
  "w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 bg-brand hover:bg-navy text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors";
export const btnGhost =
  "inline-flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-md transition-colors";
export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-700 text-sm font-medium px-3 py-1.5 rounded-md transition-colors";

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700 mb-1">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function PublicadoBadge({ publicado }: { publicado: boolean }) {
  return publicado ? (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-sm border bg-emerald-50 text-emerald-800 border-emerald-200">
      Publicado
    </span>
  ) : (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-sm border bg-slate-100 text-slate-600 border-slate-200">
      Rascunho
    </span>
  );
}

export function PageTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <h1 className="font-serif text-2xl font-bold text-slate-900">{children}</h1>
      {action}
    </div>
  );
}
