In learning examples results are printed with `System.out.println`. In production that's not how it's done: you need severity levels, the time, the thread and class names, writing to files or shipping to log collection systems (ELK, Loki, Datadog), and configuration without recompiling. That's what **loggers** are for.

## Facade and implementation

| Layer | Tools |
|---|---|
| **Facade** (the API code calls) | **SLF4J** — the de facto standard; `System.Logger` (Java 9) |
| **Implementation** (where and how it's written) | **Logback** (the Spring Boot default), **Log4j 2**, `java.util.logging` (JUL), TinyLog |

Code depends only on the facade, and the implementation can be swapped via configuration — libraries don't force their logger on the application.

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    public void place(Order order) {
        log.info("Placing order id={} items={}", order.id(), order.items().size());
        try {
            payment.charge(order);
        } catch (PaymentException e) {
            log.error("Payment failed for order {}", order.id(), e);   // the exception goes last
            throw e;
        }
        log.debug("Order details: {}", order);
    }
}
```

With Lombok — the `@Slf4j` annotation on the class instead of declaring the field.

## Levels

| Level | When |
|---|---|
| `ERROR` | an operation failed, a reaction is needed (an alert) |
| `WARN` | something went wrong, but the system coped (a retry, a fallback) |
| `INFO` | key business events: startup, order created, payment succeeded |
| `DEBUG` | details for the developer, usually off in production |
| `TRACE` | maximum detail |

## Rules of good logging

- **`{}` placeholders**, not concatenation: the string isn't built if the level is disabled.
- **Don't log secrets or personal data**: passwords, tokens, card numbers, PESEL — this is both security and GDPR/RODO.
- **The whole exception** (`log.error("…", e)`), not `e.getMessage()` — otherwise the stack trace is lost.
- **Don't both log and rethrow** the same exception at every layer — you'll get five identical stack traces.
- **Context via MDC**: `MDC.put("requestId", id)` — the value appears in every log line of that request; in microservices — the trace id from OpenTelemetry.

## Configuration

```yaml
# application.yml (Spring Boot)
logging:
  level:
    root: INFO
    com.example.shop: DEBUG
    org.hibernate.SQL: DEBUG          # see SQL queries
  structured:
    format:
      console: ecs                     # JSON logs (Spring Boot 3.4+): ecs, logstash, gelf
```

Structured (JSON) logs are convenient for collection systems: the `level`, `logger`, `traceId` fields are indexed and filterable.

:::warning "Log4Shell"
In December 2021 a critical vulnerability, CVE-2021-44228 (Log4Shell), was found in Log4j 2: a string like `${jndi:ldap://…}` in logged data allowed remote code execution. The lesson: keep dependencies updated (Dependabot/Renovate), watch CVEs and don't treat logging as a "safe" operation.
:::

:::outdated "System.out and java.util.logging"
`System.out.println` in server code is an anti-pattern: no levels, no configuration, and the synchronised output slows things down. JUL (`java.util.logging`) works but is awkward to configure; applications use SLF4J + Logback/Log4j 2 (the `jul-to-slf4j` bridge collects JUL logs too).
:::

## Homework

:::task easy "Replace println"
Take any console app from the course and replace `System.out.println` with SLF4J + Logback. Configure `logback.xml`: a format with time and thread, `DEBUG` for your package and `INFO` for the rest.
:::

:::task medium "A rotating file and MDC"
Configure Logback to write to a file rotated by day and size (`SizeAndTimeBasedRollingPolicy`, keep 7 days). In a multithreaded program put a task id into MDC and make sure it appears in every line of that task's log.
:::

:::task hard "JSON logs and masking"
In a Spring Boot app enable structured logs in ECS format. Implement masking of sensitive data: e-mails and phone numbers in messages are replaced with `***` (a custom Logback converter or a wrapper object with an overridden `toString`). Write a test checking that the password from a request never ends up in the log.
:::
