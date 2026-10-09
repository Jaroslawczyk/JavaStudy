**Цепочка вызовов** (method chaining, fluent interface) — стиль, при котором методы возвращают объект, позволяя вызывать следующие методы «через точку». Вы уже пользовались им: `new StringBuilder().append("a").append("b")`, `list.stream().filter(…).map(…).toList()`. Разберём, как писать такие API самому, и паттерн **Builder**.

## Возврат this

```java
public class HttpRequestSpec {
    private String url;
    private String method = "GET";
    private final Map<String, String> headers = new LinkedHashMap<>();

    public HttpRequestSpec url(String url) { this.url = url; return this; }
    public HttpRequestSpec method(String m) { this.method = m; return this; }
    public HttpRequestSpec header(String k, String v) { headers.put(k, v); return this; }
}

var spec = new HttpRequestSpec()
        .url("https://api.example.com/users")
        .method("POST")
        .header("Content-Type", "application/json");
```

## Паттерн Builder

Когда у объекта много параметров (часть обязательных, часть необязательных), конструктор с 8 аргументами нечитаем: `new User("Ann", null, 25, true, false, null, "PL", 3)`. Builder решает это и позволяет сделать сам объект **неизменяемым**:

```java
public final class User {
    private final String name;
    private final int age;
    private final String country;

    private User(Builder b) {
        this.name = b.name;
        this.age = b.age;
        this.country = b.country;
    }

    public static Builder builder(String name) { return new Builder(name); }

    public static final class Builder {
        private final String name;          // обязательный — в конструкторе билдера
        private int age;
        private String country = "PL";      // значение по умолчанию

        private Builder(String name) { this.name = Objects.requireNonNull(name); }
        public Builder age(int age) { this.age = age; return this; }
        public Builder country(String c) { this.country = c; return this; }

        public User build() {
            if (age < 0) throw new IllegalStateException("age < 0");   // проверка целостности
            return new User(this);
        }
    }
}

User u = User.builder("Ann").age(25).build();
```

:::tip "Без ручного кода"
Lombok генерирует билдер аннотацией `@Builder`. Для небольших неизменяемых данных часто хватает `record` с несколькими статическими фабриками или методов-«виттеров»: `money.withAmount(…)` — возвращает новый объект вместо изменения текущего.
:::

## Где осторожнее

- **Отладка и стектрейсы:** в длинной цепочке трудно понять, на каком вызове упало (`NullPointerException` в строке с 10 вызовами). С Java 14 «helpful NPE» подсказывает, какое выражение было `null`; ставьте каждый вызов на отдельную строку.
- **Закон Деметры:** цепочка вида `order.getCustomer().getAddress().getCity().getName()` — не fluent API, а запах кода: вызывающий слишком много знает о внутреннем устройстве объектов.
- **Наследование:** если метод родителя возвращает `Parent`, цепочка «теряет» методы наследника. Решения — переопределение с ковариантным возвращаемым типом или дженерик `self`-тип (`<T extends Builder<T>>`).

## Домашнее задание

:::task easy "Свой StringBuilder-лайт"
Напишите `TextBuilder` с методами `add(String)`, `space()`, `newLine()`, `repeat(String, int)`, каждый возвращает `this`, и `build()`. Соберите небольшое стихотворение одной цепочкой.
:::

:::task medium "Builder с проверками"
Создайте неизменяемый класс `Pizza` (размер обязателен, тесто по умолчанию «тонкое», до 5 начинок) с вложенным `Builder`. `build()` бросает исключение при нарушении правил. Напишите тесты на граничные случаи.
:::

:::task hard "Типобезопасный пошаговый билдер"
Реализуйте step builder для `Email`: сначала обязательно `from(…)`, затем `to(…)`, затем `subject(…)`, и только потом доступны необязательные `cc(…)`, `body(…)` и `build()`. Используйте цепочку интерфейсов (`FromStep → ToStep → SubjectStep → OptionalStep`), чтобы неправильный порядок вызовов не компилировался.
:::
