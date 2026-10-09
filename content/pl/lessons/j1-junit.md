Zaczynamy **Javę poziom 2**. Zamiast sprawdzania „na oko” w konsoli uczymy się pisać **testy automatyczne** w JUnit: program sam porównuje wynik oczekiwany z rzeczywistym. Dalej w kursie testy będą używane stale — najpierw testy, potem implementacja.

## Znaczniki czasu wideo

- {{t j1 5:48:56}} — początek poziomu 2: dlaczego wypisywanie w konsoli to słaba weryfikacja
- {{t j1 5:49:35}} — klasa `Calculator` i metoda `add`
- {{t j1 5:51:23}} — „optymalizacja” `return 15;` — konsola nie zauważy błędu
- {{t j1 5:53:04}} — JUnit i systemy budowania (Gradle, Maven)
- {{t j1 5:53:33}} — projekt Gradle, plik `build.gradle`, foldery `main` i `test`
- {{t j1 5:55:04}} — tworzenie testu: <kbd>Alt+Enter</kbd> → Create Test
- {{t j1 5:55:44}} — adnotacja `@Test`, `expected` i `result`
- {{t j1 5:56:46}} — `assertEquals(expected, result)`
- {{t j1 5:57:15}} — drugi test łapie błąd
- {{t j1 5:58:22}} — zadanie domowe
- {{t j1 5:58:46}} — porównywanie `double`: tolerancja (delta)
- {{t j1 6:01:30}} — ciąg dalszy: `@Before` i `@After`
- {{t j1 6:02:50}} — zaznacz wszystkie identyczne linie: <kbd>Alt+J</kbd>
- {{t j1 6:03:43}} — jeden test — jedno sprawdzenie, nazwy `when…then…`
- {{t j1 6:05:05}} — metoda `add(String, String)` i błędne dane
- {{t j1 6:07:09}} — testowanie wyjątków: `try-catch`, `assertTrue`, `@Test(expected = …)`
- {{t j1 6:09:42}} — podsumowanie i praktyka

## Po co testy automatyczne

Sprawdzanie „wypisz w konsoli i popatrz” jest zawodne: w wideo metodę `add` „zoptymalizowano” do `return 15;`, a wynik `10 + 5 = 15` nadal wygląda poprawnie. Gdy metod są setki, a napisy trzeba porównywać znak po znaku — człowiek przeoczy błąd. **Test automatyczny** sam wywołuje metodę i porównuje wynik z oczekiwanym; testy uruchamiają się w kilka sekund przy każdej zmianie kodu.

