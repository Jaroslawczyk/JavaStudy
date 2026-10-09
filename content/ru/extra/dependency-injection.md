**Внедрение зависимостей** (Dependency Injection, DI) — способ, при котором объект не создаёт свои зависимости сам (`new MySqlRepository()`), а получает их снаружи. Это основа Spring и большинства современных Java-фреймворков; без понимания DI невозможно читать код Spring Boot.

## Проблема: жёсткие зависимости

```java
public class OrderService {
    private final OrderRepository repo = new MySqlOrderRepository();   // жёстко
    private final EmailSender sender = new SmtpEmailSender("smtp.example.com");

    public void place(Order order) {
        repo.save(order);
        sender.send(order.customerEmail(), "Заказ принят");
    }
}
```

- Нельзя протестировать без реальной БД и почтового сервера.
- Нельзя заменить MySQL на PostgreSQL без изменения класса.
- Класс знает, **как создавать** зависимости, — лишняя ответственность (нарушение SRP и DIP из [SOLID](#/lessons/j2-oop-principles)).

## Решение: зависимости через конструктор

```java
public class OrderService {
    private final OrderRepository repo;
    private final EmailSender sender;

    public OrderService(OrderRepository repo, EmailSender sender) {   // зависим от интерфейсов
        this.repo = repo;
        this.sender = sender;
    }
}

// «сборка» приложения в одном месте (composition root)
var service = new OrderService(new PostgresOrderRepository(dataSource), new SmtpEmailSender(cfg));

// в тесте
var service = new OrderService(new InMemoryOrderRepository(), mock(EmailSender.class));
```

Это уже DI — без всякого фреймворка. **Инверсия управления (IoC)**: управление созданием объектов передаётся наружу.

## DI-контейнер: Spring

В большом приложении сотни объектов; собирать их вручную утомительно. **IoC-контейнер** делает это сам: находит классы, создаёт объекты (**бины**), определяет порядок и подставляет зависимости.

```java
@Repository
public class PostgresOrderRepository implements OrderRepository { … }

@Service
public class OrderService {
    private final OrderRepository repo;
    private final EmailSender sender;

    public OrderService(OrderRepository repo, EmailSender sender) {   // @Autowired не нужен
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

| Способ внедрения | Оценка |
|---|---|
| **Через конструктор** | ✅ рекомендуемый: поля `final`, объект всегда целостен, легко тестировать |
| Через сеттер | для необязательных зависимостей |
| Через поле (`@Autowired private Repo repo;`) | ❌ нельзя сделать `final`, скрывает зависимости, сложнее тестировать |

**Области видимости** бинов: `singleton` (по умолчанию — один на контейнер), `prototype` (новый при каждом запросе), `request`/`session` в веб-приложениях. Если подходят несколько реализаций интерфейса — `@Primary` или `@Qualifier`.

## Другие контейнеры

| Инструмент | Особенность |
|---|---|
| **Spring** | самый популярный; рефлексия + прокси в рантайме |
| **Jakarta CDI** | стандарт Jakarta EE (`@Inject`, `@ApplicationScoped`); используется в Quarkus, WildFly |
| **Google Guice** | лёгкий DI-контейнер на модулях |
| **Dagger 2** | генерация кода при компиляции, популярен в Android |
| **Micronaut / Quarkus** | DI на этапе сборки — быстрый старт и мало памяти, дружат с GraalVM Native Image |

:::interview "Вопросы с собеседования"
**Что такое DI и IoC?** — IoC — принцип: создание и связывание объектов отдаётся внешнему механизму. DI — конкретная реализация: зависимости передаются объекту через конструктор/сеттер. Даёт слабую связанность и тестируемость.

**Почему внедрение через конструктор лучше, чем через поле?** — Зависимости явные и `final`, объект нельзя создать в неполном состоянии, в тестах можно передать заглушки без рефлексии; циклические зависимости обнаруживаются сразу.

**Что такое бин и какие бывают scope?** — Объект, которым управляет контейнер Spring. Scope: singleton, prototype, request, session, application.
:::

## Домашнее задание

:::task easy "Рефакторинг на DI"
Возьмите класс с `new` внутри (например, `ReportService`, который сам создаёт `FileWriter` и `Clock`). Перепишите на внедрение через конструктор и напишите тест с фиксированным `Clock` и записью в `StringWriter`.
:::

:::task medium "Свой мини-контейнер"
Напишите `SimpleContainer` с методами `register(Class<?> type)` и `<T> T get(Class<T> type)`, который через рефлексию находит единственный публичный конструктор, рекурсивно создаёт его параметры и кеширует синглтоны. Обнаружьте и сообщите о циклической зависимости.
:::

:::task hard "Spring Boot: две реализации"
Создайте Spring Boot-приложение с интерфейсом `NotificationSender` и двумя реализациями (`EmailSender`, `SmsSender`). Выберите реализацию через свойство `app.notifications=email|sms` (`@ConditionalOnProperty`), внедрите все реализации списком `List<NotificationSender>` в «рассыльщик», напишите тест со `@SpringBootTest` и подменой бина `@MockitoBean`.
:::
