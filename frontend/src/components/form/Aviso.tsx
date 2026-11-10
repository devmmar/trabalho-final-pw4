import type { ReactNode } from "react";

export function Aviso({
  tom = "info",
  children,
}: {
  tom?: "info" | "erro" | "sucesso";
  children: ReactNode;
}) {
  const cor =
    tom === "erro"
      ? "border-destructive text-destructive"
      : tom === "sucesso"
        ? "border-[#5f7a55] text-[#3f5a37]"
        : "border-foreground text-foreground";
  return (
    <p
      role={tom === "erro" ? "alert" : "status"}
      className={`border-l-2 py-1 pl-4 text-sm ${cor}`}
    >
      {children}
    </p>
  );
}
