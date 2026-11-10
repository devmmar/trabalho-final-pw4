import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Aviso } from "@/components/form/Aviso";
import { Campo, CampoSelect } from "@/components/form/Campo";
import { HttpError } from "@/lib/http";
import { obrigatorio, semErros, validarEmail } from "@/lib/validacao";
import { criarUsuario, type NovoUsuario, type Usuario } from "./painel-api";

const vazio: NovoUsuario = { nome: "", email: "", password: "", tipo: "COMUM" };

export function NovoUsuarioForm({
  onCriado,
}: {
  onCriado: (usuario: Usuario) => void;
}) {
  const [dados, setDados] = useState(vazio);
  const [erros, setErros] = useState<Partial<Record<keyof NovoUsuario, string>>>({});
  const [erroGeral, setErroGeral] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const campo = (nome: keyof NovoUsuario) => ({
    value: dados[nome],
    erro: erros[nome],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setDados((d) => ({ ...d, [nome]: e.target.value })),
  });

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErroGeral("");
    setSucesso("");
    const novos = {
      nome: obrigatorio(dados.nome, "Informe o nome."),
      email: validarEmail(dados.email),
      password:
        dados.password.length < 8
          ? "A senha precisa ter pelo menos 8 caracteres."
          : undefined,
    };
    setErros(novos);
    if (!semErros(novos)) return;
    setEnviando(true);
    try {
      const criado = await criarUsuario({
        ...dados,
        nome: dados.nome.trim(),
        email: dados.email.trim(),
      });
      onCriado(criado);
      setSucesso(`${criado.nome} foi cadastrado.`);
      setDados(vazio);
    } catch (err) {
      setErroGeral(
        err instanceof HttpError && err.status === 401
          ? err.message
          : err instanceof HttpError && err.status === 400
            ? "Confira os dados informados."
            : "Não foi possível cadastrar. Verifique se o e-mail já está em uso.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form noValidate onSubmit={enviar} className="space-y-6">
      {erroGeral && <Aviso tom="erro">{erroGeral}</Aviso>}
      {sucesso && <Aviso tom="sucesso">{sucesso}</Aviso>}
      <Campo id="usuario-nome" label="Nome" {...campo("nome")} />
      <Campo id="usuario-email" label="E-mail" type="email" {...campo("email")} />
      <Campo
        id="usuario-senha"
        label="Senha inicial"
        type="password"
        autoComplete="new-password"
        {...campo("password")}
      />
      <CampoSelect id="usuario-tipo" label="Perfil" {...campo("tipo")}>
        <option value="COMUM">Cliente</option>
        <option value="ADMIN">Administrador</option>
      </CampoSelect>
      <Button type="submit" className="w-full" size="lg" disabled={enviando}>
        {enviando ? "Cadastrando…" : "Cadastrar usuário"}
      </Button>
    </form>
  );
}
