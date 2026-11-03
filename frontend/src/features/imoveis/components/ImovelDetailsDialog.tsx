import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { moeda } from "@/lib/format";
import type { Imovel } from "../types";
import { PropertyArt } from "./PropertyArt";
interface Props {
  selected: Imovel | null;
  onClose: () => void;
}
export function ImovelDetailsDialog({ selected, onClose }: Props) {
  return (
    <Dialog
      open={!!selected}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        {selected && (
          <>
            <DialogHeader>
              <DialogTitle>{selected.titulo}</DialogTitle>
              <DialogDescription>
                {[
                  selected.bairro?.nome,
                  selected.bairro?.cidade,
                  selected.bairro?.estado,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </DialogDescription>
            </DialogHeader>
            <PropertyArt
              apartment={selected.tipoImovel?.nome
                .toLowerCase()
                .includes("apartamento")}
            />
            <p className="text-sm leading-6 text-stone-600">
              {selected.descricao || "Descrição não informada."}
            </p>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                [
                  "Venda",
                  selected.precoVenda != null
                    ? moeda(selected.precoVenda)
                    : "Não se aplica",
                ],
                [
                  "Aluguel",
                  selected.precoAluguel != null
                    ? `${moeda(selected.precoAluguel)}/mês`
                    : "Não se aplica",
                ],
                ["Quartos", selected.dormitorios ?? "—"],
                ["Banheiros", selected.banheiros ?? "—"],
                ["Área total", `${selected.areaTotal ?? "—"} m²`],
                ["Situação", selected.status ?? "Não informada"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-stone-500">{k}</dt>
                  <dd className="mt-1 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-stone-500">
              {[selected.endereco, selected.numero].filter(Boolean).join(", ")}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
