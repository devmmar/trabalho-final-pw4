import { Building2, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImovelCard } from "./ImovelCard";
import type { Imovel, FinalidadeFiltro } from "../types";
interface Props {
  imoveis: Imovel[];
  loading: boolean;
  error: string;
  mode: FinalidadeFiltro;
  onRetry: () => void;
  onClear: () => void;
  onSelect: (imovel: Imovel) => void;
}
export function ImovelList({
  imoveis,
  loading,
  error,
  mode,
  onRetry,
  onClear,
  onSelect,
}: Props) {
  return loading ? (
    <div
      className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Carregando imóveis"
    >
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="mt-4 h-6 w-3/4" />
          <Skeleton className="mt-3 h-5 w-1/2" />
        </div>
      ))}
    </div>
  ) : error ? (
    <div
      role="alert"
      className="rounded-2xl border border-stone-200 bg-stone-50 p-10 text-center"
    >
      <Building2 className="mx-auto mb-4 text-stone-400" />
      <h3 className="font-medium">Não foi possível buscar os imóveis</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">{error}</p>
      <Button className="mt-5" onClick={() => onRetry()}>
        <RefreshCw size={15} />
        Tentar novamente
      </Button>
    </div>
  ) : imoveis.length === 0 ? (
    <div className="rounded-2xl bg-stone-50 p-12 text-center">
      <Search className="mx-auto mb-4 text-stone-400" />
      <h3 className="text-lg font-medium">Nenhum imóvel encontrado</h3>
      <p className="mt-2 text-sm text-stone-500">
        Tente outro bairro ou altere a finalidade da busca.
      </p>
      <Button
        variant="outline"
        className="mt-5"
        onClick={() => {
          onClear();
        }}
      >
        Limpar filtros
      </Button>
    </div>
  ) : (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {imoveis.map((imovel) => (
        <ImovelCard
          key={imovel.id}
          imovel={imovel}
          mode={mode}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
