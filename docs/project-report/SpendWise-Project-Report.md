# SpendWise: Distributed Personal Finance & Expense Intelligence System
## B.Tech 3rd-Year Major Project Report

---

### Abstract
In the modern financial landscape, individuals frequently struggle with fragmented spending tracking, inadequate budget compliance, and the absence of actionable fiscal insights. **SpendWise** is an enterprise-grade, distributed microservices solution tailored for personal expense management. Developed using the Spring Cloud ecosystem and React 18, the system implements a strict **Database-per-Service** architecture, asynchronous discovery via **Netflix Eureka**, an edge-level **API Gateway**, declarative inter-service communication using **OpenFeign**, and stateless security with **Spring Security & JWT**.

---

### 1. Introduction & Motivation
Financial literacy and budget tracking require accessible, low-latency, and reliable systems. Monolithic architectures often lead to tight database coupling, deployment bottlenecks, and single-point-of-failure vulnerabilities. SpendWise addresses these engineering challenges by decomposing personal finance workflows into isolated, scalable microservices:
1. **Auth Service**: Identity provider, password encryption (BCrypt), and JWT token management.
2. **Category Service**: Dynamic taxonomy and user-specific budgeting thresholds.
3. **Expense Service**: Core ledger tracking transactions with Feign resolution.
4. **Report Service**: Analytical service computing aggregations, breakdown charts, and budget warnings.
5. **Spring Cloud Gateway**: Reverse proxy handling unified CORS, rate limiting, and routing.
6. **Eureka Server**: Resilient service registration and dynamic discovery.

---

### 2. Architecture & Design Patterns
- **Database-per-Service**: Each microservice maintains complete sovereignty over its relational schema (`spendwise_auth`, `spendwise_category`, `spendwise_expense`, `spendwise_report`), preventing cross-domain schema coupling.
- **Service Discovery**: Microservices dynamically register with Eureka, allowing horizontal scalability without hardcoded IP bindings.
- **OpenFeign Declarative Clients**: Clean, interface-driven RPC calls between `Expense -> Category` and `Report -> Expense`.
- **Stateless JWT Security**: Protected microservice routes validate cryptographically signed HMAC-SHA256 JWT tokens.

---

### 3. Technology Stack
- **Backend Framework**: Spring Boot 3.3.x, Spring Cloud 2023.x, Spring Data JPA, Hibernate, JJWT
- **Inter-Service Communication**: Spring Cloud OpenFeign
- **Registry & Routing**: Netflix Eureka Server, Spring Cloud Gateway
- **Frontend Client**: React 18, Vite, Modern Vanilla CSS Design Tokens, Glassmorphism UI
- **Database**: MySQL 8.0 / H2 In-Memory
- **Containerization**: Docker, Docker Compose

---

### 4. Conclusion & Future Enhancements
SpendWise successfully demonstrates enterprise microservice patterns in a high-demand consumer finance context. Future roadmap includes AI-based receipt OCR scanning, bank account synchronization via Open Banking APIs, and Kafka-based event streaming for real-time notification alerts.
