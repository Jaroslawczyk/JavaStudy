Почти каждый бэкенд хранит данные в реляционной базе — чаще всего **PostgreSQL**. В Java для этого есть уровни абстракции: от «голого» **JDBC** до **Spring Data JPA**, где запрос пишется одной сигнатурой метода. Разберём их по порядку — понимать нижние уровни нужно, чтобы не страдать от «магии» верхних.

## JDBC — основа всего

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

:::warning "SQL-инъекции"
Никогда не склеивайте SQL из пользовательского ввода: `"… WHERE name = '" + name + "'"` — классическая уязвимость (`name = "' OR 1=1 --"`). Всегда `PreparedStatement` с параметрами `?` (или именованными параметрами во фреймворках).
:::

- **Пул соединений**: открывать соединение на каждый запрос дорого — используют пул **HikariCP** (по умолчанию в Spring Boot).
- **Транзакции**: `conn.setAutoCommit(false)` → `commit()`/`rollback()`; во фреймворках — `@Transactional`.

## Обёртки над JDBC

| Инструмент | Идея |
|---|---|
| **Spring `JdbcClient`** (6.1+) / `JdbcTemplate` | тот же SQL, но без шаблонного кода и с маппингом строк |
| **jOOQ** | типобезопасный SQL-DSL, генерируемый по схеме БД; любимец тех, кто «любит SQL» |
| **MyBatis** | SQL в XML/аннотациях + маппинг |

```java
List<Product> cheap = jdbcClient.sql("SELECT * FROM product WHERE price < :max")
        .param("max", 100)
        .query(Product.class)
        .list();
```

## JPA и Hibernate (ORM)

**ORM** отображает таблицы на классы. **JPA** (Jakarta Persistence) — стандарт, **Hibernate** — самая популярная реализация (в Spring Boot 4 — Hibernate 7). **EclipseLink**, **EBean** — альтернативы.

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

    protected Order() {}          // JPA требует конструктор без параметров
}
```

Ключевые понятия: **persistence context** (кэш первого уровня, отслеживание изменений — dirty checking), состояния сущности (transient, managed, detached, removed), **ленивая загрузка** (`FetchType.LAZY`), каскады.

:::warning "Проблема N+1"
Загрузили 100 заказов, а потом в цикле обратились к `order.getItems()` — Hibernate выполнит 1 + 100 запросов. Решения: `JOIN FETCH` в JPQL, `@EntityGraph`, batch fetching. Включайте логирование SQL в разработке и следите за количеством запросов.
:::

## Spring Data JPA

```java
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatusAndCreatedAtAfter(OrderStatus status, Instant after);   // запрос по имени метода

    @Query("select o from Order o join fetch o.items where o.id = :id")
    Optional<Order> findWithItems(long id);

    Page<OrderSummary> findByCustomerId(long customerId, Pageable pageable);        // проекция + пагинация
}
```

Spring генерирует реализацию сам. Удобно для CRUD, но сложные отчёты часто пишут на SQL (`JdbcClient`, jOOQ, нативные запросы).

## Миграции схемы

Схема базы меняется вместе с кодом — версионируйте её: **Flyway** (`V1__init.sql`, `V2__add_status.sql`) или **Liquibase**. `spring.jpa.hibernate.ddl-auto=update` — только для экспериментов, никогда для продакшена.

## Тестирование

**Testcontainers** поднимает настоящий PostgreSQL в Docker на время тестов — тесты проверяют реальные SQL, а не поведение H2, которое отличается от продакшен-базы.

:::interview "Вопросы с собеседования"
**Чем JPA отличается от Hibernate?** — JPA — спецификация (интерфейсы и аннотации), Hibernate — её реализация с дополнительными возможностями.

**Что такое N+1 и как его решить?** — Один запрос за списком сущностей и по запросу на каждую связанную коллекцию. Решается `JOIN FETCH`, `@EntityGraph`, batch size, DTO-проекциями.

**Что такое уровни изоляции транзакций?** — READ UNCOMMITTED, READ COMMITTED (по умолчанию в PostgreSQL), REPEATABLE READ, SERIALIZABLE; защищают от грязного, неповторяемого чтения и фантомов ценой производительности.
:::

## Домашнее задание

:::task easy "JDBC вручную"
Поднимите PostgreSQL в Docker (`docker run -e POSTGRES_PASSWORD=pass -p 5432:5432 postgres:18`), создайте таблицу `book` и напишите на чистом JDBC методы `save`, `findById`, `findAll`, `delete` с `PreparedStatement` и try-with-resources.
:::

:::task medium "Spring Data + Flyway"
Spring Boot-приложение со связью `Author 1—N Book`: миграции Flyway, сущности JPA, репозитории Spring Data, REST-эндпоинт `GET /authors/{id}/books`. Включите вывод SQL и найдите N+1 при выводе всех авторов с книгами, затем устраните его.
:::

:::task hard "Интеграционные тесты и транзакции"
Покройте репозитории тестами с Testcontainers (`@ServiceConnection`). Напишите сервис перевода денег между счетами с `@Transactional` и тест, доказывающий откат при исключении. Затем воспроизведите проблему «потерянного обновления» при одновременных переводах и решите её оптимистической блокировкой (`@Version`) или `SELECT … FOR UPDATE`.
:::
