import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
      <p className="eyebrow mb-6">Erro 404</p>
      <h1 className="display text-4xl md:text-5xl">Página não encontrada.</h1>
      <Link to="/" className="link-line mt-10 inline-block pb-1 text-sm">
        ← Voltar aos imóveis
      </Link>
    </section>
  );
}
