import { useEffect, useState } from "react";
import { HttpError } from "@/lib/http";
import { buscarImovel } from "../services/imoveis-api";
import type { Imovel } from "../types";
export function useImovel(id: string | undefined) {
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setNaoEncontrado(false);
    buscarImovel(id, controller.signal)
      .then(setImovel)
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (err instanceof HttpError && err.status === 404)
          setNaoEncontrado(true);
        else setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);
  return { imovel, loading, error, naoEncontrado };
}
