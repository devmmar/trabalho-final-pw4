import type { Imovel, FinalidadeFiltro } from "./types";
export function filtrarImoveis(
  imoveis: Imovel[],
  mode: FinalidadeFiltro,
  query: string,
) {
  return imoveis.filter(
    (i) =>
      (!i.status ||
        ["disponivel", "disponível"].includes(
          i.status.toLocaleLowerCase("pt-BR"),
        )) &&
      (mode === "todos" ||
        (mode === "comprar" ? i.precoVenda != null : i.precoAluguel != null)) &&
      [i.titulo, i.bairro?.nome, i.bairro?.cidade]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")),
  );
}
export const getPreco = (imovel: Imovel, mode: FinalidadeFiltro) =>
  mode === "alugar"
    ? imovel.precoAluguel
    : (imovel.precoVenda ?? imovel.precoAluguel);
