# --- Stage 1: Build the application with Maven ---
# Use a Maven image which includes the Java Development Kit (JDK)
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml file first to leverage Docker's dependency caching
COPY pom.xml .

# Copy the rest of your backend source code
COPY src ./src

# Run the Maven package command to build the .jar file.
# This creates the /app/target/*.jar file inside this build stage.
RUN mvn package -DskipTests


# --- Stage 2: Create the final lightweight image ---
# Use a slim Java Runtime Environment (JRE) for a small, secure final image
FROM openjdk:17-slim-bullseye

WORKDIR /app

# Copy the .jar file that was built in the 'build' stage
# This is the key step. We use a wildcard (*) so you don't have to change
# the version number here every time.
COPY --from=build /app/target/*.jar app.jar

# Inform Docker that the application will listen on port 8080
EXPOSE 8080

# Set the command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]