import { lerLogo, mimeDe } from "@/lib/logos";

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const dados = await lerLogo(file);
  if (!dados) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(dados), {
    headers: {
      "Content-Type": mimeDe(file),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
