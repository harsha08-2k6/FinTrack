# FinTrack - Personal Financial Expense Analytics & Budget Management System

> **Tagline**: *Track. Analyze. Save.*

FinTrack is an enterprise-grade, distributed Personal Financial Expense Analytics & Budget Management System built with a Spring Cloud Microservices Architecture and a Modern React Dashboard.

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
  │      Auth Service     │       │   Category Service    │       │  Transaction Service  │
  │  Port 8081 | DB: auth │       │ Port 8082 | DB: cat   │◄──────┤ (Income & Expenses)   │
  └───────────────────────┘       └───────────────────────┘ Feign │ Port 8083 | DB: exp   │
                                                                  └───────────┬───────────┘
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

| Service | Port | Database | Role & Endpoints |
| :--- | :--- | :--- | :--- |
| **Eureka Server** | `8761` | N/A | Service Discovery Registry |
| **API Gateway** | `8080` | N/A | Reverse Proxy, Dynamic Routing, CORS Filter |
| **Auth Service** | `8081` | `spendwise_auth` | User Registration, JWT Login, Profile Management |
| **Category Service** | `8082` | `spendwise_category` | Budget Categories (Food, Travel, Bills, etc.) & Monthly Spending Caps |
| **Transaction Service** | `8083` | `spendwise_expense` | **Income & Expenses** (`/api/transactions`, `/api/income`, `/api/expenses`) |
| **Report Service** | `8084` | `spendwise_report` | Savings Rate, Cashflow Analytics, Stock Market Trajectory |
| **React Frontend** | `5173` | Local Storage / State | React 18, Vite, Deep Navy + Emerald Design System |

---

## 📂 Final Feature Structure

```text
FINTRACK
│
├── Authentication
│   ├── Register
│   ├── Login
│   └── JWT Authentication
│
├── Dashboard
│   ├── Monthly Salary / Inflows
│   ├── Total Expenses
│   ├── Total Savings
│   ├── Savings Rate (%)
│   └── Financial Overview & Stock Market Trajectory
│
├── Income
│   ├── Log Monthly Salary
│   ├── Freelance / Returns / Dividends
│   └── Inflow History & CSV/JSON Export
│
├── Expenses
│   ├── Add Expense
│   ├── Edit Expense
│   ├── Delete Expense
│   └── Expense History & Receipt Preview
│
├── Categories
│   ├── Food
│   ├── Travel
│   ├── Shopping
│   ├── Bills
│   ├── Education
│   ├── Entertainment
│   └── Custom Categories
│
├── Budget
│   ├── Set Monthly Budget
│   ├── Track Spending Headroom
│   └── Budget Threshold Alerts
│
└── Reports
    ├── Executive Cashflow Statement
    ├── Income vs. Expense Trajectory
    ├── Category-wise Expenses Audit
    ├── Savings Trend
    └── Print PDF / CSV / JSON Statements
```

---

## 🛠️ Quick Start

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL is running on port `5432` with databases:
* `spendwise_auth`
* `spendwise_category`
* `spendwise_expense`
* `spendwise_report`

### 2. Start Microservices
Run the Spring Boot services in this sequence:
1. `backend/eureka-server` (`8761`)
2. `backend/auth-service` (`8081`)
3. `backend/category-service` (`8082`)
4. `backend/transaction-service` (`8083`)
5. `backend/report-service` (`8084`)
6. `backend/api-gateway` (`8080`)

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.
