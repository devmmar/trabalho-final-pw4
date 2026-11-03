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
  bairro: { nome: string; cidade: string; estado: string } | null;
  tipoImovel: { nome: string } | null;
}

export type FinalidadeFiltro = "todos" | "comprar" | "alugar";
