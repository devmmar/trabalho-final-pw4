import { useSearchParams } from "react-router";
import type { FinalidadeFiltro, Filtros, Ordem } from "../types";

const finalidades: FinalidadeFiltro[] = ["todos", "comprar", "alugar"];
const ordens: Ordem[] = ["recentes", "menor-preco", "maior-preco", "maior-area"];

const padrao: Filtros = {
  finalidade: "todos",
  busca: "",
  tipo: "",
  bairro: "",
  quartos: 0,
  ordem: "recentes",
  pagina: 1,
};

// Filtros ficam na URL: dá para voltar, recarregar e compartilhar a busca.
export function useFiltros() {
  const [params, setParams] = useSearchParams();
  const finalidade = params.get("finalidade") as FinalidadeFiltro;
  const ordem = params.get("ordem") as Ordem;
  const filtros: Filtros = {
    finalidade: finalidades.includes(finalidade) ? finalidade : "todos",
    busca: params.get("busca") ?? "",
    tipo: params.get("tipo") ?? "",
    bairro: params.get("bairro") ?? "",
    quartos: Number(params.get("quartos")) || 0,
    ordem: ordens.includes(ordem) ? ordem : "recentes",
    pagina: Number(params.get("pagina")) || 1,
  };

  const atualizar = (mudancas: Partial<Filtros>) => {
    // Qualquer filtro novo volta para a primeira página.
    const novo = { ...filtros, pagina: 1, ...mudancas };
    const next = new URLSearchParams();
    for (const [chave, valor] of Object.entries(novo)) {
      if (valor !== padrao[chave as keyof Filtros]) next.set(chave, String(valor));
    }
    setParams(next, { replace: !("pagina" in mudancas) });
  };

  const ativos =
    filtros.finalidade !== "todos" ||
    !!filtros.busca ||
    !!filtros.tipo ||
    !!filtros.bairro ||
    filtros.quartos > 0;

  return {
    filtros,
    atualizar,
    ativos,
    limpar: () => setParams(new URLSearchParams()),
  };
}
