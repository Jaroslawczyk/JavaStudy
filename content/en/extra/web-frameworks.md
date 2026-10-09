After Java SE, the next step for almost any backend developer is a **web framework**: it accepts HTTP requests, turns JSON into objects, wires up the database, security and metrics. In Europe and Poland **Spring Boot** leads by a huge margin in the number of job ads; the other frameworks are worth knowing for perspective.

## Spring Boot

The Spring Framework is an ecosystem (a DI container, web, data, security, integrations). **Spring Boot** is a "packaging" on top of it: auto-configuration, an embedded server (Tomcat), dependency starters, production readiness (Actuator: health, metrics).

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

A project is generated at **start.spring.io** (or in IDEA) in a minute. A typical stack: Spring Web (MVC), Spring Data JPA, Spring Security, Validation, Actuator, Flyway, Testcontainers.

:::note "Versions as of autumn 2026"
The current line is **Spring Boot 4.x** (4.1.1 — August 2026) on **Spring Framework 7**: a Java 17 baseline (21/25 recommended), Jakarta EE 11, Hibernate 7, JUnit 6, modular auto-configuration, API versioning, built-in retries. Many projects are still on 3.x (free support for the last 3.5 line ends in 2026, after that it's commercial only). Start learning and new projects on 4.x; when reading older articles remember: `javax.*` → `jakarta.*` (since Boot 3), `@MockBean` → `@MockitoBean`.
:::

## Alternatives

| Framework | Strengths | Where you'll find it |
|---|---|---|
| **Quarkus** (Red Hat) | fast startup, low memory, GraalVM Native Image, "Kubernetes-native"; Jakarta standards (CDI, JAX-RS) | cloud microservices, the Red Hat stack |
| **Micronaut** | compile-time DI, fast startup | microservices, serverless |
| **Helidon** (Oracle) | built on virtual threads | the Oracle ecosystem |
| **Jakarta EE** (WildFly, Payara, Open Liberty) | the standard, successor to Java EE | banks, the public sector, legacy |
| **Javalin** | minimalist, no "magic", learnable in an hour | small services, learning, Kotlin |
| **Play Framework** | reactive, Scala-oriented | rare in new Java projects |
| **Vert.x** | event-driven, non-blocking | high-load gateways |

```java
// Javalin: the whole server in a few lines
var app = Javalin.create().start(7070);
app.get("/hello/{name}", ctx -> ctx.result("Hello, " + ctx.pathParam("name")));
```

:::tip "What to learn"
1. First — without a framework: HTTP, JSON, [HttpClient](#/extra/networking), [JDBC](#/extra/database-access) — to understand what the "magic" does for you.
2. Then **Spring Boot** in depth: DI, MVC, Data JPA, transactions, Security, testing, Actuator.
3. Quarkus/Micronaut — as needed: the concepts are the same (DI, REST, configuration).
:::

## What interviewers ask about Spring

- The bean life cycle, scopes, `@Component` vs `@Bean`.
- How auto-configuration works (`@ConditionalOn…`, `AutoConfiguration.imports`).
- `@Transactional`: proxies, propagation, why it doesn't work when called from the same class.
- Spring MVC: `DispatcherServlet`, `@ControllerAdvice` for errors, validation.
- Profiles and configuration: `application.yml`, `@ConfigurationProperties`.
- Spring Security: filters, a JWT/OAuth2 resource server.

## Homework

:::task easy "Hello, Spring Boot"
Create a project on start.spring.io (Web, Actuator), add `GET /api/hello?name=…`, run it and check `/actuator/health`. Write a test with `@WebMvcTest` and `MockMvc`.
:::

:::task medium "CRUD without a database"
A REST API for a task list (`Task`: id, title, done) stored in a `ConcurrentHashMap`: `GET /tasks`, `GET /tasks/{id}`, `POST`, `PUT`, `DELETE`. Input validation, a `404` response via `@ControllerAdvice` with `ProblemDetail`, tests for every endpoint.
:::

:::task hard "One service — three frameworks"
Implement the same endpoint `GET /api/primes?limit=N` on Spring Boot, Quarkus and Javalin. Compare: startup time, memory consumption (`RSS`), artifact size; build a native image for Quarkus. Draw conclusions about when each framework fits.
:::
