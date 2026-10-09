В курсе было знакомство с JUnit ([урок о тестах](#/lessons/j1-junit)). В реальной работе тесты — не опция: без них код не проходит ревью. Разберём, какие бывают тесты и какой набор инструментов используют в Java-бэкенде в 2026 году.

## Пирамида тестирования

```
          ▲  E2E / UI          — мало, медленные, дорогие
         ▲▲▲ Интеграционные    — БД, HTTP, очереди (Testcontainers)
       ▲▲▲▲▲▲ Модульные (unit) — много, быстрые, изолированные
```

Большая часть тестов — быстрые модульные; интеграционные проверяют стыки с реальной инфраструктурой; сквозных — минимум.

## Инструменты

| Задача | Инструмент |
|---|---|
| Запуск тестов | **JUnit 6** (Jupiter API), TestNG |
| Утверждения | **AssertJ** (fluent), Hamcrest |
| Заглушки и моки | **Mockito**, MockK (Kotlin) |
| Реальные БД/брокеры в Docker | **Testcontainers** |
| Тесты REST API | **REST Assured**, Spring `MockMvc`/`WebTestClient`/`RestTestClient` |
| Заглушки внешних HTTP-сервисов | **WireMock** |
| BDD-сценарии | **Cucumber-JVM** (Gherkin: Given/When/Then) |
| Нагрузочное тестирование | **Gatling**, **JMeter**, k6 |
| Архитектурные правила | **ArchUnit** |
| Покрытие и качество тестов | **JaCoCo**, мутационное тестирование **PIT** |

:::outdated "JUnit 4 → JUnit 5 → JUnit 6"
В видео — JUnit 4 (`@Before`, `org.junit.Test`). **JUnit 5** (2017) — новая архитектура Jupiter: `@BeforeEach`, `@DisplayName`, `@ParameterizedTest`, расширения. **JUnit 6** (сентябрь 2025) продолжает Jupiter API (тесты на JUnit 5 переходят почти без изменений), требует Java 17+, объединяет версии всех модулей и добавляет nullability-аннотации JSpecify. Новые проекты — JUnit 6; JUnit 4 в новом коде не используйте.
:::

## Модульный тест: JUnit + AssertJ + Mockito

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository repository;
    @Mock PaymentGateway payments;
    @InjectMocks OrderService service;

    @Test
    @DisplayName("Оплаченный заказ сохраняется со статусом PAID")
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

Структура **Arrange–Act–Assert** (или Given–When–Then): подготовка, действие, проверка. Один тест — одно поведение; имя описывает ожидание.

## Интеграционный тест: Spring Boot + Testcontainers

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

## Хорошие практики

- Тест должен **падать** при поломке поведения — проверьте это, временно сломав код (или PIT сделает это за вас).
- Не мокайте то, что вам не принадлежит (сторонние библиотеки) и простые объекты-значения; мокайте границы — репозитории, внешние сервисы.
- Тесты независимы друг от друга и от порядка запуска; не используйте `Thread.sleep` — для асинхронщины есть **Awaitility**.
- Покрытие 80 % — не цель, а сигнал: важнее, что проверяются бизнес-правила и граничные случаи.
- **TDD** (red → green → refactor), показанный в курсе, — хорошая привычка, особенно для логики с множеством правил.

## Домашнее задание

:::task easy "Параметризованные тесты"
Напишите класс `PasswordPolicy` с методом `validate(String)` и покройте его параметризованными тестами (`@ParameterizedTest` + `@ValueSource`/`@CsvSource`) с понятными `@DisplayName` и утверждениями AssertJ.
:::

:::task medium "Mockito и проверка взаимодействий"
Для сервиса регистрации пользователя (`UserRepository`, `PasswordEncoder`, `EmailSender`) напишите тесты: успешная регистрация, занятый e-mail, ошибка отправки письма (пользователь всё равно сохранён, ошибка залогирована). Используйте `ArgumentCaptor` для проверки отправленного письма.
:::

:::task hard "Полный набор для REST-сервиса"
Для Spring Boot-сервиса заказов напишите: модульные тесты сервиса, `@WebMvcTest` контроллера, `@DataJpaTest` с Testcontainers для репозитория, интеграционный тест REST Assured, тест внешнего платёжного API на WireMock (включая таймаут), правило ArchUnit «контроллеры не обращаются к репозиториям напрямую». Подключите JaCoCo и PIT и разберите выживших мутантов.
:::
