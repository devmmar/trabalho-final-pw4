import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Aviso } from "@/components/form/Aviso";
import { useAuth } from "@/features/auth/AuthContext";
import { useImoveis } from "@/features/imoveis/hooks/useImoveis";
import { disponivel } from "@/features/imoveis/utils";
import { NovoUsuarioForm } from "@/features/painel/NovoUsuarioForm";
import {
  STATUS,
  alterarStatus,
  listarBairros,
  listarUsuarios,
  type Usuario,
} from "@/features/painel/painel-api";
import { hora, moeda } from "@/lib/format";

export function PainelPage() {
  const { sessao } = useAuth();
  const { imoveis, loading, error, reload } = useImoveis();
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [bairros, setBairros] = useState<number | null>(null);
  const [erroUsuarios, setErroUsuarios] = useState("");
  const [salvando, setSalvando] = useState<number | null>(null);
  const [erroStatus, setErroStatus] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    listarUsuarios(controller.signal)
      .then(setUsuarios)
      .catch((err) => {
        if (!controller.signal.aborted) setErroUsuarios(err.message);
      });
    listarBairros(controller.signal)
      .then((lista) => setBairros(lista.length))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const mudarStatus = async (id: number, status: string) => {
    setErroStatus("");
    setSalvando(id);
    try {
      await alterarStatus(id, status);
      reload();
    } catch (err) {
      setErroStatus(err instanceof Error ? err.message : "Falha ao salvar.");
    } finally {
      setSalvando(null);
    }
  };

  if (!sessao) return null;

  const resumo = [
    ["Imóveis", loading ? "—" : imoveis.length],
    ["Na vitrine", loading ? "—" : imoveis.filter(disponivel).length],
    ["Bairros", bairros ?? "—"],
    ["Usuários", usuarios?.length ?? "—"],
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-8 md:px-12 md:pb-24">
      <p className="eyebrow">Painel administrativo</p>
      <h1 className="display mt-4 text-4xl md:text-5xl">Painel</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {sessao.email} · sessão válida até {hora(sessao.expiraEm)}
      </p>

      <dl className="mt-10 grid grid-cols-2 border-y md:grid-cols-4">
        {resumo.map(([k, v], i) => (
          <div
            key={k}
            className={`py-8 ${i > 0 ? "md:border-l md:pl-8" : ""} ${i % 2 ? "border-l pl-6 md:pl-8" : ""}`}
          >
            <dt className="eyebrow">{k}</dt>
            <dd className="display mt-3 text-4xl">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16">
        <h2 className="display text-3xl">Imóveis</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Só os imóveis disponíveis aparecem na vitrine.
        </p>
        {erroStatus && (
          <div className="mt-6">
            <Aviso tom="erro">{erroStatus}</Aviso>
          </div>
        )}
        {error ? (
          <div className="mt-6">
            <Aviso tom="erro">{error}</Aviso>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="eyebrow py-3 font-normal">Imóvel</th>
                  <th className="eyebrow py-3 font-normal">Tipo</th>
                  <th className="eyebrow py-3 font-normal">Preço</th>
                  <th className="eyebrow py-3 font-normal">Situação</th>
                </tr>
              </thead>
              <tbody>
                {imoveis.map((i) => (
                  <tr key={i.id} className="border-b">
                    <td className="py-3 pr-4">
                      <Link to={`/imoveis/${i.id}`} className="link-line pb-0.5">
                        {i.titulo}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {i.tipoImovel?.nome ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {i.precoVenda != null
                        ? moeda(i.precoVenda)
                        : i.precoAluguel != null
                          ? `${moeda(i.precoAluguel)}/mês`
                          : "—"}
                    </td>
                    <td className="py-3">
                      <label className="sr-only" htmlFor={`status-${i.id}`}>
                        Situação de {i.titulo}
                      </label>
                      <select
                        id={`status-${i.id}`}
                        value={STATUS.includes(i.status ?? "") ? i.status! : ""}
                        disabled={salvando === i.id}
                        onChange={(e) => mudarStatus(i.id, e.target.value)}
                        className="cursor-pointer border-b bg-transparent py-1 outline-none focus:border-foreground disabled:opacity-50"
                      >
                        {!STATUS.includes(i.status ?? "") && (
                          <option value="">{i.status ?? "—"}</option>
                        )}
                        {STATUS.map((s) => (
                          <option key={s} value={s}>
                            {s === "Disponivel" ? "Disponível" : s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="display text-3xl">Usuários</h2>
          {erroUsuarios ? (
            <div className="mt-6">
              <Aviso tom="erro">{erroUsuarios}</Aviso>
            </div>
          ) : (
            <ul className="mt-8 border-t text-sm">
              {(usuarios ?? []).map((u) => (
                <li
                  key={u.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b py-3"
                >
                  <span>
                    {u.nome}
                    <span className="ml-2 text-muted-foreground">{u.email}</span>
                  </span>
                  <span className="eyebrow">
                    {u.tipo === "ADMIN" ? "Administrador" : "Cliente"}
                  </span>
                </li>
              ))}
              {!usuarios && (
                <li className="py-3 text-muted-foreground">Carregando…</li>
              )}
            </ul>
          )}
        </div>
        <aside className="bg-muted p-6 md:p-8 lg:self-start">
          <h2 className="text-xl font-light">Novo usuário</h2>
          <p className="mb-8 mt-2 text-sm text-muted-foreground">
            Só administradores cadastram usuários.
          </p>
          <NovoUsuarioForm
            onCriado={(u) => setUsuarios((lista) => [...(lista ?? []), u])}
          />
        </aside>
      </div>
    </section>
  );
}