## Pierwszy test

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

    @BeforeEach                       // przed KAŻDYM testem
    void setUp() {
        calculator = new Calculator();
    }

    @Test
    void whenAdd10And5ThenResult15() {
        assertEquals(15, calculator.add(10, 5));      // (oczekiwane, rzeczywiste)
    }

    @Test
    void whenAdd100And50ThenResult150() {
        assertEquals(150, calculator.add(100, 50));
    }
}
```

Struktura dobrego testu — **Arrange / Act / Assert** (przygotowanie → działanie → sprawdzenie). Nazwa testu opisuje scenariusz: `whenAdd10And5ThenResult15` — od razu widać, co się zepsuło.

:::outdated "JUnit 4 → JUnit 5/6"
W wideo używany jest **JUnit 4** (`org.junit.Test`, `Assert.assertEquals`, `@Before`, `@After`, `@Test(expected = …)`). Dziś standardem jest **JUnit Jupiter** (JUnit 5, a od września 2025 — **JUnit 6**, wymaga Javy 17+). Odpowiedniki:

| JUnit 4 | JUnit 5/6 |
|---|---|
| `@Before` / `@After` | `@BeforeEach` / `@AfterEach` |
| `@BeforeClass` / `@AfterClass` | `@BeforeAll` / `@AfterAll` |
| `@Test(expected = X.class)` | `assertThrows(X.class, () -> …)` |
| `@Ignore` | `@Disabled` |
| `Assert.assertEquals` | `Assertions.assertEquals` |
| — | `@DisplayName`, `@ParameterizedTest`, `@Nested` |

W JUnit 5+ klasy i metody testowe nie muszą być `public`. W kreatorze *Create Test* w IDEA wybieraj **JUnit 5** (lub 6).
:::

:::warning "@Before — przed każdym testem"
W wideo metoda z `@Before` jest najpierw nazwana „wywoływaną przed wszystkimi testami”. Dokładniej: `@Before` (JUnit 4) i `@BeforeEach` (JUnit 5) wykonują się **przed każdą** metodą testową — każdy test dostaje „czysty” obiekt. Raz przed wszystkimi testami wykonuje się `@BeforeClass` / `@BeforeAll`.
:::

## Dodanie JUnit w Gradle i Mavenie

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

Uruchomienie wszystkich testów: `./gradlew test` lub `./mvnw test`. W IDEA — ▶ obok klasy lub metody testowej.

## Porównywanie double — z tolerancją

```java
double b = 0;
for (int i = 0; i < 100; i++) b += 0.01;
System.out.println(b == 1.0);   // false: 1.0000000000000007
```

Liczby ułamkowe są niedokładne (lekcja o `double`), dlatego porównuje się je z **deltą**:

```java
assertEquals(1.0, calculator.divide(10, 10), 0.0001);
```

## Testowanie wyjątków

Jeśli przy błędnych danych metoda **powinna** rzucić wyjątek — to też zachowanie, które się testuje:

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

W wideo pokazano trzy sposoby (flaga w `catch`, `assertTrue`, `@Test(expected = …)`). Nowoczesny i najdokładniejszy to `assertThrows`: sprawdza wyjątek właśnie w tej linii i go zwraca, by można było sprawdzić komunikat.

## Czego nie ma w wideo

### Testy sparametryzowane

```java
@ParameterizedTest
@CsvSource({"10, 5, 15", "100, 50, 150", "-1, 1, 0"})
void addWorks(int a, int b, int expected) {
    assertEquals(expected, calculator.add(a, b));
}
```

Jedna metoda — wiele zestawów danych (potrzebny `junit-jupiter-params`, wchodzi w skład `junit-jupiter`).

### Narzędzia używane razem z JUnit

| Biblioteka | Do czego |
|---|---|
| **AssertJ** | Czytelne asercje: `assertThat(list).hasSize(3).contains("Anna")` |
| **Mockito** | Zaślepki (mocki) zależności: baza, klient HTTP |
| **Testcontainers** | Prawdziwy PostgreSQL/Kafka w Dockerze do testów integracyjnych |
| **JaCoCo** | Raport pokrycia kodu testami |

Szczegóły w artykule [Testowanie](#/extra/testing).

### TDD

Dalej w kursie autor pisze **najpierw testy interfejsu, potem implementację** — to Test-Driven Development: czerwony test → minimalny kod do zielonego → refaktoryzacja.

## Zadanie domowe

:::task video "Kalkulator z testami — z wideo"
Dodaj do `Calculator` metody mnożenia, dzielenia i podnoszenia do kwadratu (mnożenie i dzielenie przyjmują i zwracają `double`) i pokryj testami **każdą** metodę. Przy porównywaniu `double` używaj tolerancji. {{t j1 5:58:22}}
:::

:::task video "Osobne testy i wyjątki — z wideo"
Przerób testy tak, aby każde sprawdzenie było w osobnej metodzie o mówiącej nazwie. Napisz metodę dzielenia przyjmującą napisy i zamieniającą je na `double` oraz test wyjątku przy błędnych danych. {{t j1 6:09:42}}
:::

:::task easy "Dzielenie przez zero"
Zdecyduj, jak ma się zachować `divide(10, 0)`: zwrócić `Infinity`, rzucić `ArithmeticException` czy `IllegalArgumentException`? Zaimplementuj wybrane zachowanie i utrwal je testem.
:::

:::task medium "Testy dla MyArrayList"
Napisz zestaw testów dla swojej kolekcji `MyArrayList` z poziomu 1: dodanie 25 elementów (z powiększaniem), usunięcie pierwszego/ostatniego/środkowego, `get` z błędnym indeksem rzuca wyjątek. Znajdź testami przynajmniej jeden błąd w swojej implementacji.
:::

:::task hard "Sparametryzowany FizzBuzz"
Przenieś FizzBuzz (lekcja o pętlach) do metody `String fizzBuzz(int n)` i przetestuj ją jednym `@ParameterizedTest` z `@CsvSource` na 10+ zestawach, w tym granicznych (1, 3, 5, 15, 30). Następnie dodaj AssertJ i przepisz jedno ze sprawdzeń przez `assertThat`.
:::
