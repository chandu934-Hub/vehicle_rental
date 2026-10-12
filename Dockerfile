# Root Dockerfile for Roam Rentals Backend
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom from backend directory
COPY backend/vehicle-rental-system/.mvn/ .mvn/
COPY backend/vehicle-rental-system/mvnw backend/vehicle-rental-system/pom.xml ./
RUN chmod +x mvnw

# Cache dependencies
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build
COPY backend/vehicle-rental-system/src/ ./src/
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
