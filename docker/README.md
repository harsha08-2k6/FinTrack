# Docker Deployment Guide for SpendWise

This directory provides the complete containerization configuration for spinning up the full SpendWise microservices ecosystem with a single command.

---

## 📦 Containers Launched

1. **`spendwise-mysql`** (`3306`) - MySQL 8.0 server with automated database seeding
2. **`spendwise-eureka`** (`8761`) - Service Discovery Registry
3. **`spendwise-auth`** (`8081`) - Authentication & Security Token Provider
4. **`spendwise-category`** (`8082`) - Category Management
5. **`spendwise-expense`** (`8083`) - Expense Tracking Microservice
6. **`spendwise-report`** (`8084`) - Financial Reporting & Analytics Service
7. **`spendwise-gateway`** (`8080`) - Spring Cloud API Gateway
8. **`spendwise-frontend`** (`5173`) - React 18 + Vite Web Client

---

## 🚀 Running with Docker Compose

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Build and Start All Services
```bash
docker-compose up --build -d
```

### 2. View Service Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f expense-service
docker-compose logs -f api-gateway
```

### 3. Stop All Services
```bash
docker-compose down
```

To also remove persisted MySQL volume data:
```bash
docker-compose down -v
```
