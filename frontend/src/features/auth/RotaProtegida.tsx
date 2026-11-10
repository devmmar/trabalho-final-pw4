import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";
import { areaInicial, type Perfil } from "./session";

export function RotaProtegida({
  perfil,
  children,
}: {
  perfil: Perfil;
  children: ReactNode;
}) {
  const { sessao } = useAuth();
  const location = useLocation();
  if (!sessao)
    return <Navigate to="/login" replace state={{ de: location.pathname }} />;
  if (sessao.perfil !== perfil)
    return <Navigate to={areaInicial(sessao)} replace />;
  return children;
}
