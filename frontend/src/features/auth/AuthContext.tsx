import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router";
import { HttpError, SESSAO_EXPIRADA, request } from "@/lib/http";
import {
  TOKEN_KEY,
  clearToken,
  decodificar,
  saveToken,
  sessaoAtual,
  type Sessao,
} from "./session";

export type Aviso = "saiu" | "expirou";

interface AuthValue {
  sessao: Sessao | null;
  aviso: Aviso | null;
  entrar: (email: string, password: string) => Promise<Sessao>;
  sair: (aviso?: Aviso) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sessao, setSessao] = useState(sessaoAtual);
  // O aviso fica aqui, e nao no state da navegacao: a rota protegida tambem
  // redireciona para /login quando a sessao some e sobrescreveria o state.
  const [aviso, setAviso] = useState<Aviso | null>(null);

  const sair = useCallback(
    (motivo: Aviso = "saiu") => {
      clearToken();
      setAviso(motivo);
      setSessao(null);
      navigate("/login", { replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    if (pathname !== "/login") setAviso(null);
  }, [pathname]);

  // Uma requisicao recebeu 401: o token ja foi apagado em lib/http.
  useEffect(() => {
    const expirou = () => sair("expirou");
    window.addEventListener(SESSAO_EXPIRADA, expirou);
    return () => window.removeEventListener(SESSAO_EXPIRADA, expirou);
  }, [sair]);

  // Desloga sozinho quando o exp do token chega.
  useEffect(() => {
    if (!sessao) return;
    const restante = Math.max(sessao.expiraEm - Date.now(), 0);
    const timer = window.setTimeout(() => sair("expirou"), restante);
    return () => window.clearTimeout(timer);
  }, [sessao, sair]);

  // Login ou logout em outra aba.
  useEffect(() => {
    const sincronizar = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) setSessao(sessaoAtual());
    };
    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, []);

  const entrar = useCallback(async (email: string, password: string) => {
    const data = await request<{ token?: string }>("/public/login", {
      method: "POST",
      body: { email, password },
    });
    const nova = data?.token ? decodificar(data.token) : null;
    if (!nova) throw new HttpError(500, "Resposta de login inválida.");
    saveToken(nova.token);
    setAviso(null);
    setSessao(nova);
    return nova;
  }, []);

  const value = useMemo(
    () => ({ sessao, aviso, entrar, sair }),
    [sessao, aviso, entrar, sair],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return value;
}
