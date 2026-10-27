# FinTrack - Enterprise Financial Expense Analytics & Budget Management System

> **Tagline**: *Track. Analyze. Save.*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.x-blue.svg)](https://spring.io/projects/spring-cloud)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ed.svg)](https://www.docker.com/)
[![Render](https://img.shields.io/badge/Render-Deployable-46E3B7.svg)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

FinTrack is an enterprise-grade, distributed Personal & Corporate Financial Expense Analytics and Budget Management System. Designed around a resilient **Spring Cloud Microservices Architecture** and a responsive **React 18 Dashboard**, FinTrack offers real-time transaction tracking, automated Gmail SMTP alerts, password recovery, savings goal tracking, predictive stock trajectory forecasting, and multi-database persistence.

---

## 🏛️ System Architecture

FinTrack uses Spring Cloud Gateway as a unified reverse proxy, Eureka Discovery Server for dynamic heartbeat registration, OpenFeign for declarative inter-service communication, and PostgreSQL for distributed data segregation.

```text
                               ┌─────────────────────────────────────────┐
                               │       React 18 Frontend (Vite)          │
                               │        http://localhost:5173            │
                               └────────────────────┬────────────────────┘
                                                    │ HTTP + Bearer JWT
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │          Spring Cloud Gateway           │
                               │          http://localhost:8080          │
                               └────────────────────┬────────────────────┘
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 │                                  │                                  │
                 ▼                                  ▼                                  ▼
     ┌───────────────────────┐          ┌───────────────────────┐          ┌───────────────────────┐
     │      Auth Service     │          │   Category Service    │          │  Transaction Service  │
     │  Port 8081 | DB: auth │          │ Port 8082 | DB: cat   │◄─────────┤ (Income & Expenses)   │
     └───────────────────────┘          └───────────────────────┘  Feign   │ Port 8084 | DB: exp   │
                                                                           └───────────┬───────────┘
                                                                                       │
                                                                                       │ Feign
                                                                                       ▼
                                                                           ┌───────────────────────┐
                                                                           │    Report Service     │
                                                                           │ Port 8085 | DB: rep   │
                                                                           └───────────────────────┘
                                                    ▲
                                                    │ Service Discovery & Heartbeats
                                     ┌──────────────┴──────────────┐
                                     │   Eureka Discovery Server   │
                                     │   http://localhost:9000     │
                                     └─────────────────────────────┘
```

### Notification & Event Engine

```text
[Transaction / Goal / Cron Trigger]
                │
                ▼
  [NotificationService] ──► [InAppNotification Repository] ──► Real-time Bell UI
                │
                ├──► [Evaluate User Preferences]
                ▼
        [EmailService (Async)]
                │
     (Spring JavaMailSender)
                ▼
  [smtp.gmail.com:587 STARTTLS] ──► User Corporate Email Inbox
```

---

## 🚀 Port Allocation Matrix

| Service | Port | Database | Responsibilities & Endpoints |
| :--- | :--- | :--- | :--- |
| **Eureka Server** | `9000` | N/A | Microservice registry, dynamic service discovery, and heartbeat monitor |
| **API Gateway** | `8080` | N/A | Reverse proxy, dynamic JWT route filtering, global CORS management |
| **Auth Service** | `8081` | `spendwise_auth` | User registration, JWT issuance, profile updates, password reset tokens & emails (`/api/auth/**`) |
| **Category Service** | `8082` | `spendwise_category` | Budget categories, monthly expenditure caps, and spending headroom (`/api/categories/**`) |
| **Transaction Service** | `8084` | `spendwise_expense` | Income logging, expense tracking, SMTP engine, in-app alerts, savings goal notifications (`/api/transactions/**`, `/api/income/**`, `/api/expenses/**`, `/api/notifications/**`) |
| **Report Service** | `8085` | `spendwise_report` | Executive cashflow analytics, savings rate, financial health metrics, and stock trajectory projections (`/api/reports/**`) |
| **React Frontend** | `5173` | Browser Storage | Interactive dashboard, transaction managers, notification modal, live analytics, and PDF/CSV exports |

---

## ✨ Core Features & Capabilities

### 🔐 1. Authentication & Secure Password Recovery
- **JWT-Based Authentication**: Stateless authentication with encrypted bearer token passing.
- **Forgot Password Flow**: Secure password reset workflow (`/forgot-password`) generating cryptographically random, 30-minute time-sensitive tokens.
- **HTML Password Reset Emails**: Branded transactional emails with interactive reset links.
- **Token Validation**: Pre-validation of reset tokens on `/reset-password` before updating user credentials.

### 💰 2. Unified Cashflow & Income Management
- **Multi-Source Inflow Tracking**: Log income from Salary, Freelancing, Investments, Dividends, and Business.
- **Recurring Income Configuration**: Mark regular salaries and set frequency tags.
- **Smart Filtering & Export**: Search, filter by source/date, and export income reports to **CSV** and **JSON**.

### 💳 3. Granular Expense & Budget Tracking
- **Expense Categorization**: Map expenditures to customizable categories (Food, Travel, Bills, Entertainment, etc.).
- **Budget Caps & Threshold Alerts**: Set monthly spending limits per category; receives proactive warnings when reaching 80% and 100% capacity.
- **Receipt Previews & Merchant Tagging**: Attach merchant data, payment modes, and notes.

### 🎯 4. Financial Goals & Savings Milestones
- **Target Savings Milestones**: Define emergency funds, investment targets, or purchase goals.
- **Dynamic Progress Tracking**: Real-time visual progress bars, remaining target amounts, and deadline projections.
- **Automated Milestone Alerts**: Trigger celebration emails and in-app notifications upon goal completion.

### 📧 5. Enterprise Gmail SMTP & In-App Notification Engine
- **Asynchronous Mail Dispatch**: High-performance background email delivery via Spring `JavaMailSender`.
- **Google App Password Authentication**: Compliant with Google 2-Step Verification standards.
- **In-App Notification Center**: Interactive notification bell in the Navbar with unread badges, mark-as-read, and deletion actions.
- **Granular User Preferences**: Toggle preferences for budget alerts, monthly financial statements, weekly summaries, and transaction confirmations.
- **Diagnostic Testing Utility**: Send live diagnostic test emails directly from the frontend UI modal.

### 📈 6. Executive Reports & Market Analytics
- **Executive Cashflow Statement**: Net cash flow, savings rate calculation, and expense-to-income ratios.
- **Stock Market Trajectory**: Historical and projected wealth accumulation curves based on savings efficiency.
- **Multi-Format Statement Export**: Generate downloadable statements in **PDF**, **CSV**, and **JSON**.

---

## 📂 Project Directory Structure

```text
FinTrack/
├── backend/
│   ├── api-gateway/            # Spring Cloud Gateway (Port 8080)
│   ├── auth-service/           # User Authentication & Password Reset (Port 8081)
│   ├── category-service/       # Category & Budget Cap Service (Port 8082)
│   ├── eureka-server/          # Netflix Eureka Service Registry (Port 9000)
│   ├── report-service/         # Analytics & Executive Reports (Port 8085)
│   └── transaction-service/    # Transactions, Income, & Notification Engine (Port 8084)
├── docker/
│   ├── docker-compose.yml      # Orchestrates all microservices & PostgreSQL
│   └── README.md               # Docker deployment instructions
├── docs/
│   ├── SMTP_NOTIFICATION_INTEGRATION.md  # Detailed SMTP architectural guide
│   └── project-report/         # Academic & technical project reports
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Sidebar, Charts, Cards)
│   │   ├── pages/              # Dashboard, Analytics, Goals, Income, Expenses, Auth
│   │   └── services/           # Axios API service integrations
│   ├── package.json
│   └── vite.config.js
├── .env.example                # Environment configuration template
├── render.yaml                 # Render Cloud Deployment Blueprint
└── README.md
```

---

## 🛠️ Quick Start Guide

### Prerequisites
- **Java**: JDK 17 or JDK 21+
- **Build Tool**: Apache Maven (`mvn` or included `./mvnw`)
- **Node.js**: Node 18+ and `npm`
- **Database**: PostgreSQL 14+ (or cloud instances like Supabase / Neon)
- **Email (Optional)**: Gmail account with a 16-character **Google App Password**

---

### Step 1: Clone Repository & Configure Environment

```bash
git clone https://github.com/harsha08-2k6/FinTrack.git
cd FinTrack
cp .env.example .env
```

Edit `.env` to configure your credentials:

```env
# Database Credentials
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/spendwise_expense
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password

# Gmail SMTP Email Notification Credentials
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_16_character_app_password
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_ENABLED=true

# Frontend URL
FINTRACK_APP_URL=http://localhost:5173
```

> [!TIP]
> **Generating a Google App Password**:
> 1. Sign in to [myaccount.google.com](https://myaccount.google.com) and enable **2-Step Verification**.
> 2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
> 3. Generate a password named `FinTrack` and copy the 16-character string into `SMTP_PASSWORD`.

---

### Step 2: Database Initialization

Create the 4 required PostgreSQL databases:
```sql
CREATE DATABASE spendwise_auth;
CREATE DATABASE spendwise_category;
CREATE DATABASE spendwise_expense;
CREATE DATABASE spendwise_report;
```

---

### Step 3: Run with Docker Compose (Recommended)

To launch the full microservices cluster with a single command:

```bash
cd docker
docker-compose up --build -d
```

---

### Step 4: Run Manually (Local Development)

#### 1. Start Spring Boot Microservices
Start each service in the following order:

```bash
# 1. Eureka Discovery Server (Port 9000)
cd backend/eureka-server && ./mvnw spring-boot:run

# 2. Auth Service (Port 8081)
cd backend/auth-service && ./mvnw spring-boot:run

# 3. Category Service (Port 8082)
cd backend/category-service && ./mvnw spring-boot:run

# 4. Transaction Service (Port 8084)
cd backend/transaction-service && ./mvnw spring-boot:run

# 5. Report Service (Port 8085)
cd backend/report-service && ./mvnw spring-boot:run

# 6. API Gateway (Port 8080)
cd backend/api-gateway && ./mvnw spring-boot:run
```

*(On Windows, replace `./mvnw` with `mvnw.cmd` or `mvn`)*

#### 2. Start the React Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
```

The frontend will be live at: **[http://localhost:5173](http://localhost:5173)**.

---

## 🌐 API Route Reference

### 🔐 Authentication Service (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/api/auth/profile` | Retrieve authenticated user profile |
| `POST` | `/api/auth/forgot-password` | Dispatch password reset email with token link |
| `POST` | `/api/auth/validate-reset-token`| Validate whether a token is active and unexpired |
| `POST` | `/api/auth/reset-password` | Update password using a valid token |

### 📁 Category Service (`/api/categories`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | List all expense categories & monthly budget caps |
| `POST` | `/api/categories` | Create a new budget category |
| `PUT` | `/api/categories/{id}` | Update category name or budget threshold |
| `DELETE` | `/api/categories/{id}` | Remove a category |

### 💵 Transaction Service (`/api/transactions`, `/api/income`, `/api/expenses`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/transactions` | Fetch all historical transactions (Income & Expenses) |
| `POST` | `/api/expenses` | Record an expense and evaluate category budget limits |
| `POST` | `/api/income` | Record income inflow |
| `PUT` | `/api/transactions/{id}` | Update existing transaction record |
| `DELETE` | `/api/transactions/{id}` | Delete transaction record |

### 🔔 Notification Service (`/api/notifications`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/notifications/in-app` | Get list of user in-app alerts |
| `PUT` | `/api/notifications/in-app/{id}/read` | Mark in-app alert as read |
| `GET` | `/api/notifications/preferences` | Retrieve notification delivery preferences |
| `PUT` | `/api/notifications/preferences` | Update email & in-app preferences |
| `POST` | `/api/notifications/test-email` | Send live diagnostic test email to user |

### 📊 Report Service (`/api/reports`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reports/dashboard` | Aggregated dashboard KPI statistics |
| `GET` | `/api/reports/monthly` | Category-wise spending breakdown |
| `GET` | `/api/reports/stock-trajectory` | Projected stock portfolio & wealth trajectory |

---

## ☁️ Deployment on Render

FinTrack includes a zero-configuration **Render Blueprint** ([`render.yaml`](render.yaml)).

1. Push your repository to GitHub.
2. Sign in to the [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** > **Blueprint**.
4. Connect the `FinTrack` repository.
5. Render will automatically parse `render.yaml` and provision:
   - Eureka Discovery Server
   - API Gateway
   - Auth Service
   - Category Service
   - Transaction Service
   - Report Service
   - React Static Site

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
