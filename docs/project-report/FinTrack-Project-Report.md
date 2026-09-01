# FinTrack: Corporate Expense Management System
## B.Tech 3rd-Year Major Project Report

---

### Abstract
In the modern corporate ecosystem, enterprises struggle with fragmented employee expense filings, inadequate budgetary threshold enforcement, and delayed fiscal reconciliation. **FinTrack** is an enterprise-grade, distributed microservices solution tailored for corporate expense governance and financial analytics. Developed using the Spring Cloud ecosystem and React 18, the system implements a strict **Database-per-Service** architecture, dynamic service discovery via **Netflix Eureka**, an edge **API Gateway**, declarative inter-service communication using **OpenFeign**, and stateless security with **Spring Security & JJWT**.

---

### 1. Introduction & Problem Statement
Corporate budget compliance and transparent financial reporting require low-latency, resilient, and fault-tolerant architectures. Monolithic accounting systems suffer from database contention, lack of independent service scaling, and complex deployment cycles. FinTrack overcomes these challenges by decomposing corporate finance workflows into decoupled, scalable microservices:
1. **Auth Service (Port 8081)**: Identity provider, role-based authorization, BCrypt password hashing, and cryptographically signed JWT tokens.
2. **Category Service (Port 8082)**: Dynamic expense taxonomy, corporate departmental budgeting limits, and alert thresholds.
3. **Expense Service (Port 8083)**: Core transaction ledger, receipts attachment tracking, and Feign client resolution to Category Service.
4. **Report Service (Port 8084)**: Financial intelligence engine computing monthly trends, portfolio breakdowns, and threshold compliance alerts.
5. **API Gateway (Port 8080)**: Reverse proxy handling central routing, JWT validation filters, and CORS headers.
6. **Eureka Server (Port 8761)**: Resilient service registration and dynamic heartbeats.

---

### 2. Architecture & Design Patterns
- **Database-per-Service Pattern**: Complete schema isolation across `spendwise_auth`, `spendwise_category`, `spendwise_expense`, and `spendwise_report` databases.
- **Service Discovery**: Microservices dynamically announce instances to Eureka, enabling horizontal scaling without hardcoded host addresses.
- **OpenFeign Declarative Clients**: Synchronous RPC communication between `Expense -> Category` and `Report -> Expense`.
- **Stateless JWT Security**: Protected microservice endpoints validate cryptographically signed HMAC-SHA256 tokens passed in HTTP Bearer headers.

---

### 3. Technology Stack & Design System
- **Backend Framework**: Spring Boot 3.3.x, Spring Cloud 2023.x, Spring Data JPA, Hibernate, OpenFeign
- **Registry & Routing**: Netflix Eureka Server, Spring Cloud Gateway
- **Frontend Client**: React 18, Vite, Clean Navy (`#0F172A`) + Emerald (`#10B981`) FinTech Design System
- **Database**: PostgreSQL 16 / MySQL 8.0
- **Containerization**: Docker, Docker Compose

---

### 4. Verification & Results
All 6 backend microservices and the React frontend compile cleanly with zero errors. The system supports full CSV/Excel export, printable financial statements, category budget headroom tracking, and receipt inspection.
