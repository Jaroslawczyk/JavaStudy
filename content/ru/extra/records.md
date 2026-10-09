**Записи** (`record`, Java 16) — компактный способ объявить неизменяемый класс-носитель данных. Одна строка заменяет конструктор, геттеры, `equals`, `hashCode` и `toString`. В видео их нет (курс записан до Java 16), но сегодня records — стандарт для DTO, ответов API, ключей map и значений в стримах.

## Было и стало

```java
// До Java 16: ~40 строк
public final class Point {
    private final int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; }
    public int getX() { return x; }
    public int getY() { return y; }
    @Override public boolean equals(Object o) { … }
    @Override public int hashCode() { … }
    @Override public String toString() { … }
}

// Java 16+
public record Point(int x, int y) {}

Point p = new Point(1, 2);
p.x();                         // аксессор без префикса get
System.out.println(p);         // Point[x=1, y=2]
new Point(1, 2).equals(p);     // true — сравнение по компонентам
```

## Что генерирует компилятор

- `private final` поле на каждый компонент;
- **канонический конструктор** со всеми компонентами;
- аксессоры `x()`, `y()`;
- `equals`, `hashCode`, `toString` по всем компонентам.

Класс записи неявно `final` и наследует `java.lang.Record` — от других классов наследоваться нельзя, но **интерфейсы реализовывать можно**.

## Компактный конструктор: проверки

```java
public record Money(BigDecimal amount, String currency) {
    public Money {                                   // компактный: без параметров и присваиваний
        Objects.requireNonNull(currency);
        if (amount.signum() < 0) throw new IllegalArgumentException("amount < 0");
        amount = amount.setScale(2, RoundingMode.HALF_UP);  // можно нормализовать
    }

    public Money plus(Money other) {                 // свои методы — пожалуйста
        return new Money(amount.add(other.amount), currency);
    }

    public static Money zero(String currency) {      // статические фабрики тоже
        return new Money(BigDecimal.ZERO, currency);
    }
}
```

:::warning "Неизменяемость — поверхностная"
`record Team(List<String> members)` — поле финальное, но сам список можно изменить снаружи. Делайте защитную копию в компактном конструкторе: `members = List.copyOf(members);`.
:::

## Records и pattern matching (Java 21)

```java
sealed interface Shape permits Circle, Rect {}
record Circle(double r) implements Shape {}
record Rect(double w, double h) implements Shape {}

double area(Shape s) {
    return switch (s) {
        case Circle(double r) -> Math.PI * r * r;           // record pattern — деконструкция
        case Rect(double w, double h) -> w * h;
    };
}

if (obj instanceof Point(int x, int y) && x == y) { … }
```

## Где использовать, а где нет

| ✅ Хорошо | ❌ Не подходит |
|---|---|
| DTO и ответы REST API (Jackson поддерживает) | JPA-сущности (`@Entity` требует изменяемости и конструктора без параметров) |
| Ключи `Map`, элементы `Set` | Классы с изменяемым состоянием |
| Возврат нескольких значений из метода | Иерархии наследования |
| Промежуточные данные в стримах | Классы с ленивыми/вычисляемыми полями-кешами |
| Конфигурация (`@ConfigurationProperties` в Spring Boot) | |

:::note "Records и Lombok"
Раньше то же делали аннотациями Lombok `@Value`/`@Data`. Для неизменяемых данных records их вытесняют: это часть языка, не нужен плагин. Lombok по-прежнему используют для `@Builder` и изменяемых классов.
:::

:::interview "Вопросы с собеседования"
**Чем record отличается от обычного класса?** — Неизменяемые компоненты, сгенерированные конструктор/аксессоры/`equals`/`hashCode`/`toString`, класс `final`, нельзя наследоваться и объявлять поля экземпляра, кроме компонентов.

**Можно ли record сделать сущностью JPA?** — Нет (нужна изменяемость и конструктор без параметров), но можно использовать как DTO, проекцию Spring Data или `@Embeddable` в Hibernate 6.2+.
:::

## Домашнее задание

:::task easy "Переписать на record"
Возьмите класс `Car` из части 1 курса (поля, конструктор, геттеры, `equals`/`hashCode`) и перепишите его в виде записи. Убедитесь, что `HashSet<Car>` работает так же.
:::

:::task medium "Валидирующий record"
Создайте `record Email(String value)` с компактным конструктором: обрезает пробелы, переводит в нижний регистр и проверяет формат регулярным выражением. Напишите тесты на корректные и некорректные адреса.
:::

:::task hard "Калькулятор выражений на records"
Опишите дерево выражений `sealed interface Expr permits Num, Add, Mul, Neg` с record-реализациями и методом `static int eval(Expr e)` через `switch` с record patterns (вложенными, например `case Mul(Num(var a), Num(var b))`). Добавьте `toString` в инфиксной нотации и упрощение `x * 1 → x`.
:::
