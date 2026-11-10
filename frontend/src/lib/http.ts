import { clearToken, expirado, getToken } from "@/features/auth/session";

export const SESSAO_EXPIRADA = "ventana:sessao-expirada";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface Options {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
  auth?: boolean;
}

function encerrarSessao(): never {
  clearToken();
  window.dispatchEvent(new Event(SESSAO_EXPIRADA));
  throw new HttpError(401, "Sua sessão expirou. Entre novamente.");
}

function mensagemPadrao(status: number) {
  if (status === 403) return "Você não tem permissão para esta ação.";
  if (status === 404) return "Não encontramos o que você procurou.";
  if (status >= 500)
    return "O servidor teve um problema. Tente novamente em instantes.";
  return "Não foi possível concluir a solicitação.";
}

export async function request<T = unknown>(
  path: string,
  { method = "GET", body, signal, auth = false }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (!token || expirado(token)) encerrarSessao();
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch("/api" + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new HttpError(
      0,
      "Não conseguimos conectar ao servidor. Verifique se ele está ativo e tente novamente.",
    );
  }

  // Token recusado pela API (expirado ou invalido): desloga.
  if (response.status === 401 && auth) encerrarSessao();
  if (!response.ok)
    throw new HttpError(response.status, mensagemPadrao(response.status));

  const text = await response.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

export const getJson = (path: string, signal?: AbortSignal) =>
  request(path, { signal });
