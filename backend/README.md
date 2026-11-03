# Backend Morada

API Spring Boot / Java 21. Pacote raiz: br.com.morada.imobiliaria.

Os pacotes auth, usuario, bairro, tipoimovel, imovel, foto e email agrupam as responsabilidades por funcionalidade. Cada dominio mantem controller, service, repository, model e DTOs juntos. As regras de seguranca ficam em auth/security.

- Build: mvn package (testes exigem banco ativo).
- Executar: mvn spring-boot:run.
- Classe principal: ImobiliariaApplication.
- Artefato: target/imobiliaria-api-0.0.1-SNAPSHOT.jar.
- Schema e dados iniciais: sql/.

Prefira o ambiente Docker da raiz: ele configura banco, credenciais, uploads e e-mail local. Veja ../README.md e ../DOCKER.md para configuracao e operacao.
