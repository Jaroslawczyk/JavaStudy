W przykładach edukacyjnych wynik wypisuje się przez `System.out.println`. Na produkcji tak się nie robi: potrzebne są poziomy ważności, czas, nazwa wątku i klasy, zapis do plików lub wysyłka do systemów zbierania logów (ELK, Loki, Datadog), konfiguracja bez rekompilacji. Do tego służą **loggery**.

## Fasada i implementacja

| Warstwa | Narzędzia |
|---|---|
| **Fasada** (API, które wywołuje kod) | **SLF4J** — standard de facto; `System.Logger` (Java 9) |
| **Implementacja** (gdzie i jak się zapisuje) | **Logback** (domyślny w Spring Boot), **Log4j 2**, `java.util.logging` (JUL), TinyLog |

Kod zależy tylko od fasady, a implementację można podmienić konfiguracją — biblioteki nie narzucają aplikacji swojego loggera.

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
            log.error("Payment failed for order {}", order.id(), e);   // wyjątek — ostatnim argumentem
            throw e;
        }
        log.debug("Order details: {}", order);
    }
}
```

Z Lombokiem — adnotacja `@Slf4j` na klasie zamiast deklaracji pola.

## Poziomy

| Poziom | Kiedy |
|---|---|
| `ERROR` | operacja nie została wykonana, potrzebna reakcja (alert) |
| `WARN` | coś poszło nie tak, ale system sobie poradził (ponowienie, fallback) |
| `INFO` | kluczowe zdarzenia biznesowe: start, zamówienie utworzone, płatność przeszła |
| `DEBUG` | szczegóły dla programisty, na produkcji zwykle wyłączony |
| `TRACE` | maksimum szczegółów |

## Zasady dobrego logowania

- **Placeholdery `{}`**, a nie konkatenacja: napis nie jest budowany, jeśli poziom jest wyłączony.
- **Nie loguj sekretów i danych osobowych**: hasła, tokeny, numery kart, PESEL — to i bezpieczeństwo, i RODO.
- **Cały wyjątek** (`log.error("…", e)`), a nie `e.getMessage()` — inaczej ginie stack trace.
- **Nie loguj i nie przekazuj dalej jednocześnie** tego samego wyjątku na każdym poziomie — wyjdzie pięć identycznych stack trace'ów.
- **Kontekst przez MDC**: `MDC.put("requestId", id)` — wartość trafi do każdej linii logu tego żądania; w mikroserwisach — trace-id z OpenTelemetry.

## Konfiguracja

```yaml
# application.yml (Spring Boot)
logging:
  level:
    root: INFO
    com.example.shop: DEBUG
    org.hibernate.SQL: DEBUG          # podejrzeć zapytania SQL
  structured:
    format:
      console: ecs                     # logi JSON (Spring Boot 3.4+): ecs, logstash, gelf
```

Logi strukturalne (JSON) są wygodne dla systemów zbierania: pola `level`, `logger`, `traceId` są indeksowane i filtrowane.

:::warning "Log4Shell"
W grudniu 2021 roku w Log4j 2 znaleziono krytyczną podatność CVE-2021-44228 (Log4Shell): napis w rodzaju `${jndi:ldap://…}` w logowanych danych pozwalał wykonać zdalny kod. Lekcja: aktualizuj zależności (Dependabot/Renovate), śledź CVE i nie traktuj logowania jako operacji „bezpiecznej”.
:::

:::outdated "System.out i java.util.logging"
`System.out.println` w kodzie serwerowym to antywzorzec: brak poziomów, brak konfiguracji, synchronizowane wypisywanie spowalnia. JUL (`java.util.logging`) działa, ale jest niewygodny w konfiguracji; w aplikacjach używa się SLF4J + Logback/Log4j 2 (most `jul-to-slf4j` zbiera też logi z JUL).
:::

## Zadanie domowe

:::task easy "Zamień println"
Weź dowolną aplikację konsolową z kursu i zamień `System.out.println` na SLF4J + Logback. Skonfiguruj `logback.xml`: format z czasem i wątkiem, poziom `DEBUG` dla swojego pakietu i `INFO` dla reszty.
:::

:::task medium "Plik z rotacją i MDC"
Skonfiguruj Logback do zapisu do pliku z rotacją według dni i rozmiaru (`SizeAndTimeBasedRollingPolicy`, przechowywać 7 dni). W programie wielowątkowym wkładaj do MDC identyfikator zadania i upewnij się, że jest wypisywany w każdej linii jego logu.
:::

:::task hard "Logi JSON i maskowanie"
W aplikacji Spring Boot włącz logi strukturalne w formacie ECS. Zaimplementuj maskowanie danych wrażliwych: e-maile i numery telefonów w komunikatach zamieniane są na `***` (własny konwerter Logbacka lub opakowanie obiektu z nadpisanym `toString`). Napisz test sprawdzający, że hasło z żądania nigdy nie trafia do logu.
:::
