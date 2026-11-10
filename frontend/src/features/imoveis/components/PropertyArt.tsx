import type { ReactNode } from "react";
import type { Imovel } from "../types";

export type ArtVariant = "casa" | "sobrado" | "apartamento";

export function artVariant(imovel: Imovel): ArtVariant {
  const tipo = imovel.tipoImovel?.nome.toLowerCase() ?? "";
  if (tipo.includes("apartamento")) return "apartamento";
  if (tipo.includes("sobrado")) return "sobrado";
  return imovel.id % 2 === 0 ? "sobrado" : "casa";
}

function Paisagem({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle className="a-sun" cx="318" cy="72" r="24" stroke="none" />
      {children}
      <path d="M0 250h400" />
      <path d="M40 262h90M180 262h40M270 262h80" opacity=".35" />
    </svg>
  );
}

function Arvore({ x, r = 24 }: { x: number; r?: number }) {
  return (
    <g>
      <path d={`M${x} 250v-${r + 22}`} />
      <circle className="a-leaf" cx={x} cy={250 - r - 34} r={r} />
    </g>
  );
}

function Janela({
  x,
  y,
  w,
  h,
  cruz = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  cruz?: boolean;
}) {
  return (
    <g>
      <rect className="a-glass" x={x} y={y} width={w} height={h} />
      {cruz && <path d={`M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}`} />}
    </g>
  );
}

function Casa() {
  return (
    <Paisagem>
      <Arvore x={340} />
      <path className="a-roof" d="M94 154 200 92l106 62z" />
      <rect className="a-wall" x="110" y="152" width="180" height="98" />
      <circle className="a-glass" cx="200" cy="128" r="9" />
      <Janela x={128} y={170} w={74} h={54} />
      <rect className="a-clay" x="224" y="182" width="32" height="68" />
      <circle cx="250" cy="217" r="1.5" fill="currentColor" />
      <ellipse className="a-leaf" cx="96" cy="244" rx="20" ry="8" />
    </Paisagem>
  );
}

function Sobrado() {
  return (
    <Paisagem>
      <Arvore x={62} r={20} />
      <rect className="a-wall" x="120" y="96" width="170" height="154" />
      <rect className="a-roof" x="112" y="88" width="186" height="8" />
      <rect className="a-panel" x="208" y="96" width="82" height="70" />
      <Janela x={136} y={114} w={56} h={40} />
      <Janela x={222} y={112} w={54} h={42} />
      <path d="M208 166h82M214 166v-14M284 166v-14M214 152h70" />
      <Janela x={136} y={188} w={92} h={42} cruz={false} />
      <path d="M159 188v42M182 188v42M205 188v42" />
      <rect className="a-clay" x="246" y="186" width="28" height="64" />
      <ellipse className="a-leaf" cx="320" cy="245" rx="22" ry="7" />
    </Paisagem>
  );
}

function Apartamento() {
  const colunas = [148, 186, 224];
  const linhas = [78, 110, 142, 174];
  return (
    <Paisagem>
      <Arvore x={78} r={22} />
      <rect className="a-wall" x="132" y="62" width="136" height="188" />
      <rect className="a-roof" x="126" y="54" width="148" height="8" />
      {linhas.map((y) =>
        colunas.map((x) => (
          <Janela key={`${x}-${y}`} x={x} y={y} w={28} h={20} cruz={false} />
        )),
      )}
      {linhas.slice(1).map((y) => (
        <path key={y} d={`M144 ${y + 24}h112`} opacity=".5" />
      ))}
      <rect className="a-clay" x="184" y="210" width="32" height="40" />
      <path d="M176 210h48" />
      <rect className="a-panel" x="268" y="140" width="64" height="110" />
      {[156, 186, 216].map((y) => (
        <Janela key={y} x={280} y={y} w={40} h={16} cruz={false} />
      ))}
    </Paisagem>
  );
}

const desenhos = { casa: Casa, sobrado: Sobrado, apartamento: Apartamento };

export function PropertyArt({ variant = "casa" }: { variant?: ArtVariant }) {
  const Desenho = desenhos[variant];
  return (
    <div
      className="property-art"
      aria-label="Ilustração do imóvel; foto não cadastrada"
      role="img"
    >
      <Desenho />
    </div>
  );
}
