Начинаем **Java уровень 2**. Вместо проверки «глазами» в консоли учимся писать **автотесты** на JUnit: программа сама сравнивает ожидаемый результат с реальным. Дальше в курсе тесты будут использоваться постоянно — сначала тесты, потом реализация.

## Таймкоды видео

- {{t j1 5:48:56}} — начало уровня 2: почему вывод в консоль — плохая проверка
- {{t j1 5:49:35}} — класс `Calculator` и метод `add`
- {{t j1 5:51:23}} — «оптимизация» `return 15;` — консоль не заметит ошибку
- {{t j1 5:53:04}} — JUnit и системы сборки (Gradle, Maven)
- {{t j1 5:53:33}} — проект на Gradle, файл `build.gradle`, папки `main` и `test`
- {{t j1 5:55:04}} — создание теста: <kbd>Alt+Enter</kbd> → Create Test
- {{t j1 5:55:44}} — аннотация `@Test`, `expected` и `result`
- {{t j1 5:56:46}} — `assertEquals(expected, result)`
- {{t j1 5:57:15}} — второй тест ловит ошибку
- {{t j1 5:58:22}} — домашнее задание
- {{t j1 5:58:46}} — сравнение `double`: погрешность (delta)
- {{t j1 6:01:30}} — продолжение: `@Before` и `@After`
- {{t j1 6:02:50}} — выделить все одинаковые строки: <kbd>Alt+J</kbd>
- {{t j1 6:03:43}} — один тест — одна проверка, имена `when…then…`
- {{t j1 6:05:05}} — метод `add(String, String)` и неверный ввод
- {{t j1 6:07:09}} — проверка исключений: `try-catch`, `assertTrue`, `@Test(expected = …)`
- {{t j1 6:09:42}} — итоги и практика

## Зачем автотесты

Проверка «вывести в консоль и посмотреть» ненадёжна: в видео метод `add` «оптимизировали» до `return 15;`, и вывод `10 + 5 = 15` всё равно выглядит правильно. Когда методов сотни, а проверять нужно строки посимвольно — человек ошибку пропустит. **Автотест** сам вызывает метод и сравнивает результат с ожидаемым; тесты запускаются за секунды при каждом изменении кода.

## Первый тест

