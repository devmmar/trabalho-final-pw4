import { useMemo, useSyncExternalStore } from "react";
import { useAuth } from "@/features/auth/AuthContext";

// Favoritos ficam neste navegador, separados por cliente (sub do token).
const ouvintes = new Set<() => void>();

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  window.addEventListener("storage", ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
    window.removeEventListener("storage", ouvinte);
  };
}

function ler(chave: string | null) {
  if (!chave) return "[]";
  try {
    return localStorage.getItem(chave) ?? "[]";
  } catch {
    return "[]";
  }
}

export function useFavoritos() {
  const { sessao } = useAuth();
  const chave =
    sessao?.perfil === "CLIENTE" ? `ventana.favoritos.${sessao.id}` : null;
  const bruto = useSyncExternalStore(assinar, () => ler(chave));
  const ids = useMemo<number[]>(() => {
    try {
      const valor = JSON.parse(bruto);
      return Array.isArray(valor) ? valor.filter(Number.isInteger) : [];
    } catch {
      return [];
    }
  }, [bruto]);

  const alternar = (id: number) => {
    if (!chave) return;
    const novos = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    try {
      localStorage.setItem(chave, JSON.stringify(novos));
    } catch {
      return;
    }
    ouvintes.forEach((ouvinte) => ouvinte());
  };

  return {
    ativo: chave !== null,
    ids,
    tem: (id: number) => ids.includes(id),
    alternar,
  };
}
