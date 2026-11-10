import { Heart } from "lucide-react";
import { useFavoritos } from "./useFavoritos";

export function BotaoFavorito({
  id,
  titulo,
  className = "",
}: {
  id: number;
  titulo: string;
  className?: string;
}) {
  const { ativo, tem, alternar } = useFavoritos();
  if (!ativo) return null;
  const marcado = tem(id);
  return (
    <button
      type="button"
      onClick={() => alternar(id)}
      aria-pressed={marcado}
      aria-label={
        marcado
          ? `Remover ${titulo} dos favoritos`
          : `Salvar ${titulo} nos favoritos`
      }
      className={`flex size-9 items-center justify-center bg-background/90 outline-none transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <Heart
        size={16}
        strokeWidth={1.5}
        className={marcado ? "fill-[#c48d63] text-[#c48d63]" : ""}
      />
    </button>
  );
}
