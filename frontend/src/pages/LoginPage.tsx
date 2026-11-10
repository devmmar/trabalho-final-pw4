import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Aviso } from "@/components/form/Aviso";
import { Campo } from "@/components/form/Campo";
import { useAuth, type Aviso as TipoAviso } from "@/features/auth/AuthContext";
import { areaInicial, type Sessao } from "@/features/auth/session";
import { PropertyArt } from "@/features/imoveis/components/PropertyArt";
import { HttpError } from "@/lib/http";
import { obrigatorio, semErros, validarEmail } from "@/lib/validacao";

interface Estado {
  de?: string;
}

const avisos: Record<TipoAviso, string> = {
  saiu: "Você saiu da sua conta.",
  expirou: "Sua sessão expirou. Entre novamente para continuar.",
};

function mensagemErro(err: unknown) {
  if (err instanceof HttpError) {
    if (err.status === 401) return "E-mail ou senha incorretos.";
    if (err.status === 400) return "Confira o e-mail e a senha informados.";
    if (err.status === 0) return err.message;
  }
  return "O servidor não respondeu como esperado. Tente novamente em instantes.";
}

// Volta para a pagina que pediu login, se ela for do perfil de quem entrou.
function destino(sessao: Sessao, de?: string) {
  const area = areaInicial(sessao);
  return de && de.startsWith(area) ? de : area;
}

export function LoginPage() {
  const { sessao, aviso, entrar } = useAuth();
  const navigate = useNavigate();
  const estado = (useLocation().state ?? {}) as Estado;
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (sessao && !enviando) return <Navigate to={areaInicial(sessao)} replace />;

  const validar = () => {
    const novos = {
      email: validarEmail(email),
      senha: obrigatorio(senha, "Informe sua senha."),
    };
    setErros(novos);
    return semErros(novos);
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErroGeral("");
    if (!validar()) return;
    setEnviando(true);
    try {
      const nova = await entrar(email.trim(), senha);
      navigate(destino(nova, estado.de), { replace: true });
    } catch (err) {
      setErroGeral(mensagemErro(err));
      setEnviando(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-6 py-16 md:grid-cols-[1fr_1fr] md:items-center md:px-12 md:py-24">
      <div className="max-w-sm">
        <p className="eyebrow mb-6">Área restrita</p>
        <h1 className="display text-4xl md:text-5xl">Entrar</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Clientes acompanham seus favoritos. A equipe da Ventana acessa o
          painel.
        </p>

        <div className="mt-8 space-y-3">
          {aviso && <Aviso>{avisos[aviso]}</Aviso>}
          {!aviso && estado.de && (
            <Aviso>Entre para acessar esta página.</Aviso>
          )}
          {erroGeral && <Aviso tom="erro">{erroGeral}</Aviso>}
        </div>

        <form noValidate onSubmit={enviar} className="mt-8 space-y-7">
          <Campo
            id="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            value={email}
            erro={erros.email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() =>
              email && setErros((v) => ({ ...v, email: validarEmail(email) }))
            }
          />
          <Campo
            id="senha"
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            erro={erros.senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button type="submit" size="lg" className="w-full" disabled={enviando}>
            {enviando ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>
      <figure className="hidden md:block">
        <PropertyArt variant="casa" />
      </figure>
    </section>
  );
}
