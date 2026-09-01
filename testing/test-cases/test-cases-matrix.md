# SpendWise Test Cases Matrix

## 1. Authentication Service Test Matrix

| Test ID | Module | Scenario / Description | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_AUTH_01** | Register | Successful user registration | Valid username, email, password, full name | Status `201 Created`, JWT token and user info returned | Passed |
| **TC_AUTH_02** | Register | Duplicate username registration | Existing username | Status `409 Conflict`, error message "Username already taken" | Passed |
| **TC_AUTH_03** | Register | Invalid email format | `invalid-email-string` | Status `400 Bad Request`, validation error | Passed |
| **TC_AUTH_04** | Login | Successful user login | Correct credentials | Status `200 OK`, valid JWT token returned | Passed |
| **TC_AUTH_05** | Login | Invalid password attempt | Correct username, wrong password | Status `401 Unauthorized`, error "Bad credentials" | Passed |
| **TC_AUTH_06** | Profile | Access profile with valid JWT | Header `Authorization: Bearer <valid_token>` | Status `200 OK`, user profile object | Passed |
| **TC_AUTH_07** | Profile | Access profile without JWT | No Authorization header | Status `401 Unauthorized` | Passed |

---

## 2. Expense & Category Services Test Matrix

| Test ID | Module | Scenario / Description | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_EXP_01** | Expense | Create valid expense | Title: "Groceries", Amount: 50.00, CategoryId: 1 | Status `201 Created`, Expense persisted with User ID | Passed |
| **TC_EXP_02** | Expense | Create expense with invalid category | Non-existing CategoryId | Feign Client handles 404, returns graceful validation error | Passed |
| **TC_EXP_03** | Expense | Filter expenses by date range | `startDate=2026-08-01&endDate=2026-08-31` | Status `200 OK`, list containing only August records | Passed |
| **TC_EXP_04** | Expense | Delete user expense | Valid `expenseId` owned by user | Status `204 No Content` or `200 OK` | Passed |
| **TC_EXP_05** | Expense | Attempt delete another user's expense | `expenseId` belonging to different user | Status `403 Forbidden` / `404 Not Found` | Passed |
| **TC_CAT_01** | Category | List default categories | Valid JWT | Status `200 OK`, default categories list returned | Passed |
| **TC_CAT_02** | Category | Create custom category | Name: "Crypto", Icon: "bitcoin", Color: "#ff9900" | Status `201 Created`, Custom category created for user | Passed |

---

## 3. Report Service Test Matrix

| Test ID | Module | Scenario / Description | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_REP_01** | Report | Generate dashboard summary | Authenticated User | Aggregated total spend, transaction count, category breakdown | Passed |
| **TC_REP_02** | Report | OpenFeign expense fetch | Expense Service active | Feign client retrieves expenses and calculates accurate sums | Passed |
| **TC_REP_03** | Report | Monthly trends analysis | 6 months historical data | Accurate month-by-month spending trend series | Passed |
