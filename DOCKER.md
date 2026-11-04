# Ambiente Docker

O Docker Desktop e o WSL 2 sao os unicos requisitos no Windows. Java, Maven, Node, MySQL, Tomcat, Nginx, phpMyAdmin e SMTP de teste rodam nos containers.

## Primeira execucao

Abra o Docker Desktop e aguarde o Engine iniciar. Se a instalacao do WSL solicitar reinicializacao, reinicie o Windows primeiro.

Na raiz do projeto:

```powershell
./scripts/docker-start.ps1
./scripts/docker-check.ps1
```

O primeiro comando gera `.env` com senhas aleatorias, compila os projetos e aguarda os healthchecks. Em outro computador, o script gera novas credenciais. Nao publique `.env`.

| Servico | Endereco | Acesso |
| --- | --- | --- |
| Front-end React | http://localhost:3000 | Vitrine + proxy /api |
| API + Tomcat embutido | http://localhost:8081/imoveis | Login em /public/login |
| phpMyAdmin | http://localhost:8090 | Servidor db, usuario imobiliaria, senha DB_PASSWORD do .env |
| E-mails de teste Mailpit | http://localhost:8025 | Captura os envios da aplicacao sem entregar e-mails reais |
| MySQL | 127.0.0.1:3307 | Banco projetoimobiliaria, usuario imobiliaria |

O administrador da API usa ADMIN_EMAIL e ADMIN_PASSWORD do `.env`. Root do banco usa DB_ROOT_PASSWORD, diferente da senha da aplicacao.

As portas evitam conflito com o ambiente Windows anterior; podem ser alteradas no `.env`. Todos os acessos publicados ficam restritos ao proprio computador.

## Uso diario

```powershell
docker compose up -d --wait
docker compose ps
docker compose logs -f api
docker compose down
```

Depois de editar o codigo, execute novamente `./scripts/docker-start.ps1` para reconstruir as imagens. O front-end servido pelo Nginx usa o build de producao; nao tem hot reload.

O banco e os uploads usam volumes persistentes. Parar containers ou reiniciar o computador nao apaga os dados. A politica `unless-stopped` reinicia os servicos com o Docker Engine, exceto os que voce parou explicitamente.

**Nao execute `docker compose down -v` para parar o projeto: isso apaga os volumes de banco e uploads.**

## Banco e dados

Na primeira inicializacao de um volume vazio, MySQL importa `backend/sql/01_schema.sql` e `dados-exemplo.sql`. O administrador e criado pela API. Novas inicializacoes preservam os dados; os SQLs nao sao reimportados em volumes existentes.

A instancia Docker inicia com os exemplos do repositorio. Para migrar dados de outro ambiente, use um backup SQL; o material das aulas permanece separado.

Backup:

```powershell
./scripts/docker-backup.ps1
```

O SQL fica em `backups/`, ignorada pelo Git. Para restaurar um backup, use a aba Importar do phpMyAdmin. Copie tambem `.env` e mantenha backup separado dos uploads; o SQL nao inclui arquivos de fotos.

## Arquitetura

- Front-end: build com Node 22; arquivos estaticos servidos por Nginx; `/api/` encaminhado para o servico `api`.
- API: compilada com Maven e Java 21; executada com JRE 21 e usuario sem privilegios. Spring Boot ja inclui o Tomcat compativel; nao precisa de outro Tomcat nem XAMPP no host.
- Banco: MySQL 8.4, usuario exclusivo da aplicacao, volume persistente e healthcheck que confirma acesso e importacao do schema.
- API inicia apos o banco estar pronto; front-end inicia apos a API responder.
- phpMyAdmin acompanha o banco; Mailpit captura os e-mails via SMTP interno na porta 1025.

Docker Desktop precisa estar aberto. Nao e necessario iniciar Java, Maven, XAMPP ou banco do Windows para usar este ambiente.

## Validacao do ambiente em 03/11/2026

O Docker Desktop iniciou com WSL 2 apos reiniciar o Windows. As imagens de frontend e API foram compiladas dentro do Docker, e os cinco servicos ficaram ativos.

- Frontend, proxy /api/imoveis, API /bairros, phpMyAdmin e Mailpit: HTTP 200.
- GET /users sem token: HTTP 401.
- Login do administrador e consulta autenticada de usuarios: HTTP 200.
- Banco inicializado pelos SQLs: 2 bairros, 2 tipos de imovel, 2 imoveis e 1 administrador.
- Envio de e-mail pela API: HTTP 200 e mensagem capturada somente no Mailpit local.
- Script docker-backup.ps1 executado com sucesso; dump SQL salvo em backups/ (fora do Git).

No uso diario, abra o Docker Desktop e execute ./scripts/docker-start.ps1 na raiz deste repositorio. Para verificar novamente os acessos, execute ./scripts/docker-check.ps1.
