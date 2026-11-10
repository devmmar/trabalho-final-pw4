// O token fica no localStorage; o payload e lido apenas para montar a interface.
// Quem decide o acesso de verdade e a API, que confere a assinatura em cada requisicao.
export const TOKEN_KEY = "ventana.token";

export type Perfil = "ADMIN" | "CLIENTE";

export interface Sessao {
  token: string;
  id: string;
  email: string;
  tipo: string;
  perfil: Perfil;
  expiraEm: number;
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // sem armazenamento disponivel, nao ha o que apagar
  }
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return new TextDecoder().decode(
    Uint8Array.from(binary, (c) => c.charCodeAt(0)),
  );
}

export function decodificar(token: string): Sessao | null {
  try {
    const payload = JSON.parse(decodeBase64Url(token.split(".")[1]));
    // A API envia o perfil em "tipo" (e tambem em "role", por compatibilidade).
    const tipo = String(payload.tipo ?? payload.role ?? "");
    return {
      token,
      id: String(payload.sub),
      email: String(payload.email ?? ""),
      tipo,
      perfil: tipo === "ADMIN" ? "ADMIN" : "CLIENTE",
      expiraEm: Number(payload.exp) * 1000,
    };
  } catch {
    return null;
  }
}

export function expirado(token: string) {
  const sessao = decodificar(token);
  return !sessao || !sessao.expiraEm || sessao.expiraEm <= Date.now();
}

export function sessaoAtual(): Sessao | null {
  const token = getToken();
  if (!token) return null;
  if (expirado(token)) {
    clearToken();
    return null;
  }
  return decodificar(token);
}

export const areaInicial = (sessao: Sessao) =>
  sessao.perfil === "ADMIN" ? "/painel" : "/cliente";

export const nomePerfil = (sessao: Sessao) =>
  sessao.perfil === "ADMIN" ? "Administrador" : "Cliente";
