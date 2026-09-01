# FinTrack: Corporate Expense Management System

FinTrack is an enterprise-grade, distributed corporate expense management and financial intelligence system designed as a full-stack **B.Tech 3rd-Year Computer Science Project**. It follows clean architecture, the **Database-per-Service** design pattern, Spring Cloud microservices ecosystem, and a clean Navy + Emerald React dashboard.

---

## 🏛️ System Architecture

```text
                               ┌─────────────────────────────┐
                               │   React Frontend (Vite)     │
                               │   http://localhost:5173     │
                               └──────────────┬──────────────┘
                                              │ HTTP + Bearer JWT
                                              ▼
                               ┌─────────────────────────────┐
                               │     Spring Cloud Gateway    │
                               │     http://localhost:8080   │
                               └──────────────┬──────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              │                               │                               │
              ▼                               ▼                               ▼
  ┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
  │      Auth Service     │       │   Category Service    │       │    Expense Service    │
  │  Port 8081 | DB: auth │       │ Port 8082 | DB: cat   │◄──────┤ Port 8083 | DB: exp   │
  └───────────────────────┘       └───────────────────────┘ Feign └───────────┬───────────┘
                                                                              │
                                                                              │ Feign
                                                                              ▼
                                                                  ┌───────────────────────┐
                                                                  │    Report Service     │
                                                                  │ Port 8084 | DB: rep   │
                                                                  └───────────────────────┘
                                              ▲
                                              │ Service Discovery
                                              │ & Heartbeats
                               ┌──────────────┴──────────────┐
                               │   Eureka Discovery Server   │
                               │   http://localhost:8761     │
                               └─────────────────────────────┘
```

---

## 🚀 Port Allocation Matrix

| Service | Port | Database | Technology |
| :--- | :--- | :--- | :--- |
| **Eureka Server** | `8761` | N/A | Spring Cloud Netflix Eureka |
| **API Gateway** | `8080` | N/A | Spring Cloud Gateway (Reactive) |
| **Auth Service** | `8081` | `spendwise_auth` | Spring Boot 3 + Spring Security 6 + JJWT |
| **Category Service** | `8082` | `spendwise_category` | Spring Boot 3 + Spring Data JPA |
| **Expense Service** | `8083` | `spendwise_expense` | Spring Boot 3 + Spring Data JPA + OpenFeign |
| **Report Service** | `8084` | `spendwise_report` | Spring Boot 3 + Spring Data JPA + OpenFeign |
| **React Frontend** | `5173` | Browser Storage | React 18 + Vite + Modern Glassmorphic CSS |

---

## 📂 Project Structure

```text
SpendWise/
├── frontend/                     # React + Vite Application
│   ├── public/
│   ├── src/
│   │   ├── assets/              # Icons, illustrations, branding
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Screen views (Dashboard, Expenses, Reports, etc.)
│   │   ├── services/            # API integration modules
│   │   ├── context/             # React AuthContext & Global State
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Formatters & Token utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Spring Cloud Microservices
│   ├── eureka-server/           # Service Discovery Registry (:8761)
│   ├── api-gateway/             # Central Request Router & Filter (:8080)
│   ├── auth-service/            # User Auth & JWT Token Provider (:8081)
│   ├── category-service/        # Expense Categories Management (:8082)
│   ├── expense-service/         # Expense Tracking & Feign Client (:8083)
│   └── report-service/          # Analytics & Financial Aggregation (:8084)
│
├── database/                     # SQL Schemas (Database-per-Service)
│   ├── auth-db.sql
│   ├── category-db.sql
│   ├── expense-db.sql
│   └── report-db.sql
│
├── docker/                       # Containerization & Deployment
│   ├── docker-compose.yml
│   └── README.md
│
├── testing/                      # Postman & Test Matrices
│   ├── postman/
│   └── test-cases/
│
├── docs/                         # B.Tech Project Documentation & Diagrams
│   ├── architecture/
│   ├── database/
│   ├── api-documentation/
│   └── project-report/
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Database Setup
Execute the scripts in the `database/` folder in your MySQL server:
```sql
SOURCE database/auth-db.sql;
SOURCE database/category-db.sql;
SOURCE database/expense-db.sql;
SOURCE database/report-db.sql;
```

### 2. Run Backend Services (In Order)
1. **Eureka Server**:
   ```bash
   cd backend/eureka-server && mvn spring-boot:run
   ```
   *Dashboard available at http://localhost:8761*
2. **Auth Service**:
   ```bash
   cd backend/auth-service && mvn spring-boot:run
   ```
3. **Category Service**:
   ```bash
   cd backend/category-service && mvn spring-boot:run
   ```
4. **Expense Service**:
   ```bash
   cd backend/expense-service && mvn spring-boot:run
   ```
5. **Report Service**:
   ```bash
   cd backend/report-service && mvn spring-boot:run
   ```
6. **API Gateway**:
   ```bash
   cd backend/api-gateway && mvn spring-boot:run
   ```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🐳 Docker Deployment
To start all services, databases, and frontend containers in one command:
```bash
cd docker
docker-compose up --build
```
