**Dependency Injection** (DI) is an approach where an object doesn't create its dependencies itself (`new MySqlRepository()`) but receives them from outside. It's the foundation of Spring and most modern Java frameworks; you can't read Spring Boot code without understanding DI.

## The problem: hard-wired dependencies

```java
public class OrderService {
    private final OrderRepository repo = new MySqlOrderRepository();   // hard-wired
    private final EmailSender sender = new SmtpEmailSender("smtp.example.com");

    public void place(Order order) {
        repo.save(order);
        sender.send(order.customerEmail(), "Order received");
    }
}
```

- You can't test it without a real DB and a mail server.
- You can't switch MySQL to PostgreSQL without changing the class.
- The class knows **how to create** its dependencies — an extra responsibility (violating SRP and DIP from [SOLID](#/lessons/j2-oop-principles)).

## The solution: dependencies via the constructor

```java
public class OrderService {
    private final OrderRepository repo;
    private final EmailSender sender;

    public OrderService(OrderRepository repo, EmailSender sender) {   // depend on interfaces
        this.repo = repo;
        this.sender = sender;
    }
}

// "assembling" the application in one place (the composition root)
var service = new OrderService(new PostgresOrderRepository(dataSource), new SmtpEmailSender(cfg));

// in a test
var service = new OrderService(new InMemoryOrderRepository(), mock(EmailSender.class));
```

This is already DI — without any framework. **Inversion of Control (IoC)**: control over object creation is handed to the outside.

## A DI container: Spring

A large application has hundreds of objects; wiring them by hand is tedious. An **IoC container** does it for you: it finds classes, creates objects (**beans**), works out the order and injects dependencies.

```java
@Repository
public class PostgresOrderRepository implements OrderRepository { … }

@Service
public class OrderService {
    private final OrderRepository repo;
    private final EmailSender sender;

    public OrderService(OrderRepository repo, EmailSender sender) {   // no @Autowired needed
        this.repo = repo;
        this.sender = sender;
    }
}

@Configuration
public class MailConfig {
    @Bean
    EmailSender emailSender(MailProperties props) { return new SmtpEmailSender(props.host()); }
}
```

| Injection style | Verdict |
|---|---|
| **Constructor** | ✅ recommended: `final` fields, the object is always complete, easy to test |
| Setter | for optional dependencies |
| Field (`@Autowired private Repo repo;`) | ❌ can't be `final`, hides dependencies, harder to test |

Bean **scopes**: `singleton` (the default — one per container), `prototype` (a new one per request for it), `request`/`session` in web apps. If several implementations of an interface match — `@Primary` or `@Qualifier`.

## Other containers

| Tool | Distinctive feature |
|---|---|
| **Spring** | the most popular; reflection + runtime proxies |
| **Jakarta CDI** | the Jakarta EE standard (`@Inject`, `@ApplicationScoped`); used in Quarkus, WildFly |
| **Google Guice** | a lightweight module-based DI container |
| **Dagger 2** | compile-time code generation, popular on Android |
| **Micronaut / Quarkus** | DI at build time — fast startup and low memory, GraalVM Native Image friendly |

:::interview "Interview questions"
**What are DI and IoC?** — IoC is a principle: creating and wiring objects is handed to an external mechanism. DI is a concrete implementation: dependencies are passed to an object via its constructor/setter. It gives loose coupling and testability.

**Why is constructor injection better than field injection?** — Dependencies are explicit and `final`, the object can't be created in an incomplete state, tests can pass stubs without reflection; circular dependencies are detected immediately.

**What is a bean and what scopes are there?** — An object managed by the Spring container. Scopes: singleton, prototype, request, session, application.
:::

## Homework

:::task easy "Refactor to DI"
Take a class with `new` inside (e.g. a `ReportService` that creates a `FileWriter` and a `Clock` itself). Rewrite it with constructor injection and write a test with a fixed `Clock` and output to a `StringWriter`.
:::

:::task medium "Your own mini container"
Write a `SimpleContainer` with methods `register(Class<?> type)` and `<T> T get(Class<T> type)` that uses reflection to find the single public constructor, recursively creates its parameters and caches singletons. Detect and report a circular dependency.
:::

:::task hard "Spring Boot: two implementations"
Create a Spring Boot app with a `NotificationSender` interface and two implementations (`EmailSender`, `SmsSender`). Choose the implementation via the property `app.notifications=email|sms` (`@ConditionalOnProperty`), inject all implementations as a `List<NotificationSender>` into a "dispatcher", and write a test with `@SpringBootTest` and a bean replaced via `@MockitoBean`.
:::
