FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
# Os testes de integracao usam banco real e sao executados apos o Compose subir.
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-jammy
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system app && useradd --system --gid app app
WORKDIR /app
COPY --from=build --chown=app:app /build/target/imobiliaria-api-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir uploads && chown app:app uploads
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
