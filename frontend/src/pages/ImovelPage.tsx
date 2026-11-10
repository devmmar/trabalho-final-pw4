import { Link, useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Aviso } from "@/components/form/Aviso";
import { BotaoFavorito } from "@/features/cliente/BotaoFavorito";
import { ContatoForm } from "@/features/imoveis/components/ContatoForm";
import {
  PropertyArt,
  artVariant,
} from "@/features/imoveis/components/PropertyArt";
import { useImovel } from "@/features/imoveis/hooks/useImovel";
import { disponivel } from "@/features/imoveis/utils";
import { moeda } from "@/lib/format";
import { NotFoundPage } from "./NotFoundPage";

export function ImovelPage() {
  const { id } = useParams();
  const { imovel, loading, error, naoEncontrado } = useImovel(id);

  if (naoEncontrado) return <NotFoundPage />;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-6 md:px-12 md:pb-24">
      <Link to="/" className="link-line pb-0.5 text-sm text-muted-foreground">
        ← Todos os imóveis
      </Link>

      {loading ? (
        <div className="mt-10" role="status" aria-label="Carregando imóvel">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="mt-8 aspect-[16/9] w-full" />
        </div>
      ) : error || !imovel ? (
        <div className="mt-10">
          <Aviso tom="erro">{error || "Imóvel indisponível."}</Aviso>
        </div>
      ) : (
        <>
          <header className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">
                {imovel.tipoImovel?.nome ?? "Imóvel"} ·{" "}
                {String(imovel.id).padStart(3, "0")}
              </p>
              <h1 className="display mt-4 text-4xl md:text-5xl">
                {imovel.titulo}
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                {[
                  imovel.bairro?.nome,
                  imovel.bairro?.cidade,
                  imovel.bairro?.estado,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <BotaoFavorito
              id={imovel.id}
              titulo={imovel.titulo}
              className="border"
            />
          </header>

          {!disponivel(imovel) && (
            <div className="mt-6">
              <Aviso>Situação atual: {imovel.status}.</Aviso>
            </div>
          )}

          <div className="mt-10 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <PropertyArt variant={artVariant(imovel)} />
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-8 text-sm sm:grid-cols-3">
                {[
                  [
                    "Venda",
                    imovel.precoVenda != null
                      ? moeda(imovel.precoVenda)
                      : "Não se aplica",
                  ],
                  [
                    "Aluguel",
                    imovel.precoAluguel != null
                      ? `${moeda(imovel.precoAluguel)}/mês`
                      : "Não se aplica",
                  ],
                  ["Área total", `${imovel.areaTotal ?? "—"} m²`],
                  ["Quartos", imovel.dormitorios ?? "—"],
                  ["Banheiros", imovel.banheiros ?? "—"],
                  ["Vagas", imovel.garagem ?? "—"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="eyebrow">{k}</dt>
                    <dd className="mt-1.5 text-base font-normal">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 border-t pt-8">
                <h2 className="eyebrow">Sobre o imóvel</h2>
                <p className="mt-4 max-w-prose leading-7">
                  {imovel.descricao || "Descrição não informada."}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {[imovel.endereco, imovel.numero].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="bg-muted p-6 md:p-8">
                <h2 className="text-xl font-light">Fale com a Ventana</h2>
                <p className="mt-2 mb-8 text-sm text-muted-foreground">
                  Enviamos os detalhes por e-mail e um corretor retorna em
                  seguida.
                </p>
                <ContatoForm imovel={imovel} />
              </div>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}
