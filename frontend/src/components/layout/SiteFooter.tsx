import { Logo } from "./Logo";
export function SiteFooter() {
  return (
    <footer className="mt-12 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 text-xs text-muted-foreground sm:grid-cols-3 md:px-12">
        <div>
          <span className="text-foreground">
            <Logo />
          </span>
          <p className="mt-4">Santa Maria, RS</p>
        </div>
        <address className="not-italic">
          <p className="eyebrow mb-3">Contato</p>
          <p>Rua do Acampamento, 100 · Centro</p>
          <p className="mt-1">(55) 3000-0000</p>
          <p className="mt-1">contato@ventana.test</p>
        </address>
        <p className="sm:text-right">
          Ventana Imobiliária · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
