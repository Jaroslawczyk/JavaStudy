**Перечисление** (`enum`) — тип с фиксированным набором значений: дни недели, статусы заказа, роли пользователей. В видео enum не разбирается, а в реальном коде он встречается постоянно — и это гораздо больше, чем «список констант».

## Базовый синтаксис

```java
public enum OrderStatus {
    NEW, PAID, SHIPPED, DELIVERED, CANCELLED
}

OrderStatus s = OrderStatus.PAID;
if (s == OrderStatus.PAID) { … }            // enum сравнивают через ==
```

Каждая константа — единственный экземпляр класса `OrderStatus` (`public static final`). Создать новый экземпляр через `new` нельзя, поэтому `==` безопасен и быстрее `equals`.

| Метод | Что делает |
|---|---|
| `values()` | Массив всех констант по порядку объявления |
| `valueOf("PAID")` | Константа по имени (`IllegalArgumentException`, если нет) |
| `name()` | Имя константы, как в коде |
| `ordinal()` | Порядковый номер с нуля |
| `compareTo` | Сравнение по `ordinal` |

:::warning "Не храните ordinal() в базе"
Если кто-то вставит новую константу в середину списка, все номера сдвинутся, и данные в БД «поменяют смысл». Храните `name()` (в JPA — `@Enumerated(EnumType.STRING)`) или явное поле-код.
:::

## Поля, конструкторы, методы

Enum — полноценный класс:

```java
public enum Planet {
    MERCURY(3.303e23, 2.4397e6),
    EARTH(5.976e24, 6.37814e6);

    private final double mass, radius;

    Planet(double mass, double radius) {         // конструктор всегда private
        this.mass = mass;
        this.radius = radius;
    }

    public double surfaceGravity() {
        return 6.67300E-11 * mass / (radius * radius);
    }
}
```

Можно реализовать интерфейс и даже дать каждой константе своё поведение:

```java
public enum Operation implements IntBinaryOperator {
    PLUS("+")  { public int applyAsInt(int a, int b) { return a + b; } },
    MINUS("-") { public int applyAsInt(int a, int b) { return a - b; } };

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }
}
```

## Enum и switch

```java
String text = switch (status) {                 // switch-выражение, Java 14+
    case NEW, PAID -> "В обработке";
    case SHIPPED -> "В пути";
    case DELIVERED -> "Доставлен";
    case CANCELLED -> "Отменён";
};                                              // без default: компилятор проверит полноту
```

Если добавить новую константу, switch-выражение без `default` перестанет компилироваться — компилятор сам покажет места, которые нужно обновить.

## EnumSet и EnumMap

Специальные коллекции для enum-ключей — очень быстрые (внутри битовая маска / массив):

```java
EnumSet<DayOfWeek> weekend = EnumSet.of(DayOfWeek.SATURDAY, DayOfWeek.SUNDAY);
EnumSet<DayOfWeek> workdays = EnumSet.complementOf(weekend);

EnumMap<OrderStatus, Long> stats = new EnumMap<>(OrderStatus.class);
stats.merge(OrderStatus.PAID, 1L, Long::sum);
```

## Синглтон через enum

```java
public enum AppConfig {
    INSTANCE;
    private final Properties props = load();
    public String get(String key) { return props.getProperty(key); }
}
```

Джошуа Блох называет это лучшим способом реализовать синглтон: потокобезопасная инициализация, защита от рефлексии и сериализации «из коробки».

:::interview "Вопросы с собеседования"
**Можно ли наследоваться от enum?** — Нет: enum неявно `final` и уже наследует `java.lang.Enum`. Но enum может реализовывать интерфейсы.

**Почему enum сравнивают через `==`?** — Каждая константа существует в единственном экземпляре, `==` безопасен, быстрее и не падает на `null`.
:::

## Домашнее задание

:::task easy "Светофор"
Создайте `enum TrafficLight { RED, YELLOW, GREEN }` с методом `next()`, возвращающим следующий цвет по кругу, и полем `durationSeconds`. Выведите цикл из 6 переключений.
:::

:::task medium "Калькулятор на enum"
Реализуйте `enum Operation` с константами `PLUS, MINUS, MULTIPLY, DIVIDE`, полем `symbol` и абстрактным методом `apply(double, double)`. Добавьте статический `fromSymbol(String)` через поиск в `Map`, построенной один раз из `values()`. Обработайте деление на ноль.
:::

:::task hard "Конечный автомат заказа"
Опишите `OrderStatus` с разрешёнными переходами (`NEW → PAID → SHIPPED → DELIVERED`, отмена возможна только из `NEW` и `PAID`) через `EnumSet<OrderStatus> allowedNext()`. Класс `Order` должен бросать исключение при недопустимом переходе. Покройте все переходы параметризованным тестом JUnit (`@EnumSource`).
:::
