# Morada — Trabalho final PW IV

Autor: Vitor Machado Marques (devmmar).

Repositorio: https://github.com/devmmar/trabalho-final-pw4

Para subir tudo com Docker Desktop aberto: ./scripts/docker-start.ps1. Depois: ./scripts/docker-check.ps1.

Aplicacao da imobiliaria de PW IV. Stack sorteada: React + Vite. Interface com TypeScript, Tailwind CSS e componentes shadcn/ui. Backend Spring Boot com Java 21, JPA e JWT.

## Organizacao

```text
frontend/src/
  pages/                         Composicao das telas
  features/imoveis/
    components/                  Cards, filtros, listagem, detalhes e hero
    hooks/                       Ciclo de carregamento e cancelamento
    services/                    Chamadas da API de imoveis
    types.ts                     Contratos de dados e filtros
    utils.ts                     Filtragem e selecao de preco
  components/layout/             Cabecalho e rodape compartilhados
  components/ui/                 Componentes oficiais shadcn
  lib/                           Cliente HTTP, formatacao e utilitarios
  styles/                        Tema global e estilos da vitrine
  App.tsx                        Entrada da aplicacao

backend/src/main/java/br/com/morada/imobiliaria/
  ImobiliariaApplication.java    Inicializacao do Spring Boot
  auth/                          Login, cadastro e DTOs de autenticacao
    security/                    JWT, regras de acesso e bootstrap do admin
  usuario/                       Usuarios, perfis e DTOs
  bairro/                        Cadastro de bairros
  tipoimovel/                    Tipos de imovel
  imovel/                        Imoveis e solicitacoes relacionadas
  foto/                          Upload e acesso a fotos
  email/                         Envio de e-mails
backend/src/main/resources/       Configuracoes e templates
backend/src/test/                 Testes de contexto e permissoes JWT
backend/sql/                      Schema e dados de exemplo
```

Cada funcionalidade do backend agrupa controller, service, repository, model e DTOs relacionados, evitando procurar a mesma regra em pastas globais. Autenticacao depende de usuario; imovel relaciona bairro e tipoimovel; foto relaciona imovel; envio de e-mails fica no modulo email. Os endpoints e contratos JSON foram preservados.

No front-end, paginas compoem a tela; componentes recebem dados por props; hooks cuidam do carregamento; services acessam o cliente HTTP. Componentes visuais nao fazem fetch diretamente. Novas funcionalidades devem seguir a mesma organizacao em features, sem concentrar regras em App.tsx.

## Docker

Execute os scripts da raiz do repositorio. O Compose aponta para as duas pastas deste diretorio e utiliza banco e uploads persistentes. Veja DOCKER.md.

## Desenvolvimento sem Docker

Front-end (com a API ativa em 8080):

```powershell
cd frontend
npm ci
npm run dev
```

Abra http://127.0.0.1:5173. O proxy /api aponta para http://127.0.0.1:8080. O backend desta aplicacao esta em backend/.

Backend: com Java 21, Maven e MySQL/MariaDB instalados, importe backend/sql/01_schema.sql e dados-exemplo.sql. Ajuste as variaveis SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME e SPRING_DATASOURCE_PASSWORD se necessario. Defina JWT_SECRET, BOOTSTRAP_ADMIN_EMAIL e BOOTSTRAP_ADMIN_PASSWORD e execute mvn spring-boot:run em backend.

## Validacao

- Em frontend: npm run build.
- Em backend, com banco ativo: mvn test.
- Com o Compose ativo, na raiz: ./scripts/docker-check.ps1.

## Checkpoint 1

Vitrine consome GET /imoveis real, com busca por texto, selecao de compra/aluguel, detalhes em modal, estados de carregamento/erro/lista vazia e layout responsivo. Ilustracoes identificadas substituem fotos ainda nao cadastradas. Login JWT e regras de acesso estao no backend; telas privadas, ofertas, contratos, favoritos, filtros completos e paginacao ficam para os proximos checkpoints.

Este repositorio contem exclusivamente o trabalho final. O material das aulas permanece no repositorio PWIV.
