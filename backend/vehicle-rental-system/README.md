# Roam Rentals — Vehicle Rental Backend REST API

High-performance Spring Boot 4 REST API powering the Roam Rentals platform with JWT security, role-based authorization, half-open interval reservation scheduling, simulated payments, maintenance tracking, and customer reviews.

---

## 🌟 Key Architecture & Capabilities

- **Layered Enterprise Architecture**: `Controller` → `Service` → `Repository` → `Database` with DTO separation and zero exposed database entity leaks.
- **Security & JWT**: BCrypt password hashing, stateless JWT Bearer token filter, role enforcement (`CUSTOMER`, `ADMIN`).
- **Half-Open Reservation Intervals**: Standard automotive date interval logic (`[startDate, endDate)` where `endDate` is exclusive).
- **Conflict Safeguards**: Overlapping date checking across active customer bookings and scheduled maintenance records.
- **Simulated Payment Engine**: Multi-channel simulated settlement (`CARD`, `UPI`, `NET_BANKING`, `CASH`) linked to verified bookings.
- **Automatic Seed Data**: Automatic initialization (`DataInitializer.java` on non-test profiles) creating default accounts (`admin@roamrentals.com` / `Admin@12345` and `customer@roamrentals.com` / `Customer@12345`) plus 8 diverse vehicles.

---

## 🛠️ Technology Stack

- **Java**: Java 21+ (Compatible with OpenJDK 21 - 25)
- **Framework**: Spring Boot 4.1.1
- **Persistence**: Spring Data JPA & Hibernate 7.4.5
- **Primary Database**: MySQL 8.0+
- **Testing Database**: In-memory H2 (active under profile `test`)
- **Security**: Spring Security 6 & JJWT 0.12.6
- **Build System**: Maven (via `./mvnw.cmd` wrapper)

---

## 🗄️ MySQL Database Setup

### 1. Database Creation
The application defaults to automatically creating the database via JDBC parameters:
`jdbc:mysql://localhost:3306/vehicle_rental_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`

You can also run the provided schema directly in MySQL:
- [`sql/schema.sql`](./sql/schema.sql): Complete DDL with foreign keys, indexes, and constraints.
- [`sql/seed.sql`](./sql/seed.sql): Sample dataset.

### 2. Environment Variables & `.env` File

The backend automatically loads settings from `.env` in the backend root directory. A `.env.example` template is provided:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DB_URL` | MySQL JDBC connection URL | `jdbc:mysql://localhost:3306/vehicle_rental_db?...` |
| `DB_USERNAME` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `Root` |
| `PORT` | HTTP Server port | `8080` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |
| `CORS_ALLOWED_ORIGINS` | Allowed origins for browser CORS | `http://localhost:5173,http://localhost:3000` |
| `JWT_SECRET` | 256-bit HMAC secret key | Secure random string |
| `JWT_EXPIRATION_MS` | Token lifespan | `86400000` (24 hours) |

---

## 🚀 Running the Backend

With the `.env` file in place, simply run:
```powershell
cd C:\Rental_System_Project\backend\vehicle-rental-system
.\mvnw.cmd spring-boot:run
```
*(No need to manually pass passwords in PowerShell environment variables!)*

---

## 🧪 Testing

Run all unit and integration tests using the isolated H2 test database:
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot"
.\mvnw.cmd test
```

---

## 📡 API Reference

### Public Endpoints
- `POST /api/auth/register` — Register a customer account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/vehicles` — Search fleet with filters (`make`, `model`, `type`, `status`)
- `GET /api/vehicles/page` — Paginated vehicle search
- `GET /api/vehicles/{id}` — Fetch vehicle by ID
- `GET /api/vehicles/{id}/reviews` — Fetch customer reviews for a vehicle

### Customer Protected Endpoints (Bearer Token required)
- `POST /api/bookings` — Create a reservation (`vehicleId`, `startDate`, `endDate`)
- `GET /api/bookings` — List authenticated user's reservations
- `GET /api/bookings/{id}` — View specific reservation details
- `DELETE /api/bookings/{id}` — Cancel a confirmed reservation
- `POST /api/bookings/{id}/payment` — Submit simulated payment (`CARD`, `UPI`, `NET_BANKING`, `CASH`)
- `GET /api/bookings/{id}/payment` — View payment voucher
- `POST /api/bookings/{id}/review` — Submit review for a completed booking (`rating`, `comment`)

### Admin Protected Endpoints (`ROLE_ADMIN` required)
- `GET /api/admin/dashboard` — KPI metrics (users, vehicles, bookings, confirmations)
- `GET /api/admin/vehicles` — List all vehicles
- `POST /api/admin/vehicles` — Create a new vehicle
- `PUT /api/admin/vehicles/{id}` — Update existing vehicle
- `DELETE /api/admin/vehicles/{id}` — Delete vehicle from fleet
- `GET /api/admin/bookings` — List all customer bookings
- `PATCH /api/admin/bookings/{id}/status` — Update booking status (`CONFIRMED`, `COMPLETED`, `CANCELLED`)
- `GET /api/admin/maintenance` — List maintenance records
- `POST /api/admin/maintenance` — Schedule vehicle maintenance
- `PUT /api/admin/maintenance/{id}` — Update maintenance record
- `DELETE /api/admin/maintenance/{id}` — Cancel maintenance record
- `GET /api/admin/users` — List registered users

---

## ☁️ Deployment to Render

1. Create a new **Web Service** on Render connected to this repository.
2. Set **Root Directory** to `backend/vehicle-rental-system`.
3. Set **Runtime** to `Java` (or Docker).
4. Set **Build Command**: `./mvnw clean package -DskipTests`
5. Set **Start Command**: `java -jar target/vehicle-rental-system-0.0.1-SNAPSHOT.jar`
6. Add Environment Variables:
   - `DB_URL`: Cloud MySQL JDBC connection string (e.g. from Aiven, PlanetScale, or Render MySQL)
   - `DB_USERNAME`: Cloud MySQL username
   - `DB_PASSWORD`: Cloud MySQL password
   - `JWT_SECRET`: Random 256-bit string
   - `PORT`: `8080`