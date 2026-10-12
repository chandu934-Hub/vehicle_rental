# Roam Rentals — Full-Stack Vehicle Rental Management System

A commercial-grade, full-stack vehicle rental management platform engineered with **Spring Boot 4**, **Java 21+**, **MySQL**, **React 19**, and **Vite 8**.

---

## 🏗️ Project Architecture

```text
Rental_System_Project/
├── backend/
│   └── vehicle-rental-system/     # Spring Boot REST API
│       ├── src/main/java/         # Controllers, Entities, Services, Security, Config
│       ├── src/test/java/         # Automated unit & integration tests
│       ├── sql/                   # Production MySQL schema & seed scripts
│       ├── render.yaml            # Render deployment blueprint
│       ├── pom.xml                # Maven project descriptor
│       └── README.md              # Backend documentation & API spec
├── frontend/                      # React SPA
│   ├── src/
│   │   ├── components/            # Navbar, Footer, VehicleCard, Modals, Icons
│   │   ├── pages/                 # Home, Fleet, Detail, Auth, Dashboard, Booking, Admin
│   │   ├── context/               # AuthContext (JWT persistence & state)
│   │   ├── lib/                   # Axios API client & automotive image resolution
│   │   ├── RoamApp.jsx            # Application shell & route guard
│   │   └── index.css              # Custom design system (navy/teal palette)
│   ├── vercel.json                # Vercel SPA routing configuration
│   ├── package.json               # React 19, Vite 8, React Router 7
│   └── README.md                  # Frontend documentation
└── README.md                      # Master project documentation
```

---

## ⚡ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 21+ (Tested on OpenJDK 25), Spring Boot 4.1.1, Spring Security 6, JJWT 0.12.6, Spring Data JPA, Hibernate 7.4.5, Bean Validation |
| **Frontend** | React 19, Vite 8, React Router 7, Axios, Custom CSS with Responsive Design Tokens |
| **Databases** | MySQL 8.0+ (Primary persistent store) & In-memory H2 (Automated test profile) |
| **Quality** | JUnit 5, Mockito, Oxlint |

---

## 🚗 Default Credentials & Seed Data

When the application boots with an empty database, `DataInitializer.java` automatically seeds:

- **Administrator Account**:
  - Email: `admin@roamrentals.com`
  - Password: `Admin@12345`
  - Access: Full Control Room (`/admin`) — Fleet CRUD, Bookings Oversight, Maintenance Scheduling, User Directory
- **Customer Account**:
  - Email: `customer@roamrentals.com`
  - Password: `Customer@12345`
  - Access: Customer Portal (`/dashboard`) — Reservations, Simulated Payments, Trip Cancellations, Reviews
- **Initial Fleet (8 Vehicles)**:
  - Tesla Model 3 Long Range (Sedan)
  - BMW 3 Series Gran Limousine (Sedan)
  - Toyota RAV4 Hybrid AWD (SUV)
  - Mercedes-Benz GLC 300 4MATIC (SUV)
  - Hyundai Ioniq 5 Electric (Hatchback)
  - Volkswagen Golf GTI Performance (Hatchback)
  - Honda Odyssey Elite Touring (Van)
  - Ford F-150 Lariat SuperCrew (Truck)

---

## 🚦 How to Run the Project Locally

### 1. Start the Backend
In Windows PowerShell:
```powershell
# Set Java 21+ home
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot"

# Configure MySQL credentials (if MySQL has a root password)
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your_mysql_password"

cd c:\Rental_System_Project\backend\vehicle-rental-system
.\mvnw.cmd spring-boot:run
```
The REST API will start on **`http://localhost:8080`**.

### 2. Start the Frontend
In another PowerShell window:
```powershell
cd c:\Rental_System_Project\frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Validation

### Run Backend Tests (JUnit 5 + Mockito + In-Memory H2)
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot"
cd c:\Rental_System_Project\backend\vehicle-rental-system
.\mvnw.cmd test
```
Result: **11/11 tests pass successfully** (`BUILD SUCCESS`).

### Run Frontend Lint & Production Build
```powershell
cd c:\Rental_System_Project\frontend
npm run lint
npm run build
```
Result: **Build succeeds cleanly** (`dist/` generated in ~200ms).

---

## ☁️ Deployment Instructions

### Frontend → Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-api.onrender.com`
4. Deploy! The included `frontend/vercel.json` ensures all deep SPA routes resolve properly.

### Backend → Render
1. Create a new Web Service on [Render](https://render.com).
2. Set **Root Directory** to `backend/vehicle-rental-system`.
3. Set **Build Command**: `./mvnw clean package -DskipTests`
4. Set **Start Command**: `java -jar target/vehicle-rental-system-0.0.1-SNAPSHOT.jar`
5. Configure Environment Variables:
   - `DB_URL`: Production MySQL JDBC string (from Aiven, PlanetScale, or Render MySQL)
   - `DB_USERNAME`: Cloud database user
   - `DB_PASSWORD`: Cloud database password
   - `JWT_SECRET`: A long random secret key
   - `PORT`: `8080`

---

## ⚖️ Business Rules & Conventions

- **Half-Open Intervals**: Pick-up date is inclusive, return date is exclusive (`[startDate, endDate)`). Reserving Oct 10 to Oct 12 constitutes 2 rental days.
- **Maintenance & Booking Conflicts**: Reservations cannot overlap active customer bookings or scheduled vehicle maintenance.
- **Payment Processing**: Currently operates under an honest simulation mode. Payments can be settled via Card, UPI, Net Banking, or Cash without charging actual payment gateways.
- **Customer Reviews**: Verified reviews can only be submitted for completed bookings and are restricted to one review per booking.
