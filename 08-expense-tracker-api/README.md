# 08 - Expense Tracker API

A Java Spring Boot API for tracking personal expenses, utilizing an in-memory H2 Database.

## Tech Stack
- Java 17+
- Spring Boot (Web, Data JPA)
- H2 Database (In-Memory)
- Maven

## Setup

1. Build the project:
   ```bash
   mvn clean install
   ```
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## Endpoints

### `GET /api/expenses`
Retrieves all expenses.

### `POST /api/expenses`
Create a new expense.
**Body:**
```json
{
  "title": "Groceries",
  "amount": 50.00,
  "category": "Food",
  "date": "2023-10-01"
}
```

### `DELETE /api/expenses/{id}`
Delete an expense by ID.

### H2 Console
Available at: `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:mem:testdb`
- **User:** `sa`
- **Password:** *(empty)*
