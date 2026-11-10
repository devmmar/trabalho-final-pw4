import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Aviso } from "@/components/form/Aviso";
import { Campo, CampoTexto } from "@/components/form/Campo";
import { useAuth } from "@/features/auth/AuthContext";
import { HttpError } from "@/lib/http";
import {
  maximo,
  obrigatorio,
  semErros,
  validarEmail,
} from "@/lib/validacao";
import { enviarContato, type Contato } from "../services/imoveis-api";
import type { Imovel } from "../types";

type Erros = Partial<Record<keyof Contato, string>>;

function validar(c: Contato): Erros {
  return {
    nome:
      obrigatorio(c.nome, "Informe seu nome.") ?? maximo(c.nome, 150, "O nome"),
    telefone:
      obrigatorio(c.telefone, "Informe um telefone para contato.") ??
      (c.telefone.replace(/\D/g, "").length < 8
        ? "Informe um telefone válido, com DDD."
        : maximo(c.telefone, 30, "O telefone")),
    email: validarEmail(c.email) ?? maximo(c.email, 150, "O e-mail"),
    mensagem:
      obrigatorio(c.mensagem, "Escreva uma mensagem.") ??
      maximo(c.mensagem, 2000, "A mensagem"),
  };
}

export function ContatoForm({ imovel }: { imovel: Imovel }) {
  const { sessao } = useAuth();
  const [contato, setContato] = useState<Contato>({
    nome: "",
    telefone: "",
    email: sessao?.email ?? "",
    mensagem: `Olá, gostaria de saber mais sobre "${imovel.titulo}".`,
  });
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<"livre" | "enviando" | "enviado">(
    "livre",
  );
  const [erroGeral, setErroGeral] = useState("");

  const campo = (nome: keyof Contato) => ({
    value: contato[nome],
    erro: erros[nome],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setContato((c) => ({ ...c, [nome]: e.target.value })),
  });

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErroGeral("");
    const novos = validar(contato);
    setErros(novos);
    if (!semErros(novos)) return;
    setEstado("enviando");
    try {
      await enviarContato(imovel.id, {
        nome: contato.nome.trim(),
        telefone: contato.telefone.trim(),
        email: contato.email.trim(),
        mensagem: contato.mensagem.trim(),
      });
      setEstado("enviado");
    } catch (err) {
      setErroGeral(
        err instanceof HttpError && err.status === 400
          ? "Confira os dados do formulário."
          : err instanceof Error
            ? err.message
            : "Não foi possível enviar agora.",
      );
      setEstado("livre");
    }
  };

  if (estado === "enviado")
    return (
      <div className="space-y-4">
        <Aviso tom="sucesso">
          Recebemos seu contato. Enviamos os detalhes do imóvel para{" "}
          {contato.email.trim()}.
        </Aviso>
        <button
          type="button"
          className="link-line pb-0.5 text-sm"
          onClick={() => setEstado("livre")}
        >
          Enviar outra mensagem
        </button>
      </div>
    );

  return (
    <form noValidate onSubmit={enviar} className="space-y-6">
      {erroGeral && <Aviso tom="erro">{erroGeral}</Aviso>}
      <Campo id="contato-nome" label="Nome" autoComplete="name" {...campo("nome")} />
      <Campo
        id="contato-telefone"
        label="Telefone"
        type="tel"
        autoComplete="tel"
        placeholder="(55) 99999-0000"
        {...campo("telefone")}
      />
      <Campo
        id="contato-email"
        label="E-mail"
        type="email"
        autoComplete="email"
        {...campo("email")}
      />
      <CampoTexto id="contato-mensagem" label="Mensagem" {...campo("mensagem")} />
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={estado === "enviando"}
      >
        {estado === "enviando" ? "Enviando…" : "Quero saber mais"}
      </Button>
    </form>
  );
}
