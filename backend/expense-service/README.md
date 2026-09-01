# Expense Microservice

Core transaction and expense ledger microservice. Integrates with `CATEGORY-SERVICE` using **Spring Cloud OpenFeign** to retrieve category metadata.

- **Port**: `8083`
- **Database**: `spendwise_expense`
- **Endpoints**:
  - `GET /api/expenses` - Paginated and filtered expense list
  - `GET /api/expenses/{id}` - Single expense details
  - `POST /api/expenses` - Record new expense
  - `PUT /api/expenses/{id}` - Modify existing expense
  - `DELETE /api/expenses/{id}` - Delete expense
  - `GET /api/expenses/summary` - Expense overview metrics

### Running
```bash
mvn spring-boot:run
```
