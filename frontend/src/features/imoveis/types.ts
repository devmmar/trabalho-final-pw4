export interface Imovel {
  id: number;
  titulo: string;
  descricao: string | null;
  precoVenda: number | null;
  precoAluguel: number | null;
  finalidade: string | null;
  status: string | null;
  dormitorios: number | null;
  banheiros: number | null;
  garagem: number | null;
  areaTotal: number | null;
  endereco: string | null;
  numero: string | null;
  bairro: { id?: number; nome: string; cidade: string; estado: string } | null;
  tipoImovel: { id?: number; nome: string } | null;
}

export type FinalidadeFiltro = "todos" | "comprar" | "alugar";

export type Ordem = "recentes" | "menor-preco" | "maior-preco" | "maior-area";

export interface Filtros {
  finalidade: FinalidadeFiltro;
  busca: string;
  tipo: string;
  bairro: string;
  quartos: number;
  ordem: Ordem;
  pagina: number;
}
