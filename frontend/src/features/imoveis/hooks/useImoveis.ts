import { useEffect, useState } from "react";
import { listarImoveis } from "../services/imoveis-api";
import type { Imovel } from "../types";
export function useImoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    listarImoveis(controller.signal)
      .then(setImoveis)
      .catch((err) => {
        if (!controller.signal.aborted)
          setError(
            err instanceof TypeError
              ? "Não conseguimos conectar à imobiliária. Verifique se o servidor está ativo e tente novamente."
              : err.message,
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);

  return {
    imoveis,
    loading,
    error,
    reload: () => setRetry((value) => value + 1),
  };
}
