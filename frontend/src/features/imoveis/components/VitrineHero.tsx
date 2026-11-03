import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyArt } from "./PropertyArt";
export function VitrineHero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.1fr_1fr] md:items-center md:px-12 md:py-20">
      <div>
        <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-[#52705b]">
          <span className="h-px w-7 bg-[#52705b]" />
          Seu próximo capítulo começa aqui
        </p>
        <h1 className="hero-title max-w-xl text-5xl leading-[1.08] tracking-tight md:text-6xl">
          Um lugar para
          <br />
          chamar de <em className="text-[#52705b]">seu.</em>
        </h1>
        <p className="mt-6 max-w-sm text-base leading-7 text-stone-500">
          Encontre o espaço que combina com a sua vida. Explore imóveis em Santa
          Maria e descubra novas possibilidades.
        </p>
        <Button
          render={<a href="#imoveis" />}
          nativeButton={false}
          className="mt-8 rounded-full px-6"
        >
          Encontre sua morada <ArrowDown size={15} />
        </Button>
      </div>
      <div className="hero-art relative overflow-hidden rounded-t-[120px] rounded-b-3xl">
        <PropertyArt />
        <div className="absolute bottom-8 right-6 rounded-xl bg-[#faf9f6] p-4 shadow-lg">
          <p className="text-xs text-stone-500">Novos espaços.</p>
          <p className="hero-title text-2xl">Novas histórias.</p>
        </div>
        <span className="absolute right-5 top-5 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs text-white backdrop-blur">
          Santa Maria, RS
        </span>
      </div>
    </section>
  );
}
