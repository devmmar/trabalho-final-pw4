import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FinalidadeFiltro, Filtros, Ordem } from "../types";

interface Props {
  filtros: Filtros;
  tipos: string[];
  bairros: string[];
  onChange: (mudancas: Partial<Filtros>) => void;
}

export function FinalidadeTabs({
  mode,
  onModeChange,
}: {
  mode: FinalidadeFiltro;
  onModeChange: (value: FinalidadeFiltro) => void;
}) {
  return (
    <div className="flex gap-6" role="group" aria-label="Finalidade">
      {(
        [
          ["todos", "Todos"],
          ["comprar", "Comprar"],
          ["alugar", "Alugar"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          className={`border-b pb-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
            mode === value
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={mode === value}
          onClick={() => onModeChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function ImovelSearch({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="mt-10 flex items-center gap-3 border-b py-3 focus-within:border-foreground">
      <Search
        size={16}
        strokeWidth={1.5}
        className="shrink-0 text-muted-foreground"
      />
      <label className="sr-only" htmlFor="busca">
        Buscar por nome, bairro ou cidade
      </label>
      <input
        id="busca"
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Nome, bairro ou cidade"
        className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Limpar busca"
          onClick={() => onQueryChange("")}
        >
          <X size={14} />
        </Button>
      )}
    </div>
  );
}

const select =
  "mt-1.5 block w-full cursor-pointer border-b bg-transparent py-1.5 text-sm font-normal outline-none focus:border-foreground";

function Filtro({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={select}
      >
        {children}
      </select>
    </div>
  );
}

export function FiltrosAvancados({ filtros, tipos, bairros, onChange }: Props) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
      <Filtro
        id="filtro-tipo"
        label="Tipo"
        value={filtros.tipo}
        onChange={(tipo) => onChange({ tipo })}
      >
        <option value="">Todos</option>
        {tipos.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </Filtro>
      <Filtro
        id="filtro-bairro"
        label="Bairro"
        value={filtros.bairro}
        onChange={(bairro) => onChange({ bairro })}
      >
        <option value="">Todos</option>
        {bairros.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </Filtro>
      <Filtro
        id="filtro-quartos"
        label="Quartos"
        value={filtros.quartos}
        onChange={(q) => onChange({ quartos: Number(q) })}
      >
        <option value={0}>Qualquer</option>
        {[1, 2, 3, 4].map((n) => (
          <option key={n} value={n}>
            {n}+
          </option>
        ))}
      </Filtro>
      <Filtro
        id="filtro-ordem"
        label="Ordenar por"
        value={filtros.ordem}
        onChange={(ordem) => onChange({ ordem: ordem as Ordem })}
      >
        <option value="recentes">Mais recentes</option>
        <option value="menor-preco">Menor preço</option>
        <option value="maior-preco">Maior preço</option>
        <option value="maior-area">Maior área</option>
      </Filtro>
    </div>
  );
}
