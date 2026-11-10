import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./features/auth/AuthContext";
import { RotaProtegida } from "./features/auth/RotaProtegida";
import { ClientePage } from "./pages/ClientePage";
import { ImovelPage } from "./pages/ImovelPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PainelPage } from "./pages/PainelPage";
import { VitrinePage } from "./pages/VitrinePage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<VitrinePage />} />
            <Route path="imoveis/:id" element={<ImovelPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route
              path="cliente"
              element={
                <RotaProtegida perfil="CLIENTE">
                  <ClientePage />
                </RotaProtegida>
              }
            />
            <Route
              path="painel"
              element={
                <RotaProtegida perfil="ADMIN">
                  <PainelPage />
                </RotaProtegida>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