```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
}
```

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    private Calculator calculator;

    @BeforeEach                       // перед КАЖДЫМ тестом
    void setUp() {
        calculator = new Calculator();
    }

    @Test
    void whenAdd10And5ThenResult15() {
        assertEquals(15, calculator.add(10, 5));      // (ожидаемое, реальное)
    }

    @Test
    void whenAdd100And50ThenResult150() {
        assertEquals(150, calculator.add(100, 50));
    }
}
```

Структура хорошего теста — **Arrange / Act / Assert** (подготовка → действие → проверка). Имя теста описывает сценарий: `whenAdd10And5ThenResult15` — сразу видно, что сломалось.

:::outdated "JUnit 4 → JUnit 5/6"
В видео используется **JUnit 4** (`org.junit.Test`, `Assert.assertEquals`, `@Before`, `@After`, `@Test(expected = …)`). Сейчас стандарт — **JUnit Jupiter** (JUnit 5, а с сентября 2025 — **JUnit 6**, требует Java 17+). Соответствие:

| JUnit 4 | JUnit 5/6 |
|---|---|
| `@Before` / `@After` | `@BeforeEach` / `@AfterEach` |
| `@BeforeClass` / `@AfterClass` | `@BeforeAll` / `@AfterAll` |
| `@Test(expected = X.class)` | `assertThrows(X.class, () -> …)` |
| `@Ignore` | `@Disabled` |
| `Assert.assertEquals` | `Assertions.assertEquals` |
| — | `@DisplayName`, `@ParameterizedTest`, `@Nested` |

Тестовые классы и методы в JUnit 5+ могут быть не `public`. В мастере *Create Test* в IDEA выбирайте **JUnit 5** (или 6).
:::

:::warning "@Before — перед каждым тестом"
В видео метод с `@Before` сначала назван «вызываемым перед всеми тестами». Точнее: `@Before` (JUnit 4) и `@BeforeEach` (JUnit 5) выполняются **перед каждым** тестовым методом — каждый тест получает «чистый» объект. Перед всеми тестами один раз выполняется `@BeforeClass` / `@BeforeAll`.
:::

## Подключение JUnit в Gradle и Maven

```kotlin
// build.gradle.kts
dependencies {
    testImplementation(platform("org.junit:junit-bom:6.0.1"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}
tasks.test {
    useJUnitPlatform()
}
```

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>6.0.1</version>
    <scope>test</scope>
</dependency>
```

Запуск всех тестов: `./gradlew test` или `./mvnw test`. В IDEA — ▶ рядом с классом или методом теста.

## Сравнение double — с погрешностью

```java
double b = 0;
for (int i = 0; i < 100; i++) b += 0.01;
System.out.println(b == 1.0);   // false: 1.0000000000000007
```

Дробные числа неточны (урок о `double`), поэтому их сравнивают с **дельтой**:

```java
assertEquals(1.0, calculator.divide(10, 10), 0.0001);
```

## Проверка исключений

Если при неверном вводе метод **должен** бросать исключение — это тоже поведение, которое тестируют:

```java
public int add(String a, String b) {
    return Integer.parseInt(a) + Integer.parseInt(b);
}
```

```java
@Test
void whenInputIncorrectThenThrowException() {
    assertThrows(NumberFormatException.class, () -> calculator.add("abc", "5"));
}
```

В видео показаны три способа (флаг в `catch`, `assertTrue`, `@Test(expected = …)`). Современный и самый точный — `assertThrows`: он проверяет исключение именно в этой строке и возвращает его, чтобы проверить сообщение.

## Что не рассказано в видео

### Параметризованные тесты

```java
@ParameterizedTest
@CsvSource({"10, 5, 15", "100, 50, 150", "-1, 1, 0"})
void addWorks(int a, int b, int expected) {
    assertEquals(expected, calculator.add(a, b));
}
```

Один метод — много наборов данных (нужна зависимость `junit-jupiter-params`, входит в `junit-jupiter`).

### Инструменты, которые используют вместе с JUnit

| Библиотека | Для чего |
|---|---|
| **AssertJ** | Читаемые проверки: `assertThat(list).hasSize(3).contains("Анна")` |
| **Mockito** | Заглушки (mocks) для зависимостей: база, HTTP-клиент |
| **Testcontainers** | Настоящие PostgreSQL/Kafka в Docker для интеграционных тестов |
| **JaCoCo** | Отчёт о покрытии кода тестами |

Подробно — в статье [Тестирование](#/extra/testing).

### TDD

Дальше в курсе автор пишет **сначала тесты на интерфейс, потом реализацию** — это Test-Driven Development: красный тест → минимальный код до зелёного → рефакторинг.

## Домашнее задание

:::task video "Калькулятор с тестами — из видео"
Добавьте в `Calculator` методы умножения, деления и возведения в квадрат (умножение и деление принимают и возвращают `double`) и покройте **каждый** метод тестами. При сравнении `double` используйте погрешность. {{t j1 5:58:22}}
:::

:::task video "Отдельные тесты и исключения — из видео"
Переделайте тесты так, чтобы каждая проверка была в отдельном методе с говорящим именем. Напишите метод деления, принимающий строки и приводящий их к `double`, и тест на исключение при некорректном вводе. {{t j1 6:09:42}}
:::

:::task easy "Деление на ноль"
Решите, как должен вести себя `divide(10, 0)`: вернуть `Infinity`, бросить `ArithmeticException` или `IllegalArgumentException`? Реализуйте выбранное поведение и закрепите его тестом.
:::

:::task medium "Тесты для MyArrayList"
Напишите набор тестов для вашей коллекции `MyArrayList` из уровня 1: добавление 25 элементов (с расширением), удаление первого/последнего/среднего, `get` с неверным индексом бросает исключение. Найдите хотя бы один баг в своей реализации с помощью тестов.
:::

:::task hard "Параметризованный FizzBuzz"
Вынесите FizzBuzz (урок о циклах) в метод `String fizzBuzz(int n)` и протестируйте его одним `@ParameterizedTest` с `@CsvSource` на 10+ наборах, включая граничные (1, 3, 5, 15, 30). Затем подключите AssertJ и перепишите одну из проверок через `assertThat`.
:::
