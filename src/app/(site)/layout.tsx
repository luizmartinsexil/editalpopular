import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getConfiguracoes } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { whatsappUrl } = await getConfiguracoes();
  return (
    <div className="min-h-screen flex flex-col">
      <Header whatsappUrl={whatsappUrl} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
