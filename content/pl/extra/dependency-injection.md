**Wstrzykiwanie zależności** (Dependency Injection, DI) to sposób, w którym obiekt nie tworzy swoich zależności sam (`new MySqlRepository()`), lecz dostaje je z zewnątrz. To podstawa Springa i większości współczesnych frameworków Javy; bez zrozumienia DI nie da się czytać kodu Spring Boot.

## Problem: sztywne zależności

```java
public class OrderService {
    private final OrderRepository repo = new MySqlOrderRepository();   // na sztywno
    private final EmailSender sender = new SmtpEmailSender("smtp.example.com");

    public void place(Order order) {
        repo.save(order);
        sender.send(order.customerEmail(), "Zamówienie przyjęte");
    }
}
```

- Nie da się przetestować bez prawdziwej bazy i serwera pocztowego.
- Nie da się zamienić MySQL na PostgreSQL bez zmiany klasy.
- Klasa wie, **jak tworzyć** zależności — zbędna odpowiedzialność (naruszenie SRP i DIP z [SOLID](#/lessons/j2-oop-principles)).

## Rozwiązanie: zależności przez konstruktor

```java
public class OrderService {
    private final OrderRepository repo;
    private final EmailSender sender;

    public OrderService(OrderRepository repo, EmailSender sender) {   // zależymy od interfejsów
        this.repo = repo;
        this.sender = sender;
    }
}

// „składanie” aplikacji w jednym miejscu (composition root)
var service = new OrderService(new PostgresOrderRepository(dataSource), new SmtpEmailSender(cfg));

// w teście
var service = new OrderService(new InMemoryOrderRepository(), mock(EmailSender.class));
```

To już jest DI — bez żadnego frameworka. **Odwrócenie sterowania (IoC)**: kontrola nad tworzeniem obiektów jest przekazywana na zewnątrz.

## Kontener DI: Spring

W dużej aplikacji są setki obiektów; składanie ich ręcznie jest męczące. **Kontener IoC** robi to sam: znajduje klasy, tworzy obiekty (**beany**), ustala kolejność i podstawia zależności.

```java
@Repository
public class PostgresOrderRepository implements OrderRepository { … }

@Service
public class OrderService {
    private final OrderRepository repo;
    private final EmailSender sender;

    public OrderService(OrderRepository repo, EmailSender sender) {   // @Autowired niepotrzebne
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

| Sposób wstrzykiwania | Ocena |
|---|---|
| **Przez konstruktor** | ✅ zalecany: pola `final`, obiekt zawsze spójny, łatwo testować |
| Przez setter | dla zależności opcjonalnych |
| Przez pole (`@Autowired private Repo repo;`) | ❌ nie da się zrobić `final`, ukrywa zależności, trudniej testować |

**Zakresy** beanów: `singleton` (domyślnie — jeden na kontener), `prototype` (nowy przy każdym żądaniu), `request`/`session` w aplikacjach webowych. Jeśli pasuje kilka implementacji interfejsu — `@Primary` lub `@Qualifier`.

## Inne kontenery

| Narzędzie | Cecha |
|---|---|
| **Spring** | najpopularniejszy; refleksja + proxy w czasie działania |
| **Jakarta CDI** | standard Jakarta EE (`@Inject`, `@ApplicationScoped`); używany w Quarkusie, WildFly |
| **Google Guice** | lekki kontener DI oparty na modułach |
| **Dagger 2** | generowanie kodu przy kompilacji, popularny na Androidzie |
| **Micronaut / Quarkus** | DI na etapie budowania — szybki start i mało pamięci, przyjazne GraalVM Native Image |

:::interview "Pytania rekrutacyjne"
**Czym są DI i IoC?** — IoC to zasada: tworzenie i wiązanie obiektów oddaje się zewnętrznemu mechanizmowi. DI to konkretna realizacja: zależności przekazuje się obiektowi przez konstruktor/setter. Daje luźne powiązania i testowalność.

**Dlaczego wstrzykiwanie przez konstruktor jest lepsze niż przez pole?** — Zależności są jawne i `final`, obiektu nie da się utworzyć w niepełnym stanie, w testach można przekazać zaślepki bez refleksji; zależności cykliczne wykrywa się od razu.

**Czym jest bean i jakie są scope?** — Obiektem zarządzanym przez kontener Springa. Scope: singleton, prototype, request, session, application.
:::

## Zadanie domowe

:::task easy "Refaktoryzacja na DI"
Weź klasę z `new` w środku (np. `ReportService`, który sam tworzy `FileWriter` i `Clock`). Przepisz na wstrzykiwanie przez konstruktor i napisz test ze stałym `Clock` i zapisem do `StringWriter`.
:::

:::task medium "Własny mini-kontener"
Napisz `SimpleContainer` z metodami `register(Class<?> type)` i `<T> T get(Class<T> type)`, który przez refleksję znajduje jedyny publiczny konstruktor, rekurencyjnie tworzy jego parametry i cache'uje singletony. Wykryj i zgłoś zależność cykliczną.
:::

:::task hard "Spring Boot: dwie implementacje"
Utwórz aplikację Spring Boot z interfejsem `NotificationSender` i dwiema implementacjami (`EmailSender`, `SmsSender`). Wybierz implementację przez właściwość `app.notifications=email|sms` (`@ConditionalOnProperty`), wstrzyknij wszystkie implementacje listą `List<NotificationSender>` do „dystrybutora”, napisz test z `@SpringBootTest` i podmianą beana `@MockitoBean`.
:::
