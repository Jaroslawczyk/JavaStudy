W kursie było zapoznanie z JUnit ([lekcja o testach](#/lessons/j1-junit)). W prawdziwej pracy testy nie są opcją: bez nich kod nie przechodzi code review. Omówmy, jakie bywają testy i jakiego zestawu narzędzi używa się w backendzie Javy w 2026 roku.

## Piramida testów

```
          ▲  E2E / UI          — mało, wolne, drogie
         ▲▲▲ Integracyjne      — baza, HTTP, kolejki (Testcontainers)
       ▲▲▲▲▲▲ Jednostkowe      — dużo, szybkie, izolowane
```

Większość testów to szybkie testy jednostkowe; integracyjne sprawdzają styki z prawdziwą infrastrukturą; end-to-end — minimum.

## Narzędzia

| Zadanie | Narzędzie |
|---|---|
| Uruchamianie testów | **JUnit 6** (API Jupiter), TestNG |
| Asercje | **AssertJ** (fluent), Hamcrest |
| Zaślepki i mocki | **Mockito**, MockK (Kotlin) |
| Prawdziwe bazy/brokery w Dockerze | **Testcontainers** |
| Testy REST API | **REST Assured**, Spring `MockMvc`/`WebTestClient`/`RestTestClient` |
| Zaślepki zewnętrznych usług HTTP | **WireMock** |
| Scenariusze BDD | **Cucumber-JVM** (Gherkin: Given/When/Then) |
| Testy obciążeniowe | **Gatling**, **JMeter**, k6 |
| Reguły architektury | **ArchUnit** |
| Pokrycie i jakość testów | **JaCoCo**, testy mutacyjne **PIT** |

:::outdated "JUnit 4 → JUnit 5 → JUnit 6"
W wideo jest JUnit 4 (`@Before`, `org.junit.Test`). **JUnit 5** (2017) to nowa architektura Jupiter: `@BeforeEach`, `@DisplayName`, `@ParameterizedTest`, rozszerzenia. **JUnit 6** (wrzesień 2025) kontynuuje API Jupiter (testy z JUnit 5 przechodzą prawie bez zmian), wymaga Javy 17+, ujednolica wersje wszystkich modułów i dodaje adnotacje nullability JSpecify. Nowe projekty — JUnit 6; JUnit 4 w nowym kodzie nie używaj.
:::

## Test jednostkowy: JUnit + AssertJ + Mockito

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository repository;
    @Mock PaymentGateway payments;
    @InjectMocks OrderService service;

    @Test
    @DisplayName("Opłacone zamówienie zapisuje się ze statusem PAID")
    void paidOrderIsSaved() {
        when(payments.charge(any())).thenReturn(PaymentResult.success("tx-1"));

        Order order = service.place(new CreateOrder(42L, List.of(new Item("book", 2))));

        assertThat(order.status()).isEqualTo(OrderStatus.PAID);
        verify(repository).save(argThat(o -> o.customerId() == 42L));
    }

    @ParameterizedTest
    @CsvSource({"0, false", "1, true", "100, true", "101, false"})
    void quantityValidation(int qty, boolean valid) {
        assertThat(Item.isValidQuantity(qty)).isEqualTo(valid);
    }
}
```

Struktura **Arrange–Act–Assert** (lub Given–When–Then): przygotowanie, działanie, sprawdzenie. Jeden test — jedno zachowanie; nazwa opisuje oczekiwanie.

## Test integracyjny: Spring Boot + Testcontainers

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class ProductApiIT {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:18");

    @LocalServerPort int port;

    @Test
    void createsAndReadsProduct() {
        given().port(port).contentType(JSON)
               .body("""
                     {"name": "Kawa", "price": 29.99}
                     """)
        .when().post("/api/products")
        .then().statusCode(201).body("name", equalTo("Kawa"));
    }
}
```

## Dobre praktyki

- Test musi **padać**, gdy zachowanie się zepsuje — sprawdź to, tymczasowo psując kod (albo niech PIT zrobi to za ciebie).
- Nie mockuj tego, co do ciebie nie należy (biblioteki zewnętrzne), ani prostych obiektów-wartości; mockuj granice — repozytoria, zewnętrzne serwisy.
- Testy są niezależne od siebie i od kolejności uruchomienia; nie używaj `Thread.sleep` — do asynchroniczności jest **Awaitility**.
- Pokrycie 80 % to nie cel, a sygnał: ważniejsze, że sprawdzane są reguły biznesowe i przypadki brzegowe.
- **TDD** (red → green → refactor), pokazane w kursie, to dobry nawyk, zwłaszcza dla logiki z wieloma regułami.

## Zadanie domowe

:::task easy "Testy parametryzowane"
Napisz klasę `PasswordPolicy` z metodą `validate(String)` i pokryj ją testami parametryzowanymi (`@ParameterizedTest` + `@ValueSource`/`@CsvSource`) z czytelnymi `@DisplayName` i asercjami AssertJ.
:::

:::task medium "Mockito i sprawdzanie interakcji"
Dla serwisu rejestracji użytkownika (`UserRepository`, `PasswordEncoder`, `EmailSender`) napisz testy: udana rejestracja, zajęty e-mail, błąd wysyłki maila (użytkownik i tak zapisany, błąd zalogowany). Użyj `ArgumentCaptor` do sprawdzenia wysłanego maila.
:::

:::task hard "Pełny zestaw dla serwisu REST"
Dla serwisu zamówień na Spring Boot napisz: testy jednostkowe serwisu, `@WebMvcTest` kontrolera, `@DataJpaTest` z Testcontainers dla repozytorium, test integracyjny REST Assured, test zewnętrznego API płatności na WireMock (łącznie z limitem czasu), regułę ArchUnit „kontrolery nie sięgają bezpośrednio do repozytoriów”. Podłącz JaCoCo i PIT i przeanalizuj ocalałe mutanty.
:::
