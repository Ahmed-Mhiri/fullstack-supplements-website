# Use an official OpenJDK 17 runtime
FROM openjdk:17-slim-bullseye
WORKDIR /app

# Use a wildcard (*) to copy any .jar file. This is more robust.
COPY target/*.jar app.jar

# Inform Docker that the application will listen on port 8080
EXPOSE 8080
# Set the command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]