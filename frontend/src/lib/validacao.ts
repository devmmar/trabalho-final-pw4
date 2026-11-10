// Igual ao @Email da API: aceita dominio sem ponto, como admin@localhost.
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*$/;

export function validarEmail(valor: string) {
  if (!valor.trim()) return "Informe seu e-mail.";
  if (!EMAIL.test(valor.trim())) return "Informe um e-mail válido, como nome@exemplo.com.";
  return undefined;
}

export function obrigatorio(valor: string, mensagem: string) {
  return valor.trim() ? undefined : mensagem;
}

export function maximo(valor: string, limite: number, campo: string) {
  return valor.length > limite
    ? `${campo} deve ter no máximo ${limite} caracteres.`
    : undefined;
}

export const semErros = (erros: Record<string, string | undefined>) =>
  Object.values(erros).every((erro) => !erro);
