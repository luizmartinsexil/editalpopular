import EditaisExplorer from "@/components/EditaisExplorer";
import NoticiasLateral from "@/components/NoticiasLateral";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import { getConfiguracoes, listEditais, listNoticias } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [editais, noticias, { whatsappUrl }] = await Promise.all([
    listEditais({ somentePublicados: true }),
    listNoticias({ somentePublicadas: true }),
    getConfiguracoes(),
  ]);

  return (
    <EditaisExplorer
      editais={editais}
      whatsappUrl={whatsappUrl}
      banner={<WhatsAppBanner whatsappUrl={whatsappUrl} />}
      sidebar={<NoticiasLateral noticias={noticias.slice(0, 8)} />}
    />
  );
}
