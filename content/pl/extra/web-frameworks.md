Po Java SE następny krok niemal każdego programisty backendu to **framework webowy**: przyjmuje żądania HTTP, zamienia JSON na obiekty, podłącza bazę, bezpieczeństwo, metryki. W Europie i Polsce pod względem liczby ofert pracy z ogromną przewagą prowadzi **Spring Boot**; pozostałe frameworki warto znać dla szerszego spojrzenia.

## Spring Boot

Spring Framework to ekosystem (kontener DI, web, dane, bezpieczeństwo, integracje). **Spring Boot** to „nakładka” na niego: autokonfiguracja, wbudowany serwer (Tomcat), startery zależności, gotowość produkcyjna (Actuator: health, metryki).

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

Projekt tworzy się na **start.spring.io** (lub w IDEA) w minutę. Typowy stos: Spring Web (MVC), Spring Data JPA, Spring Security, Validation, Actuator, Flyway, Testcontainers.

:::note "Wersje na jesień 2026"
Aktualna gałąź to **Spring Boot 4.x** (4.1.1 — sierpień 2026) na **Spring Framework 7**: bazowa wersja Javy 17 (zalecane 21/25), Jakarta EE 11, Hibernate 7, JUnit 6, modułowe autokonfiguracje, wersjonowanie API, wbudowane ponowienia. Wiele projektów jest jeszcze na 3.x (bezpłatne wsparcie ostatniej gałęzi 3.5 kończy się w 2026 roku, dalej — tylko komercyjne). Naukę i nowe projekty zaczynaj na 4.x; czytając starsze artykuły pamiętaj: `javax.*` → `jakarta.*` (od Boot 3), `@MockBean` → `@MockitoBean`.
:::

## Alternatywy

| Framework | Mocne strony | Gdzie spotykany |
|---|---|---|
| **Quarkus** (Red Hat) | szybki start, mało pamięci, GraalVM Native Image, „Kubernetes-native”; standardy Jakarta (CDI, JAX-RS) | mikroserwisy w chmurze, stos Red Hat |
| **Micronaut** | DI na etapie kompilacji, szybki start | mikroserwisy, serverless |
| **Helidon** (Oracle) | zbudowany na wątkach wirtualnych | ekosystem Oracle |
| **Jakarta EE** (WildFly, Payara, Open Liberty) | standard, następca Java EE | banki, sektor publiczny, legacy |
| **Javalin** | minimalistyczny, bez „magii”, zrozumiały w godzinę | małe serwisy, nauka, Kotlin |
| **Play Framework** | reaktywny, nastawiony na Scalę | rzadko w nowych projektach Javy |
| **Vert.x** | zdarzeniowy, nieblokujący | wysokoobciążone bramki |

```java
// Javalin: cały serwer — kilka linii
var app = Javalin.create().start(7070);
app.get("/hello/{name}", ctx -> ctx.result("Hello, " + ctx.pathParam("name")));
```

:::tip "Czego się uczyć"
1. Najpierw — bez frameworka: HTTP, JSON, [HttpClient](#/extra/networking), [JDBC](#/extra/database-access) — żeby rozumieć, co „magia” robi za ciebie.
2. Potem **Spring Boot** dogłębnie: DI, MVC, Data JPA, transakcje, Security, testowanie, Actuator.
3. Quarkus/Micronaut — w razie potrzeby: koncepcje są te same (DI, REST, konfiguracja).
:::

## O co pytają w kontekście Springa

- Cykl życia beana, scopes, `@Component` vs `@Bean`.
- Jak działa autokonfiguracja (`@ConditionalOn…`, `AutoConfiguration.imports`).
- `@Transactional`: proxy, propagation, dlaczego nie działa przy wywołaniu z tej samej klasy.
- Spring MVC: `DispatcherServlet`, `@ControllerAdvice` dla błędów, walidacja.
- Profile i konfiguracja: `application.yml`, `@ConfigurationProperties`.
- Spring Security: filtry, JWT/OAuth2 resource server.

## Zadanie domowe

:::task easy "Hello, Spring Boot"
Utwórz projekt na start.spring.io (Web, Actuator), dodaj `GET /api/hello?name=…`, uruchom i sprawdź `/actuator/health`. Napisz test z `@WebMvcTest` i `MockMvc`.
:::

:::task medium "CRUD bez bazy"
REST API listy zadań (`Task`: id, title, done) z przechowywaniem w `ConcurrentHashMap`: `GET /tasks`, `GET /tasks/{id}`, `POST`, `PUT`, `DELETE`. Walidacja danych wejściowych, odpowiedź `404` przez `@ControllerAdvice` z `ProblemDetail`, testy każdego endpointu.
:::

:::task hard "Jeden serwis — trzy frameworki"
Zaimplementuj ten sam endpoint `GET /api/primes?limit=N` w Spring Boot, Quarkusie i Javalinie. Porównaj: czas startu, zużycie pamięci (`RSS`), rozmiar artefaktu; dla Quarkusa zbuduj native image. Wyciągnij wnioski, kiedy który framework jest na miejscu.
:::
