The course introduced JUnit ([the tests lesson](#/lessons/j1-junit)). In real work tests aren't optional: code without them doesn't pass review. Let's look at the kinds of tests and the toolset used in a Java backend in 2026.

## The testing pyramid

```
          ▲  E2E / UI          — few, slow, expensive
         ▲▲▲ Integration        — DB, HTTP, queues (Testcontainers)
       ▲▲▲▲▲▲ Unit             — many, fast, isolated
```

Most tests are fast unit tests; integration tests check the seams with real infrastructure; end-to-end tests are kept to a minimum.

## Tools

| Task | Tool |
|---|---|
| Running tests | **JUnit 6** (the Jupiter API), TestNG |
| Assertions | **AssertJ** (fluent), Hamcrest |
| Stubs and mocks | **Mockito**, MockK (Kotlin) |
| Real DBs/brokers in Docker | **Testcontainers** |
| REST API tests | **REST Assured**, Spring `MockMvc`/`WebTestClient`/`RestTestClient` |
| Stubbing external HTTP services | **WireMock** |
| BDD scenarios | **Cucumber-JVM** (Gherkin: Given/When/Then) |
| Load testing | **Gatling**, **JMeter**, k6 |
| Architecture rules | **ArchUnit** |
| Coverage and test quality | **JaCoCo**, **PIT** mutation testing |

:::outdated "JUnit 4 → JUnit 5 → JUnit 6"
The video uses JUnit 4 (`@Before`, `org.junit.Test`). **JUnit 5** (2017) brought the new Jupiter architecture: `@BeforeEach`, `@DisplayName`, `@ParameterizedTest`, extensions. **JUnit 6** (September 2025) continues the Jupiter API (JUnit 5 tests migrate almost unchanged), requires Java 17+, unifies the versions of all modules and adds JSpecify nullability annotations. New projects — JUnit 6; don't use JUnit 4 in new code.
:::

## A unit test: JUnit + AssertJ + Mockito

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository repository;
    @Mock PaymentGateway payments;
    @InjectMocks OrderService service;

    @Test
    @DisplayName("A paid order is saved with status PAID")
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

The **Arrange–Act–Assert** structure (or Given–When–Then): setup, action, check. One test — one behaviour; the name describes the expectation.

## An integration test: Spring Boot + Testcontainers

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

## Good practices

- A test must **fail** when the behaviour breaks — check it by temporarily breaking the code (or let PIT do it for you).
- Don't mock what you don't own (third-party libraries) or simple value objects; mock the boundaries — repositories, external services.
- Tests are independent of each other and of run order; don't use `Thread.sleep` — for async code there's **Awaitility**.
- 80% coverage isn't a goal but a signal: what matters more is that business rules and edge cases are checked.
- **TDD** (red → green → refactor), shown in the course, is a good habit, especially for logic with many rules.

## Homework

:::task easy "Parameterised tests"
Write a `PasswordPolicy` class with a `validate(String)` method and cover it with parameterised tests (`@ParameterizedTest` + `@ValueSource`/`@CsvSource`) with clear `@DisplayName`s and AssertJ assertions.
:::

:::task medium "Mockito and interaction checks"
For a user-registration service (`UserRepository`, `PasswordEncoder`, `EmailSender`) write tests: successful registration, an e-mail already taken, a failure to send the e-mail (the user is still saved, the error is logged). Use an `ArgumentCaptor` to check the sent e-mail.
:::

:::task hard "A full set for a REST service"
For a Spring Boot order service write: service unit tests, a `@WebMvcTest` for the controller, a `@DataJpaTest` with Testcontainers for the repository, a REST Assured integration test, a WireMock test for the external payment API (including a timeout), and an ArchUnit rule "controllers don't access repositories directly". Add JaCoCo and PIT and analyse the surviving mutants.
:::
