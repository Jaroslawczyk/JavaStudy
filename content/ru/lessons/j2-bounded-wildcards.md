Иногда «любой тип» — это слишком много. Чтобы посчитать среднее значение, нужен тип, который **умеет быть числом**. Для этого параметры типов ограничивают сверху (`T extends Number`), а для параметров методов используют маску **wildcard** `?`. Здесь же разберём главную ловушку дженериков: почему `List<Integer>` — **не** `List<Number>`.

## Таймкоды видео

- {{t j2 30:08}} — `Box<T>` с массивом и методом `avg()`
- {{t j2 33:13}} — нужен `doubleValue()`, а у `T` его нет
- {{t j2 34:44}} — ограничение сверху: `T extends Number`
- {{t j2 35:37}} — несколько ограничений: `T extends Number & Comparable<T>`
- {{t j2 37:00}} — сравниваем две коробки по среднему
- {{t j2 39:01}} — `Box<Integer>` не принимает `Box<Double>`: wildcard `Box<?>`
- {{t j2 39:26}} — `Box<? extends Number>`
- {{t j2 40:08}} — `List<Number>` vs `List<? extends Number>`: инвариантность
- {{t j2 43:20}} — итог урока

## Ограничение сверху: `T extends Number`

```java
public class Box<T extends Number> {
    private final T[] array;

    @SafeVarargs
    public Box(T... array) { this.array = array; }

    public double avg() {
        double sum = 0;
        for (T item : array) {
            sum += item.doubleValue();     // доступно: T точно Number
        }
        return sum / array.length;
    }
}

Box<Integer> ints = new Box<>(1, 2, 3);
Box<Double> doubles = new Box<>(1.5, 2.5);
Box<String> strings = new Box<>("a");      // ❌ String не Number
```

- `extends` здесь означает «этот класс **или его наследник**», а для интерфейсов — «**реализует**» (слово `implements` в дженериках не используется).
- После стирания `T` заменяется не на `Object`, а на **границу** — `Number`. Поэтому методы `Number` доступны.

### Несколько ограничений

```java
class Box<T extends Number & Comparable<T>> { … }
```

Сначала может идти **один класс**, затем любое количество интерфейсов через `&`. Внутри доступны методы и `Number`, и `Comparable`.

## Wildcard `?` — «какой-то тип»

Хотим сравнить коробку `Integer` с коробкой `Double`:

```java
public boolean compare(Box<T> another) { … }     // Box<Integer> примет только Box<Integer>

public boolean compare(Box<?> another) {          // любая коробка
    return Math.abs(avg() - another.avg()) < 0.0001;
}
```

`Box<?>` — «коробка неизвестного типа». Раз мы знаем, что `T extends Number`, `another.avg()` доступен.

## Инвариантность: главная ловушка

`Integer` — наследник `Number`. Но **`List<Integer>` — не наследник `List<Number>`**:

```java
static double sum(List<Number> list) { … }

List<Integer> ints = List.of(1, 2, 3);
sum(ints);                     // ❌ не компилируется
```

Почему это правильно? Если бы было можно, метод положил бы в «ваш» список `Double`:

```java
static void broken(List<Number> list) { list.add(3.14); }   // в List<Integer>?!
```

Решение — wildcard с ограничением:

```java
static double sum(List<? extends Number> list) {
    double s = 0;
    for (Number n : list) s += n.doubleValue();   // читать можно как Number
    // list.add(1);                               ❌ писать нельзя (кроме null)
    return s;
}
sum(List.of(1, 2, 3));        // ✅
sum(List.of(1.5, 2.5));       // ✅
```

| Запись | Что можно передать | Читать | Писать |
|---|---|---|---|
| `List<Number>` | только `List<Number>` | `Number` | `Number` и наследники |
| `List<? extends Number>` | `List<Integer>`, `List<Double>`, … | `Number` | ❌ |
| `List<? super Integer>` | `List<Integer>`, `List<Number>`, `List<Object>` | только `Object` | `Integer` |
| `List<?>` | любой список | `Object` | ❌ |

Про `? super` — подробно в [следующем уроке](#/lessons/j2-generic-methods) (правило PECS).

:::interview "Вопрос с собеседования"
**Можно ли передать `List<Integer>` в метод, принимающий `List<Number>`?** — Нет. Дженерики **инвариантны**: `Integer` наследует `Number`, но `List<Integer>` не наследует `List<Number>`. Чтобы принять список любых чисел, параметр объявляют как `List<? extends Number>`.
:::

:::note "Массивы ведут себя иначе"
Массивы **ковариантны**: `Number[] arr = new Integer[3];` компилируется. Но `arr[0] = 1.5;` упадёт в рантайме с `ArrayStoreException`. Дженерики выбрали инвариантность, чтобы ловить такие ошибки на этапе компиляции.
:::

## Что не рассказано в видео

- **`@SafeVarargs`.** Конструктор/метод с параметром `T...` создаёт массив дженерик-типа, и компилятор предупреждает о «heap pollution». Если метод только читает аргументы, пометьте его `@SafeVarargs` (разрешено на `final`, `static`, `private` методах и конструкторах).
- **Рекурсивная граница** `T extends Comparable<? super T>` — так объявлен `Collections.max`. Она позволяет сравнивать, например, `java.sql.Date`, который реализует `Comparable<java.util.Date>`.
- **Ограничение снизу у параметра типа нет.** `class Box<T super Integer>` — недопустимо; `super` бывает только у wildcard.

## Домашнее задание

В видео в этом уроке задания нет — закрепим своими задачами.

:::task easy "Статистика коробки"
Добавьте в `Box<T extends Number>` методы `max()` и `min()`, возвращающие `double`. Проверьте на `Box<Integer>` и `Box<Float>`.
:::

:::task medium "Сумма любых чисел"
Напишите `static double sum(Collection<? extends Number> c)` и вызовите его для `List<Integer>`, `Set<Double>` и `List<BigDecimal>`. Объясните, почему внутри метода нельзя сделать `c.add(0)`.
:::

:::task medium "Максимум по Comparable"
Напишите `static <T extends Comparable<? super T>> T max(List<? extends T> list)` без использования `Collections.max`. Проверьте на строках, числах и своём классе `Car implements Comparable<Car>`.
:::

:::task hard "Сломайте массивы, но не дженерики"
1) Напишите код, где `Object[] objs = new String[1]; objs[0] = 1;` падает с `ArrayStoreException`. 2) Попробуйте повторить то же с `List<Object> l = new ArrayList<String>();` — объясните ошибку компиляции. 3) Через raw type всё-таки «загрязните» `List<String>` числом и найдите место падения.
:::
