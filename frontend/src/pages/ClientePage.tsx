import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/AuthContext";
import { nomePerfil } from "@/features/auth/session";
import { useFavoritos } from "@/features/cliente/useFavoritos";
import { ImovelCard } from "@/features/imoveis/components/ImovelCard";
import { gradeImoveis } from "@/features/imoveis/components/ImovelList";
import { useImoveis } from "@/features/imoveis/hooks/useImoveis";
import { hora } from "@/lib/format";

export function ClientePage() {
  const { sessao } = useAuth();
  const { ids } = useFavoritos();
  const { imoveis, loading, error } = useImoveis();
  const favoritos = imoveis.filter((i) => ids.includes(i.id));
  if (!sessao) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-8 md:px-12 md:pb-24">
      <p className="eyebrow">Área do cliente</p>
      <h1 className="display mt-4 text-4xl md:text-5xl">Olá.</h1>

      <dl className="mt-10 grid gap-6 border-y py-8 text-sm sm:grid-cols-3">
        <div>
          <dt className="eyebrow">E-mail</dt>
          <dd className="mt-1.5 break-all">{sessao.email}</dd>
        </div>
        <div>
          <dt className="eyebrow">Perfil</dt>
          <dd className="mt-1.5">{nomePerfil(sessao)}</dd>
        </div>
        <div>
          <dt className="eyebrow">Sessão válida até</dt>
          <dd className="mt-1.5">{hora(sessao.expiraEm)}</dd>
        </div>
      </dl>

      <div className="mt-16 flex items-end justify-between gap-6">
        <h2 className="display text-3xl">Favoritos</h2>
        <span className="text-xs text-muted-foreground">
          {ids.length} {ids.length === 1 ? "salvo" : "salvos"}
        </span>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className={gradeImoveis} role="status" aria-label="Carregando favoritos">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="aspect-[4/3] w-full" />
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : favoritos.length === 0 ? (
          <div className="border-y py-16 text-center">
            <p className="text-lg font-normal">Nenhum favorito ainda</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Toque no coração de um imóvel para guardá-lo aqui.
            </p>
            <Link to="/" className="link-line mt-6 inline-block pb-0.5 text-sm">
              Ver imóveis
            </Link>
          </div>
        ) : (
          <div className={gradeImoveis}>
            {favoritos.map((imovel) => (
              <ImovelCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
