import { PropertyArt } from "./PropertyArt";
export function VitrineHero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-12 md:grid-cols-[1fr_1.1fr] md:items-center md:px-12 md:pb-28 md:pt-20">
      <div>
        <p className="eyebrow mb-8">Imobiliária · Santa Maria</p>
        <h1 className="display text-5xl md:text-7xl">
          Espaços com
          <br />
          boa luz.
        </h1>
        <p className="mt-8 max-w-sm text-base leading-7 text-muted-foreground">
          Casas e apartamentos para comprar ou alugar, escolhidos com cuidado.
        </p>
        <a
          href="#imoveis"
          className="link-line mt-10 inline-block pb-1 text-sm"
        >
          Ver imóveis ↓
        </a>
      </div>
      <figure>
        <PropertyArt variant="sobrado" />
        <figcaption className="mt-3 flex justify-between text-[11px] text-muted-foreground">
          <span>Santa Maria, RS</span>
          <span>Ilustração</span>
        </figcaption>
      </figure>
    </section>
  );
}
