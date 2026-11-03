import { useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { VitrineHero } from "@/features/imoveis/components/VitrineHero";
import {
  FinalidadeTabs,
  ImovelSearch,
} from "@/features/imoveis/components/ImovelFilters";
import { ImovelList } from "@/features/imoveis/components/ImovelList";
import { ImovelDetailsDialog } from "@/features/imoveis/components/ImovelDetailsDialog";
import { useImoveis } from "@/features/imoveis/hooks/useImoveis";
import { filtrarImoveis } from "@/features/imoveis/utils";
import type { Imovel, FinalidadeFiltro } from "@/features/imoveis/types";
export function VitrinePage() {
  const { imoveis, loading, error, reload } = useImoveis();
  const [mode, setMode] = useState<FinalidadeFiltro>("todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Imovel | null>(null);
  const visible = filtrarImoveis(imoveis, mode, query);
  const clearFilters = () => {
    setMode("todos");
    setQuery("");
  };
  return (
    <>
      <SiteHeader />
      <main>
        <VitrineHero />
        <section
          id="imoveis"
          className="border-t border-stone-200 bg-white py-12 md:py-16"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-[#52705b]">
                  Encontre seu espaço
                </p>
                <h2 className="hero-title text-4xl tracking-tight">
                  Imóveis para viver bem
                </h2>
              </div>
              <FinalidadeTabs mode={mode} onModeChange={setMode} />
            </div>
            <ImovelSearch query={query} onQueryChange={setQuery} />
            <div className="my-6 flex items-center justify-between text-xs text-stone-500">
              <p aria-live="polite">
                {loading
                  ? "Buscando seu próximo lar…"
                  : error
                    ? "Consulta indisponível"
                    : visible.length +
                      (visible.length === 1
                        ? " imóvel encontrado"
                        : " imóveis encontrados")}
              </p>
              <span>Seleção de imóveis disponíveis</span>
            </div>
            <ImovelList
              imoveis={visible}
              loading={loading}
              error={error}
              mode={mode}
              onRetry={reload}
              onClear={clearFilters}
              onSelect={setSelected}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
      <ImovelDetailsDialog
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
