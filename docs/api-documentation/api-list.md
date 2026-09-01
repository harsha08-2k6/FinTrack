# SpendWise API Reference & Endpoint Catalog

All client requests are routed through the **API Gateway** on port `8080`.

---

## 1. Authentication Service (`/api/auth/**`)
**Target Service**: `AUTH-SERVICE` (Port `8081`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & generate JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer JWT) |
| `POST` | `/api/auth/validate` | Validate token validity & claims | No |

### Request: Register
```json
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "Password123!",
  "fullName": "John Doe"
}
```

### Response: Auth Success
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "johndoe@example.com",
    "fullName": "John Doe",
    "role": "ROLE_USER"
  }
}
```

---

## 2. Category Service (`/api/categories/**`)
**Target Service**: `CATEGORY-SERVICE` (Port `8082`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | List all system & user categories | Yes |
| `GET` | `/api/categories/{id}` | Get category by ID | Yes |
| `POST` | `/api/categories` | Create custom category | Yes |
| `PUT` | `/api/categories/{id}` | Update existing category | Yes |
| `DELETE` | `/api/categories/{id}`| Delete category | Yes |

---

## 3. Expense Service (`/api/expenses/**`)
**Target Service**: `EXPENSE-SERVICE` (Port `8083`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/expenses` | List user expenses (paginated & filtered) | Yes |
| `GET` | `/api/expenses/{id}` | Get expense by ID with category details | Yes |
| `POST` | `/api/expenses` | Record a new expense | Yes |
| `PUT` | `/api/expenses/{id}` | Modify existing expense | Yes |
| `DELETE` | `/api/expenses/{id}`| Delete expense | Yes |
| `GET` | `/api/expenses/summary`| Quick summary of current month | Yes |
| `GET` | `/api/expenses/category/{catId}`| Get expenses by category | Yes |

---

## 4. Report Service (`/api/reports/**`)
**Target Service**: `REPORT-SERVICE` (Port `8084`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports/dashboard` | Overall financial metrics & analytics | Yes |
| `GET` | `/api/reports/category-breakdown` | Spending breakdown per category | Yes |
| `GET` | `/api/reports/monthly-trends` | Monthly expense trends (last 6-12 months)| Yes |
| `GET` | `/api/reports/budget-status` | Budget limit utilization status | Yes |
