import { lerDocumento, mimeDocumento } from "@/lib/arquivos";

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const dados = await lerDocumento(file);
  if (!dados) return new Response("Arquivo não encontrado", { status: 404 });

  const mime = mimeDocumento(file);
  const isPdf = mime === "application/pdf";

  return new Response(new Uint8Array(dados), {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": isPdf ? `inline; filename="${file}"` : `attachment; filename="${file}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
