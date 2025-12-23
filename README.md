# E-commerce Sales Analytics Database

An expert-level SQL project demonstrating advanced database design, optimization, and analytics.

## Project Structure

- **`schema.sql`**: Core database schema (Tables, Constraints, Relationships).
- **`seed.sql`**: Initial data for testing (Categories, Products, Users, Orders).
- **`procedures.sql`**: Stored procedures for transactional logic (`sp_PlaceOrder`, `sp_UpdateStock`).
- **`triggers.sql`**: Database triggers for automation (`updated_at`, stock validation).
- **`views.sql`**: Pre-built views for common reports (`v_MonthlySales`, `v_ProductPerformance`).
- **`analytics.sql`**: Advanced analytical queries (CLV, Moving Averages, Window Functions).
- **`optimization.sql`**: Performance tuning (Indexes, EXPLAIN ANALYZE).

## How to Run

This project is written in **PostgreSQL** dialect.

1.  **Create Database**: Create a new database in your PostgreSQL instance.
2.  **Run Scripts**: Execute the files in the following order:
    1.  `schema.sql`
    2.  `seed.sql`
    3.  `procedures.sql`
    4.  `triggers.sql`
    5.  `views.sql`
    6.  `optimization.sql`
3.  **Analyze**: Run queries from `analytics.sql` to see insights.
