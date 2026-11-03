import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FinalidadeFiltro } from "../types";
interface Props {
  mode: FinalidadeFiltro;
  query: string;
  onModeChange: (value: FinalidadeFiltro) => void;
  onQueryChange: (value: string) => void;
}
export function FinalidadeTabs({
  mode,
  onModeChange,
}: Pick<Props, "mode" | "onModeChange">) {
  return (
    <div className="flex rounded-full bg-stone-100 p-1" aria-label="Finalidade">
      {(
        [
          ["todos", "Todos"],
          ["comprar", "Comprar"],
          ["alugar", "Alugar"],
        ] as const
      ).map(([value, label]) => (
        <Button
          key={value}
          variant={mode === value ? "default" : "ghost"}
          size="sm"
          className="rounded-full px-5"
          aria-pressed={mode === value}
          onClick={() => onModeChange(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
export function ImovelSearch({
  query,
  onQueryChange,
}: Pick<Props, "query" | "onQueryChange">) {
  return (
    <div className="mt-8 flex items-center gap-3 rounded-xl border border-stone-200 bg-[#faf9f6] px-4 py-3">
      <Search size={19} className="shrink-0 text-stone-400" />
      <label className="sr-only" htmlFor="busca">
        Buscar por nome, bairro ou cidade
      </label>
      <input
        id="busca"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Busque por nome, bairro ou cidade…"
        className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#52705b]"
      />
      {query && (
        <Button
          size="icon"
          variant="ghost"
          aria-label="Limpar busca"
          onClick={() => onQueryChange("")}
        >
          <X size={15} />
        </Button>
      )}
      <SlidersHorizontal
        size={18}
        className="text-stone-400"
        aria-hidden="true"
      />
    </div>
  );
}
