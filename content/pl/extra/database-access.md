Niemal każdy backend przechowuje dane w relacyjnej bazie — najczęściej w **PostgreSQL**. W Javie są do tego poziomy abstrakcji: od „gołego” **JDBC** do **Spring Data JPA**, gdzie zapytanie to jedna sygnatura metody. Omówmy je po kolei — niższe poziomy trzeba rozumieć, żeby nie cierpieć z powodu „magii” wyższych.

## JDBC — podstawa wszystkiego

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
Nigdy nie sklejaj SQL z danych użytkownika: `"… WHERE name = '" + name + "'"` to klasyczna podatność (`name = "' OR 1=1 --"`). Zawsze `PreparedStatement` z parametrami `?` (lub parametrami nazwanymi we frameworkach).
:::

- **Pula połączeń**: otwieranie połączenia na każde zapytanie jest kosztowne — używa się puli **HikariCP** (domyślnej w Spring Boot).
- **Transakcje**: `conn.setAutoCommit(false)` → `commit()`/`rollback()`; we frameworkach — `@Transactional`.

## Nakładki na JDBC

| Narzędzie | Idea |
|---|---|
| **Spring `JdbcClient`** (6.1+) / `JdbcTemplate` | ten sam SQL, ale bez szablonowego kodu i z mapowaniem wierszy |
| **jOOQ** | typobezpieczny DSL SQL generowany na podstawie schematu bazy; ulubieniec tych, którzy „kochają SQL” |
| **MyBatis** | SQL w XML/adnotacjach + mapowanie |

```java
List<Product> cheap = jdbcClient.sql("SELECT * FROM product WHERE price < :max")
        .param("max", 100)
        .query(Product.class)
        .list();
```

## JPA i Hibernate (ORM)

**ORM** odwzorowuje tabele na klasy. **JPA** (Jakarta Persistence) to standard, **Hibernate** — najpopularniejsza implementacja (w Spring Boot 4 — Hibernate 7). **EclipseLink**, **EBean** — alternatywy.

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

    protected Order() {}          // JPA wymaga konstruktora bezparametrowego
}
```

Kluczowe pojęcia: **persistence context** (cache pierwszego poziomu, śledzenie zmian — dirty checking), stany encji (transient, managed, detached, removed), **leniwe ładowanie** (`FetchType.LAZY`), kaskady.

:::warning "Problem N+1"
Wczytano 100 zamówień, a potem w pętli sięgnięto do `order.getItems()` — Hibernate wykona 1 + 100 zapytań. Rozwiązania: `JOIN FETCH` w JPQL, `@EntityGraph`, batch fetching. Włączaj logowanie SQL podczas developmentu i pilnuj liczby zapytań.
:::

## Spring Data JPA

```java
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatusAndCreatedAtAfter(OrderStatus status, Instant after);   // zapytanie z nazwy metody

    @Query("select o from Order o join fetch o.items where o.id = :id")
    Optional<Order> findWithItems(long id);

    Page<OrderSummary> findByCustomerId(long customerId, Pageable pageable);        // projekcja + paginacja
}
```

Spring sam generuje implementację. Wygodne dla CRUD, ale złożone raporty często pisze się w SQL (`JdbcClient`, jOOQ, zapytania natywne).

## Migracje schematu

Schemat bazy zmienia się razem z kodem — wersjonuj go: **Flyway** (`V1__init.sql`, `V2__add_status.sql`) lub **Liquibase**. `spring.jpa.hibernate.ddl-auto=update` — tylko do eksperymentów, nigdy na produkcję.

## Testowanie

**Testcontainers** podnosi prawdziwy PostgreSQL w Dockerze na czas testów — testy sprawdzają prawdziwy SQL, a nie zachowanie H2, które różni się od bazy produkcyjnej.

:::interview "Pytania rekrutacyjne"
**Czym JPA różni się od Hibernate?** — JPA to specyfikacja (interfejsy i adnotacje), Hibernate — jej implementacja z dodatkowymi możliwościami.

**Czym jest N+1 i jak go rozwiązać?** — Jedno zapytanie o listę encji i po zapytaniu na każdą powiązaną kolekcję. Rozwiązuje się przez `JOIN FETCH`, `@EntityGraph`, batch size, projekcje DTO.

**Czym są poziomy izolacji transakcji?** — READ UNCOMMITTED, READ COMMITTED (domyślny w PostgreSQL), REPEATABLE READ, SERIALIZABLE; chronią przed brudnym odczytem, niepowtarzalnym odczytem i fantomami kosztem wydajności.
:::

## Zadanie domowe

:::task easy "JDBC ręcznie"
Podnieś PostgreSQL w Dockerze (`docker run -e POSTGRES_PASSWORD=pass -p 5432:5432 postgres:18`), utwórz tabelę `book` i napisz w czystym JDBC metody `save`, `findById`, `findAll`, `delete` z `PreparedStatement` i try-with-resources.
:::

:::task medium "Spring Data + Flyway"
Aplikacja Spring Boot z relacją `Author 1—N Book`: migracje Flyway, encje JPA, repozytoria Spring Data, endpoint REST `GET /authors/{id}/books`. Włącz wypisywanie SQL, znajdź N+1 przy wypisywaniu wszystkich autorów z książkami, a potem go usuń.
:::

:::task hard "Testy integracyjne i transakcje"
Pokryj repozytoria testami z Testcontainers (`@ServiceConnection`). Napisz serwis przelewów między kontami z `@Transactional` i test udowadniający wycofanie przy wyjątku. Następnie odtwórz problem „utraconej aktualizacji” przy jednoczesnych przelewach i rozwiąż go blokadą optymistyczną (`@Version`) lub `SELECT … FOR UPDATE`.
:::
