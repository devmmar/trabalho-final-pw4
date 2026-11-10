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
}
export const gradeImoveis = "grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3";
export function ImovelList({
  imoveis,
  loading,
  error,
  mode,
  onRetry,
  onClear,
}: Props) {
  return loading ? (
    <div className={gradeImoveis} role="status" aria-label="Carregando imóveis">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="mt-5 h-4 w-1/3" />
          <Skeleton className="mt-3 h-5 w-3/4" />
        </div>
      ))}
    </div>
  ) : error ? (
    <div role="alert" className="border-y py-16 text-center">
      <h3 className="font-normal">Não foi possível buscar os imóveis</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {error}
      </p>
      <Button variant="outline" className="mt-6" onClick={() => onRetry()}>
        Tentar novamente
      </Button>
    </div>
  ) : imoveis.length === 0 ? (
    <div className="border-y py-16 text-center">
      <h3 className="text-lg font-normal">Nenhum imóvel encontrado</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Tente outro bairro ou altere os filtros.
      </p>
      <Button variant="outline" className="mt-6" onClick={() => onClear()}>
        Limpar filtros
      </Button>
    </div>
  ) : (
    <div className={gradeImoveis}>
      {imoveis.map((imovel) => (
        <ImovelCard key={imovel.id} imovel={imovel} mode={mode} />
      ))}
    </div>
  );
}
