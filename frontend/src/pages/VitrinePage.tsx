import { useRef } from "react";
import { VitrineHero } from "@/features/imoveis/components/VitrineHero";
import {
  FiltrosAvancados,
  FinalidadeTabs,
  ImovelSearch,
} from "@/features/imoveis/components/ImovelFilters";
import { ImovelList } from "@/features/imoveis/components/ImovelList";
import { Paginacao } from "@/features/imoveis/components/Paginacao";
import { useFiltros } from "@/features/imoveis/hooks/useFiltros";
import { useImoveis } from "@/features/imoveis/hooks/useImoveis";
import {
  disponivel,
  filtrarImoveis,
  opcoes,
  ordenarImoveis,
  paginar,
} from "@/features/imoveis/utils";
export function VitrinePage() {
  const { imoveis, loading, error, reload } = useImoveis();
  const { filtros, atualizar, ativos, limpar } = useFiltros();
  const topo = useRef<HTMLElement>(null);
  const ativosNaVitrine = imoveis.filter(disponivel);
  const encontrados = ordenarImoveis(filtrarImoveis(imoveis, filtros), filtros);
  const pagina = paginar(encontrados, filtros.pagina);
  const irPara = (n: number) => {
    atualizar({ pagina: n });
    topo.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <VitrineHero />
      <section id="imoveis" ref={topo} className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display text-3xl md:text-4xl">Imóveis</h2>
            <FinalidadeTabs
              mode={filtros.finalidade}
              onModeChange={(finalidade) => atualizar({ finalidade })}
            />
          </div>
          <ImovelSearch
            query={filtros.busca}
            onQueryChange={(busca) => atualizar({ busca })}
          />
          <FiltrosAvancados
            filtros={filtros}
            tipos={opcoes(ativosNaVitrine.map((i) => i.tipoImovel?.nome))}
            bairros={opcoes(ativosNaVitrine.map((i) => i.bairro?.nome))}
            onChange={atualizar}
          />
          <div className="my-10 flex items-center justify-between text-xs text-muted-foreground">
            <p aria-live="polite">
              {loading
                ? "Carregando…"
                : error
                  ? "Consulta indisponível"
                  : `${encontrados.length} ${encontrados.length === 1 ? "imóvel" : "imóveis"}` +
                    (pagina.total > 1
                      ? ` · página ${pagina.atual} de ${pagina.total}`
                      : "")}
            </p>
            {ativos && (
              <button
                type="button"
                onClick={limpar}
                className="link-line pb-0.5 hover:text-foreground"
              >
                Limpar filtros
              </button>
            )}
          </div>
          <ImovelList
            imoveis={pagina.itens}
            loading={loading}
            error={error}
            mode={filtros.finalidade}
            onRetry={reload}
            onClear={limpar}
          />
          {!loading && !error && (
            <Paginacao
              atual={pagina.atual}
              total={pagina.total}
              onChange={irPara}
            />
          )}
        </div>
      </section>
    </>
  );
}
