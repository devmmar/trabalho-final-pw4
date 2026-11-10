export function Paginacao({
  atual,
  total,
  onChange,
}: {
  atual: number;
  total: number;
  onChange: (pagina: number) => void;
}) {
  if (total <= 1) return null;
  const botao =
    "min-w-9 border-b py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30";
  return (
    <nav
      aria-label="Paginação"
      className="mt-16 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        className={`${botao} border-transparent px-3 text-muted-foreground hover:text-foreground`}
        disabled={atual === 1}
        onClick={() => onChange(atual - 1)}
      >
        ← Anterior
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === atual ? "page" : undefined}
          aria-label={`Página ${n}`}
          className={`${botao} ${
            n === atual
              ? "border-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className={`${botao} border-transparent px-3 text-muted-foreground hover:text-foreground`}
        disabled={atual === total}
        onClick={() => onChange(atual + 1)}
      >
        Próxima →
      </button>
    </nav>
  );
}
