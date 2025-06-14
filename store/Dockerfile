# File: store/Dockerfile

# --- Build Stage ---
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# --- Final Image Stage ---
FROM eclipse-temurin:17-jre-alpine

# Accept database credentials as build arguments
ARG DB_URL
ARG DB_USER
ARG DB_PASS

# Set them as environment variables that Spring Boot will automatically use
ENV SPRING_DATASOURCE_URL=$DB_URL
ENV SPRING_DATASOURCE_USERNAME=$DB_USER
ENV SPRING_DATASOURCE_PASSWORD=$DB_PASS

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]