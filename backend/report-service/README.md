# Report Microservice

Financial analytics, category breakdown calculations, monthly trends, and budget intelligence. Uses **Spring Cloud OpenFeign** to fetch transaction data from `EXPENSE-SERVICE`.

- **Port**: `8084`
- **Database**: `spendwise_report`
- **Endpoints**:
  - `GET /api/reports/dashboard` - Complete financial overview report
  - `GET /api/reports/category-breakdown` - Detailed category spend percentages
  - `GET /api/reports/monthly-trends` - Month-over-month trend analytics
  - `GET /api/reports/alerts` - Automated budgeting notices

### Running
```bash
mvn spring-boot:run
```
