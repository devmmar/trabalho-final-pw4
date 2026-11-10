import type { Imovel, FinalidadeFiltro, Filtros } from "./types";

export const POR_PAGINA = 6;

const normalizar = (texto: string) =>
  texto
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export const disponivel = (i: Imovel) =>
  !i.status || normalizar(i.status) === "disponivel";

export function filtrarImoveis(imoveis: Imovel[], f: Filtros) {
  const busca = normalizar(f.busca.trim());
  return imoveis.filter(
    (i) =>
      disponivel(i) &&
      (f.finalidade === "todos" ||
        (f.finalidade === "comprar"
          ? i.precoVenda != null
          : i.precoAluguel != null)) &&
      (!f.tipo || i.tipoImovel?.nome === f.tipo) &&
      (!f.bairro || i.bairro?.nome === f.bairro) &&
      (!f.quartos || (i.dormitorios ?? 0) >= f.quartos) &&
      normalizar(
        [i.titulo, i.bairro?.nome, i.bairro?.cidade].filter(Boolean).join(" "),
      ).includes(busca),
  );
}

export const getPreco = (imovel: Imovel, mode: FinalidadeFiltro) =>
  mode === "alugar"
    ? imovel.precoAluguel
    : (imovel.precoVenda ?? imovel.precoAluguel);

export function ordenarImoveis(imoveis: Imovel[], f: Filtros) {
  const preco = (i: Imovel) => getPreco(i, f.finalidade);
  const lista = [...imoveis];
  switch (f.ordem) {
    case "menor-preco":
      return lista.sort(
        (a, b) => (preco(a) ?? Infinity) - (preco(b) ?? Infinity),
      );
    case "maior-preco":
      return lista.sort((a, b) => (preco(b) ?? -1) - (preco(a) ?? -1));
    case "maior-area":
      return lista.sort((a, b) => (b.areaTotal ?? 0) - (a.areaTotal ?? 0));
    default:
      return lista.sort((a, b) => b.id - a.id);
  }
}

export function paginar<T>(itens: T[], pagina: number) {
  const total = Math.max(1, Math.ceil(itens.length / POR_PAGINA));
  const atual = Math.min(Math.max(1, pagina), total);
  return {
    itens: itens.slice((atual - 1) * POR_PAGINA, atual * POR_PAGINA),
    atual,
    total,
  };
}

export const opcoes = (valores: (string | undefined)[]) =>
  [...new Set(valores.filter((v): v is string => !!v))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

export const localizacao = (i: Imovel) =>
  [i.bairro?.nome, i.bairro?.cidade].filter(Boolean).join(", ") ||
  "Localização não informada";
