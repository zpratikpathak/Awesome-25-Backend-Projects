FROM maven:3.9-eclipse-temurin-17@sha256:1a352420f7aba21f5ad08df31bab55f74c013fb491f1ae8ab1dd7ff9ed698584 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B package
FROM eclipse-temurin:17-jdk-noble@sha256:fb79620c3f6ee8f1c7530a8dc4fd49e3b410bcef037694ad4858a1553bac4170
WORKDIR /app
COPY --from=build /app/target/expense-tracker-0.0.1-SNAPSHOT.jar app.jar
COPY smoke.java .
USER 10001
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]