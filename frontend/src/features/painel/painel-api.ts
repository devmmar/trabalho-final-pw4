import { request } from "@/lib/http";

// Todas as chamadas daqui exigem o token de administrador.
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export interface NovoUsuario {
  nome: string;
  email: string;
  password: string;
  tipo: "COMUM" | "ADMIN";
}

export const listarUsuarios = (signal?: AbortSignal) =>
  request<Usuario[]>("/users", { auth: true, signal });

export const criarUsuario = (usuario: NovoUsuario) =>
  request<Usuario>("/users", { method: "POST", body: usuario, auth: true });

export const alterarStatus = (id: number, status: string) =>
  request(`/imoveis/${id}/status`, {
    method: "PATCH",
    body: { status },
    auth: true,
  });

export const listarBairros = (signal?: AbortSignal) =>
  request<unknown[]>("/bairros", { signal });

export const STATUS = ["Disponivel", "Reservado", "Vendido", "Alugado"];
