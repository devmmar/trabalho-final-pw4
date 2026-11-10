import { NavLink } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { nomePerfil } from "@/features/auth/session";
import { Logo } from "./Logo";

const link = ({ isActive }: { isActive: boolean }) =>
  `link-line pb-1 ${isActive ? "ativo" : ""}`;

export function SiteHeader() {
  const { sessao, sair } = useAuth();
  return (
    <header>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-8 md:px-12">
        <NavLink to="/" aria-label="Ventana Imobiliária, página inicial">
          <Logo />
        </NavLink>
        <nav aria-label="Principal" className="flex items-center gap-5 text-sm md:gap-7">
          <NavLink to="/" end className={link}>
            Imóveis
          </NavLink>
          {sessao?.perfil === "CLIENTE" && (
            <NavLink to="/cliente" className={link}>
              Minha área
            </NavLink>
          )}
          {sessao?.perfil === "ADMIN" && (
            <NavLink to="/painel" className={link}>
              Painel
            </NavLink>
          )}
          {sessao ? (
            <>
              <span
                className="hidden text-xs text-muted-foreground lg:inline"
                title={sessao.email}
              >
                {nomePerfil(sessao)} · {sessao.email}
              </span>
              <button
                type="button"
                onClick={() => sair()}
                className="link-line pb-1 text-muted-foreground hover:text-foreground"
              >
                Sair
              </button>
            </>
          ) : (
            <NavLink to="/login" className={link}>
              Entrar
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
