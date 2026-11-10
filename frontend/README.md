# Front-end Ventana Imobiliaria

React + Vite + TypeScript, Tailwind CSS e shadcn/ui.

```powershell
npm ci
npm run dev
```

Abra http://127.0.0.1:5173 com API ativa em 8080. O proxy /api esta em vite.config.ts. No Docker, o Nginx encaminha /api ao container da API.

- Build: npm run build.
- Formatacao: npx prettier --write src.
- Novos componentes: npx shadcn@latest add nome-do-componente.

A estrutura e as convencoes estao em ../README.md. Os componentes shadcn ficam em src/components/ui; o tema em src/styles/globals.css; as funcionalidades de imoveis em src/features/imoveis; as paginas em src/pages.
