import { getJson } from "@/lib/http";
import type { Imovel } from "../types";
export async function listarImoveis(signal: AbortSignal): Promise<Imovel[]> {
  const data = await getJson("/imoveis", signal);
  if (!Array.isArray(data))
    throw new Error("A lista de imóveis está indisponível no momento.");
  return data as Imovel[];
}
