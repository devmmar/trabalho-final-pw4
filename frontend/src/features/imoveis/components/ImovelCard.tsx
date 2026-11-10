import { Link } from "react-router";
import { BotaoFavorito } from "@/features/cliente/BotaoFavorito";
import { moeda } from "@/lib/format";
import { getPreco, localizacao } from "../utils";
import type { Imovel, FinalidadeFiltro } from "../types";
import { PropertyArt, artVariant } from "./PropertyArt";
interface Props {
  imovel: Imovel;
  mode?: FinalidadeFiltro;
}
export function ImovelCard({ imovel: i, mode = "todos" }: Props) {
  const aluguel = mode === "alugar" || !i.precoVenda;
  const preco = getPreco(i, mode);
  return (
    <article className="relative">
      <Link
        to={`/imoveis/${i.id}`}
        className="group block outline-none"
        aria-label={`Ver detalhes de ${i.titulo}`}
      >
        <div className="overflow-hidden transition-opacity group-hover:opacity-80 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
          <PropertyArt variant={artVariant(i)} />
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <p className="eyebrow">
            {i.tipoImovel?.nome ?? "Imóvel"} · {aluguel ? "Aluguel" : "Venda"}
          </p>
          <span className="text-[11px] text-muted-foreground">
            {String(i.id).padStart(3, "0")}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-normal leading-snug">{i.titulo}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{localizacao(i)}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          {i.dormitorios ?? "—"} quartos · {i.banheiros ?? "—"} banh. ·{" "}
          {i.areaTotal ?? "—"} m²
        </p>
        <p className="mt-4 border-t pt-4 text-base font-normal">
          {preco != null ? moeda(preco) : "Sob consulta"}
          {aluguel && preco != null && (
            <span className="ml-1 text-xs text-muted-foreground">/mês</span>
          )}
        </p>
      </Link>
      <BotaoFavorito
        id={i.id}
        titulo={i.titulo}
        className="absolute right-3 top-3"
      />
    </article>
  );
}
