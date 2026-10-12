# Roam Rentals — Premium Frontend Application

A commercial-grade, responsive automotive rental web platform built with **React 19**, **Vite 8**, and **React Router 7**.

---

## 🌟 Key Features

- **Automotive Visual Identity**: Deep navy/charcoal styling with electric teal/blue accents, subtle card shadows, and responsive glassmorphism navigation.
- **Dynamic Vehicle Showcase**: Real-time automotive photography with resilient SVG fallbacks across Sedans, SUVs, Hatchbacks, Vans, and Trucks.
- **Search & Filter Engine**: Search by make and model, category tabs, availability filters, and live sorting by price, model year, and brand.
- **Interactive Itinerary & Pricing**: Half-open rental interval calculations (`[pickUpDate, returnDate)` where the return date is exclusive) with transparent real-time rate breakdowns.
- **Authentication**: JWT token storage, role-aware routing, password visibility toggle, and instant one-click demo credentials (`Demo Customer` and `Demo Admin`).
- **Customer Journey Center**: View active & past trips, cancel confirmed reservations, pay via honest simulation workflows, and submit star reviews for completed trips.
- **Admin Operations Room**: Real-time KPI counters, complete fleet vehicle inventory CRUD (create, edit, delete), booking status lifecycle updates, maintenance scheduling, and user directory.

---

## 🛠️ Technology Stack

- **Framework**: React 19 (`^19.2.8`)
- **Build Tool**: Vite 8 (`^8.3.0`)
- **Router**: React Router 7 (`^7.18.4`)
- **HTTP Client**: Axios (`^1.20.0`)
- **Styling**: Vanilla CSS with customized design tokens (`DM Sans`, `Outfit`, `Plus Jakarta Sans`)
- **Code Quality**: Oxlint

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js `v20+` or `v22+` (detected on your system: `v22.21.0`)
- npm `v10+`

### 2. Installation
```powershell
cd c:\Rental_System_Project\frontend
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```powershell
cp .env.example .env
```
Default content in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Run Development Server
```powershell
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```powershell
npm run build
npm run preview
```

---

## 🚀 Deployment to Vercel

1. Connect your repository to Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Set Environment Variable:
   - `VITE_API_BASE_URL`: URL of your deployed Spring Boot backend (e.g., `https://roam-rentals-backend.onrender.com`).
6. Deploy! The included [`vercel.json`](./vercel.json) automatically routes all SPA paths back to `index.html`.
