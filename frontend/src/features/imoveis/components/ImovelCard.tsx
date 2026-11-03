import { ArrowRight, Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { moeda } from "@/lib/format";
import { getPreco } from "../utils";
import type { Imovel, FinalidadeFiltro } from "../types";
import { PropertyArt } from "./PropertyArt";
interface Props {
  imovel: Imovel;
  mode: FinalidadeFiltro;
  onSelect: (imovel: Imovel) => void;
}
export function ImovelCard({ imovel: i, mode, onSelect }: Props) {
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border-stone-200 py-0 shadow-none">
      <div className="relative">
        <PropertyArt
          apartment={i.tipoImovel?.nome.toLowerCase().includes("apartamento")}
        />
        <Badge className="absolute left-4 top-4 bg-white text-[#234c3d]">
          {mode === "alugar" || !i.precoVenda ? "Aluguel" : "Venda"}
        </Badge>
        <span className="absolute right-4 top-4 text-xs text-white">
          #{String(i.id).padStart(3, "0")}
        </span>
      </div>
      <CardContent className="p-5">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[#52705b]">
          {i.tipoImovel?.nome ?? "Imóvel"}
        </p>
        <h3 className="text-lg font-medium leading-snug">{i.titulo}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
          <MapPin size={13} />
          {[i.bairro?.nome, i.bairro?.cidade].filter(Boolean).join(", ") ||
            "Localização não informada"}
        </p>
        <div className="my-5 flex gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <BedDouble size={15} />
            {i.dormitorios ?? "—"} quartos
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={15} />
            {i.banheiros ?? "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize size={14} />
            {i.areaTotal ?? "—"} m²
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          <p className="text-xl font-semibold tracking-tight">
            {getPreco(i, mode) != null
              ? moeda(getPreco(i, mode)!)
              : "Sob consulta"}
            {(mode === "alugar" || !i.precoVenda) && (
              <span className="ml-1 text-xs font-normal text-stone-500">
                /mês
              </span>
            )}
          </p>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label={`Ver detalhes de ${i.titulo}`}
            onClick={() => onSelect(i)}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
