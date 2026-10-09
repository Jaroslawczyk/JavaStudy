Almost every backend stores data in a relational database — most often **PostgreSQL**. Java has several levels of abstraction for it: from "bare" **JDBC** to **Spring Data JPA**, where a query is a single method signature. Let's go through them in order — you need to understand the lower levels so you don't suffer from the "magic" of the upper ones.

## JDBC — the foundation of everything

```java
String sql = "SELECT id, name, price FROM product WHERE price < ?";
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setBigDecimal(1, new BigDecimal("100"));
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            products.add(new Product(rs.getLong("id"), rs.getString("name"), rs.getBigDecimal("price")));
        }
    }
}
```

:::warning "SQL injection"
Never build SQL from user input: `"… WHERE name = '" + name + "'"` is a classic vulnerability (`name = "' OR 1=1 --"`). Always use a `PreparedStatement` with `?` parameters (or named parameters in frameworks).
:::

- **A connection pool**: opening a connection for each query is expensive — use the **HikariCP** pool (the default in Spring Boot).
- **Transactions**: `conn.setAutoCommit(false)` → `commit()`/`rollback()`; in frameworks — `@Transactional`.

## Wrappers over JDBC

| Tool | Idea |
|---|---|
| **Spring `JdbcClient`** (6.1+) / `JdbcTemplate` | the same SQL, but without boilerplate and with row mapping |
| **jOOQ** | a type-safe SQL DSL generated from the DB schema; a favourite of those who "love SQL" |
| **MyBatis** | SQL in XML/annotations + mapping |

```java
List<Product> cheap = jdbcClient.sql("SELECT * FROM product WHERE price < :max")
        .param("max", 100)
        .query(Product.class)
        .list();
```

## JPA and Hibernate (ORM)

An **ORM** maps tables to classes. **JPA** (Jakarta Persistence) is the standard, **Hibernate** the most popular implementation (Hibernate 7 in Spring Boot 4). **EclipseLink** and **EBean** are alternatives.

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    protected Order() {}          // JPA requires a no-arg constructor
}
```

Key concepts: the **persistence context** (the first-level cache, change tracking — dirty checking), entity states (transient, managed, detached, removed), **lazy loading** (`FetchType.LAZY`), cascades.

:::warning "The N+1 problem"
You loaded 100 orders and then accessed `order.getItems()` in a loop — Hibernate runs 1 + 100 queries. Solutions: `JOIN FETCH` in JPQL, `@EntityGraph`, batch fetching. Enable SQL logging in development and watch the number of queries.
:::

## Spring Data JPA

```java
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatusAndCreatedAtAfter(OrderStatus status, Instant after);   // a query from the method name

    @Query("select o from Order o join fetch o.items where o.id = :id")
    Optional<Order> findWithItems(long id);

    Page<OrderSummary> findByCustomerId(long customerId, Pageable pageable);        // projection + paging
}
```

Spring generates the implementation itself. Convenient for CRUD, but complex reports are often written in SQL (`JdbcClient`, jOOQ, native queries).

## Schema migrations

The database schema changes along with the code — version it: **Flyway** (`V1__init.sql`, `V2__add_status.sql`) or **Liquibase**. `spring.jpa.hibernate.ddl-auto=update` — for experiments only, never for production.

## Testing

**Testcontainers** starts a real PostgreSQL in Docker for the duration of the tests — so tests check real SQL, not the behaviour of H2, which differs from the production database.

:::interview "Interview questions"
**How does JPA differ from Hibernate?** — JPA is a specification (interfaces and annotations), Hibernate is its implementation with extra features.

**What is N+1 and how do you fix it?** — One query for a list of entities plus one query per related collection. Fixed with `JOIN FETCH`, `@EntityGraph`, a batch size, DTO projections.

**What are transaction isolation levels?** — READ UNCOMMITTED, READ COMMITTED (the PostgreSQL default), REPEATABLE READ, SERIALIZABLE; they protect against dirty reads, non-repeatable reads and phantoms at the cost of performance.
:::

## Homework

:::task easy "JDBC by hand"
Start PostgreSQL in Docker (`docker run -e POSTGRES_PASSWORD=pass -p 5432:5432 postgres:18`), create a `book` table and write `save`, `findById`, `findAll`, `delete` in plain JDBC with `PreparedStatement` and try-with-resources.
:::

:::task medium "Spring Data + Flyway"
A Spring Boot app with an `Author 1—N Book` relationship: Flyway migrations, JPA entities, Spring Data repositories, a REST endpoint `GET /authors/{id}/books`. Enable SQL output, find the N+1 when listing all authors with their books, then eliminate it.
:::

:::task hard "Integration tests and transactions"
Cover the repositories with Testcontainers tests (`@ServiceConnection`). Write a money-transfer service with `@Transactional` and a test proving the rollback on an exception. Then reproduce the "lost update" problem with concurrent transfers and solve it with optimistic locking (`@Version`) or `SELECT … FOR UPDATE`.
:::
