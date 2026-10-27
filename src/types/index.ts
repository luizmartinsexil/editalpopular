export type Escolaridade = "Fundamental" | "Médio" | "Técnico" | "Superior";

export type StatusEdital = "Inscrições Abertas" | "Previsto" | "Retificado" | "Encerrado";

export type CategoriaEdital = "Concurso Público" | "Processo Seletivo";

export interface Anexo {
  titulo: string;
  url: string;
  tamanho?: string;
}

export interface ProvaAnterior {
  id: string;
  titulo: string;
  ano?: number;
  banca?: string;
  cargo?: string;
  url: string;
  temGabarito?: boolean;
}

export interface Edital {
  id: string;
  slug: string;
  orgao: string;
  /** Nome do arquivo da logo enviada pelo admin (servida em /logos/<nome>). */
  logo?: string;
  cidade: string;
  uf: string;
  regiao: string;
  banca: string;
  categoria: CategoriaEdital;
  status: StatusEdital;
  publicado: boolean;
  escolaridade: Escolaridade[];
  cargos: string[];
  vagas: number;
  cadastroReserva: boolean;
  salarioMin: number;
  salarioMax: number;
  inscricaoInicio: string; // ISO date
  inscricaoFim: string; // ISO date
  dataProva?: string; // ISO date
  publicadoEm: string; // ISO date
  atualizadoEm: string; // ISO date
  resumo: string;
  anexos: Anexo[];
  provasAnteriores?: ProvaAnterior[];
  linkOficial: string;
}

export type CategoriaNoticia =
  | "Convocação"
  | "Comunicado da Banca"
  | "Retificação"
  | "Resultado"
  | "Gabarito"
  | "Geral";

export interface Noticia {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  categoria: CategoriaNoticia;
  fonte: string;
  publicado: boolean;
  publicadoEm: string; // ISO date-time
  url: string;
  anexos?: Anexo[];
}

export type OrdenacaoEdital = "recentes" | "prazo" | "salario" | "vagas";

export interface FiltrosEdital {
  termo: string;
  escolaridade: Escolaridade | "";
  uf: string;
  cidade: string;
  status: StatusEdital | "";
  categoria: CategoriaEdital | "";
  salarioMinimo: number;
  ordenacao: OrdenacaoEdital;
}

export type TipoGrupoWhatsApp = "regional" | "area";

export interface GrupoWhatsApp {
  id: string;
  nome: string;
  tipo: TipoGrupoWhatsApp;
  uf?: string;
  regiao?: string;
  area?: string;
  descricao: string;
  link: string;
  ativo: boolean;
  membrosAprox?: string;
}

export interface Configuracoes {
  whatsappUrl: string;
}

