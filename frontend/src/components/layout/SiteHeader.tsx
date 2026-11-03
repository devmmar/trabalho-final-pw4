import { ArrowRight, House } from "lucide-react";
export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-[#faf9f6]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
        <a
          href="#"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-[#234c3d] text-white">
            <House size={19} />
          </span>
          <span className="text-xl">
            morada<span className="text-[#65816a]">.</span>
          </span>
        </a>
        <a
          href="#imoveis"
          className="text-sm text-stone-600 hover:text-stone-950"
        >
          Explorar imóveis <ArrowRight className="ml-2 inline" size={15} />
        </a>
      </div>
    </header>
  );
}
