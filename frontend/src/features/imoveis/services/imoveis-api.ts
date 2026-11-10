import { getJson, request } from "@/lib/http";
import type { Imovel } from "../types";
export async function listarImoveis(signal: AbortSignal): Promise<Imovel[]> {
  const data = await getJson("/imoveis", signal);
  if (!Array.isArray(data))
    throw new Error("A lista de imóveis está indisponível no momento.");
  return data as Imovel[];
}

export async function buscarImovel(
  id: string,
  signal: AbortSignal,
): Promise<Imovel> {
  const data = await getJson(`/imoveis/${encodeURIComponent(id)}`, signal);
  if (!data || typeof data !== "object")
    throw new Error("Os dados deste imóvel estão indisponíveis.");
  return data as Imovel;
}

export interface Contato {
  nome: string;
  telefone: string;
  email: string;
  mensagem: string;
}

export const enviarContato = (id: number, contato: Contato) =>
  request(`/imoveis/sabermais/${id}`, { method: "POST", body: contato });
