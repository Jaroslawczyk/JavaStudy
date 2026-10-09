После Java SE следующий шаг почти любого бэкенд-разработчика — **веб-фреймворк**: он принимает HTTP-запросы, превращает JSON в объекты, подключает базу, безопасность, метрики. В Европе и Польше по количеству вакансий с огромным отрывом лидирует **Spring Boot**; остальные фреймворки полезно знать для кругозора.

## Spring Boot

Spring Framework — экосистема (DI-контейнер, веб, данные, безопасность, интеграции). **Spring Boot** — «сборка» над ней: автоконфигурация, встроенный сервер (Tomcat), стартеры зависимостей, готовность к продакшену (Actuator: health, метрики).

```java
@SpringBootApplication
public class ShopApplication {
    public static void main(String[] args) { SpringApplication.run(ShopApplication.class, args); }
}

@RestController
@RequestMapping("/api/products")
class ProductController {
    private final ProductService service;
    ProductController(ProductService service) { this.service = service; }

    @GetMapping("/{id}")
    ProductDto get(@PathVariable long id) { return service.find(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    ProductDto create(@Valid @RequestBody CreateProductRequest req) { return service.create(req); }
}

record CreateProductRequest(@NotBlank String name, @Positive BigDecimal price) {}
```

Проект создаётся на **start.spring.io** (или в IDEA) за минуту. Типичный стек: Spring Web (MVC), Spring Data JPA, Spring Security, Validation, Actuator, Flyway, Testcontainers.

:::note "Версии на осень 2026"
Актуальная ветка — **Spring Boot 4.x** (4.1.1 — август 2026) на **Spring Framework 7**: базовая версия Java 17 (рекомендуется 21/25), Jakarta EE 11, Hibernate 7, JUnit 6, модульные автоконфигурации, API-версионирование, встроенные ретраи. Много проектов ещё на 3.x (бесплатная поддержка последней ветки 3.5 заканчивается в 2026 году, дальше — только коммерческая). Учебные и новые проекты начинайте на 4.x; при чтении старых статей помните: `javax.*` → `jakarta.*` (с Boot 3), `@MockBean` → `@MockitoBean`.
:::

## Альтернативы

| Фреймворк | Сильные стороны | Где встречается |
|---|---|---|
| **Quarkus** (Red Hat) | быстрый старт, мало памяти, GraalVM Native Image, «Kubernetes-native»; стандарты Jakarta (CDI, JAX-RS) | облачные микросервисы, Red Hat-стек |
| **Micronaut** | DI на этапе компиляции, быстрый старт | микросервисы, serverless |
| **Helidon** (Oracle) | построен на виртуальных потоках | Oracle-экосистема |
| **Jakarta EE** (WildFly, Payara, Open Liberty) | стандарт, наследник Java EE | банки, госсектор, легаси |
| **Javalin** | минималистичный, без «магии», понятен за час | небольшие сервисы, обучение, Kotlin |
| **Play Framework** | реактивный, ориентирован на Scala | редко в новых Java-проектах |
| **Vert.x** | событийный, неблокирующий | высоконагруженные шлюзы |

```java
// Javalin: весь сервер — несколько строк
var app = Javalin.create().start(7070);
app.get("/hello/{name}", ctx -> ctx.result("Hello, " + ctx.pathParam("name")));
```

:::tip "Что учить"
1. Сначала — без фреймворка: HTTP, JSON, [HttpClient](#/extra/networking), [JDBC](#/extra/database-access) — чтобы понимать, что «магия» делает за вас.
2. Затем **Spring Boot** глубоко: DI, MVC, Data JPA, транзакции, Security, тестирование, Actuator.
3. Quarkus/Micronaut — по необходимости: концепции те же (DI, REST, конфигурация).
:::

## Что спрашивают про Spring

- Жизненный цикл бина, scopes, `@Component` vs `@Bean`.
- Как работает автоконфигурация (`@ConditionalOn…`, `AutoConfiguration.imports`).
- `@Transactional`: прокси, propagation, почему не работает при вызове из того же класса.
- Spring MVC: `DispatcherServlet`, `@ControllerAdvice` для ошибок, валидация.
- Профили и конфигурация: `application.yml`, `@ConfigurationProperties`.
- Spring Security: фильтры, JWT/OAuth2 resource server.

## Домашнее задание

:::task easy "Hello, Spring Boot"
Создайте проект на start.spring.io (Web, Actuator), добавьте `GET /api/hello?name=…`, запустите и проверьте `/actuator/health`. Напишите тест с `@WebMvcTest` и `MockMvc`.
:::

:::task medium "CRUD без базы"
REST API для списка задач (`Task`: id, title, done) с хранением в `ConcurrentHashMap`: `GET /tasks`, `GET /tasks/{id}`, `POST`, `PUT`, `DELETE`. Валидация входных данных, ответ `404` через `@ControllerAdvice` с `ProblemDetail`, тесты на каждый эндпоинт.
:::

:::task hard "Один сервис — три фреймворка"
Реализуйте одинаковый эндпоинт `GET /api/primes?limit=N` на Spring Boot, Quarkus и Javalin. Сравните: время старта, потребление памяти (`RSS`), размер артефакта; для Quarkus соберите native image. Сделайте выводы, когда какой фреймворк уместен.
:::
