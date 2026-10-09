**Аннотации** — метаданные, которые прикрепляются к классам, методам, полям и параметрам: `@Override`, `@Test`, `@Entity`, `@GetMapping`. Сами по себе они ничего не делают — их читают компилятор, инструменты сборки или фреймворки (через рефлексию). Современный Java-бэкенд держится на аннотациях, поэтому важно понимать, как они устроены.

## Встроенные аннотации

| Аннотация | Назначение |
|---|---|
| `@Override` | Компилятор проверит, что метод действительно переопределяет родительский |
| `@Deprecated(since = "9", forRemoval = true)` | Помечает устаревшее API, IDE зачёркивает |
| `@SuppressWarnings("unchecked")` | Подавляет конкретное предупреждение компилятора |
| `@FunctionalInterface` | Проверка, что в интерфейсе ровно один абстрактный метод |
| `@SafeVarargs` | Метод с дженерик-varargs не загрязняет кучу |
| `@Serial` (Java 14) | Проверка объявлений `serialVersionUID`, `readObject` и т. п. |

## Своя аннотация

```java
@Retention(RetentionPolicy.RUNTIME)          // доступна через рефлексию во время работы
@Target(ElementType.METHOD)                  // можно ставить только на методы
public @interface Timed {
    String value() default "";               // параметры — «методы» без аргументов
    int warnAboveMs() default 1000;
}

public class ReportService {
    @Timed(value = "monthly-report", warnAboveMs = 500)
    public void buildReport() { … }
}
```

### Мета-аннотации

| Мета-аннотация | Что задаёт |
|---|---|
| `@Retention` | Где «живёт»: `SOURCE` (только в исходниках, как `@Override`), `CLASS` (в байткоде, по умолчанию), `RUNTIME` (видна через рефлексию) |
| `@Target` | Куда можно ставить: `TYPE`, `METHOD`, `FIELD`, `PARAMETER`, `TYPE_USE`… |
| `@Inherited` | Аннотация класса наследуется подклассами |
| `@Repeatable` | Можно поставить несколько раз |
| `@Documented` | Попадает в Javadoc |

Типы параметров: примитивы, `String`, `Class`, enum, другие аннотации и массивы этих типов. Если параметр называется `value`, имя можно опустить: `@Timed("report")`.

## Чтение через рефлексию

```java
for (Method m : ReportService.class.getDeclaredMethods()) {
    Timed timed = m.getAnnotation(Timed.class);
    if (timed != null) {
        long start = System.nanoTime();
        m.invoke(service);
        long ms = (System.nanoTime() - start) / 1_000_000;
        if (ms > timed.warnAboveMs()) System.out.println("Медленно: " + timed.value());
    }
}
```

Так в упрощённом виде работают JUnit (ищет `@Test`), Spring (`@Component`, `@Transactional`) и Hibernate (`@Entity`, `@Column`). Фреймворки обычно ещё оборачивают объекты в прокси, чтобы добавить поведение до и после вызова.

## Обработчики аннотаций (compile time)

Аннотации с `SOURCE`/`CLASS` обрабатывают **annotation processors** во время компиляции — они генерируют новый код:
- **Lombok** — `@Getter`, `@Builder`, `@Slf4j`;
- **MapStruct** — мапперы DTO ↔ сущность;
- **Dagger**, **Micronaut** — внедрение зависимостей без рефлексии в рантайме (быстрый старт).

:::note "Аннотации в современных фреймворках"
Spring Boot, Jakarta EE, Quarkus, Micronaut — все описывают конфигурацию аннотациями. Читая код вроде `@RestController` + `@GetMapping("/users/{id}")`, держите в голове: аннотация — только метка, а работу делает фреймворк, который её нашёл.
:::

:::interview "Вопросы с собеседования"
**Что такое аннотации и как они обрабатываются?** — Метаданные кода. Обрабатываются компилятором (`@Override`), annotation processors при сборке (Lombok, MapStruct) или фреймворками через рефлексию в рантайме (`@Retention(RUNTIME)`).

**Чем отличаются `RetentionPolicy.SOURCE`, `CLASS`, `RUNTIME`?** — Тем, до какого этапа сохраняется аннотация: только в исходниках, в `.class`-файле без доступа в рантайме, или доступна через рефлексию.
:::

## Домашнее задание

:::task easy "@Deprecated правильно"
Пометьте метод `oldSum(int, int)` как `@Deprecated(since = "2.0", forRemoval = true)` с Javadoc-тегом `@deprecated`, указывающим замену. Посмотрите, как его отображает IDE и какое предупреждение выдаёт `javac -Xlint:deprecation`.
:::

:::task medium "Мини-JUnit"
Создайте аннотацию `@MyTest` и класс с несколькими методами-тестами (часть бросает исключения). Напишите раннер, который через рефлексию находит методы с `@MyTest`, вызывает их и печатает «PASSED/FAILED» и итоговую статистику.
:::

:::task hard "Валидация полей"
Создайте аннотации `@NotBlank`, `@Min(int)`, `@Max(int)` для полей и класс `Validator` с методом `List<String> validate(Object o)`, который рефлексией проверяет поля и собирает сообщения об ошибках. Сравните результат с Jakarta Bean Validation (`hibernate-validator`) на том же классе.
:::
