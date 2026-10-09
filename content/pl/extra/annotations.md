**Adnotacje** to metadane dołączane do klas, metod, pól i parametrów: `@Override`, `@Test`, `@Entity`, `@GetMapping`. Same z siebie nic nie robią — czytają je kompilator, narzędzia budowania lub frameworki (przez refleksję). Współczesny backend w Javie opiera się na adnotacjach, dlatego ważne jest, by rozumieć, jak działają.

## Adnotacje wbudowane

| Adnotacja | Przeznaczenie |
|---|---|
| `@Override` | Kompilator sprawdzi, że metoda naprawdę nadpisuje metodę rodzica |
| `@Deprecated(since = "9", forRemoval = true)` | Oznacza przestarzałe API, IDE je przekreśla |
| `@SuppressWarnings("unchecked")` | Wycisza konkretne ostrzeżenie kompilatora |
| `@FunctionalInterface` | Sprawdzenie, że interfejs ma dokładnie jedną metodę abstrakcyjną |
| `@SafeVarargs` | Metoda z generycznym varargs nie zanieczyszcza sterty |
| `@Serial` (Java 14) | Sprawdzenie deklaracji `serialVersionUID`, `readObject` itp. |

## Własna adnotacja

```java
@Retention(RetentionPolicy.RUNTIME)          // dostępna przez refleksję w czasie działania
@Target(ElementType.METHOD)                  // można ją stawiać tylko na metodach
public @interface Timed {
    String value() default "";               // parametry to bezargumentowe „metody”
    int warnAboveMs() default 1000;
}

public class ReportService {
    @Timed(value = "monthly-report", warnAboveMs = 500)
    public void buildReport() { … }
}
```

### Meta-adnotacje

| Meta-adnotacja | Co ustala |
|---|---|
| `@Retention` | Gdzie „żyje”: `SOURCE` (tylko w źródłach, jak `@Override`), `CLASS` (w bajtkodzie, domyślnie), `RUNTIME` (widoczna przez refleksję) |
| `@Target` | Gdzie można ją postawić: `TYPE`, `METHOD`, `FIELD`, `PARAMETER`, `TYPE_USE`… |
| `@Inherited` | Adnotacja klasy jest dziedziczona przez podklasy |
| `@Repeatable` | Można ją postawić kilka razy |
| `@Documented` | Trafia do Javadoc |

Typy parametrów: typy proste, `String`, `Class`, enumy, inne adnotacje i tablice tych typów. Jeśli parametr nazywa się `value`, nazwę można pominąć: `@Timed("report")`.

## Odczyt przez refleksję

```java
for (Method m : ReportService.class.getDeclaredMethods()) {
    Timed timed = m.getAnnotation(Timed.class);
    if (timed != null) {
        long start = System.nanoTime();
        m.invoke(service);
        long ms = (System.nanoTime() - start) / 1_000_000;
        if (ms > timed.warnAboveMs()) System.out.println("Wolno: " + timed.value());
    }
}
```

W uproszczonej formie tak działają JUnit (szuka `@Test`), Spring (`@Component`, `@Transactional`) i Hibernate (`@Entity`, `@Column`). Frameworki zwykle dodatkowo opakowują obiekty w proxy, żeby dodać zachowanie przed i po wywołaniu.

## Procesory adnotacji (czas kompilacji)

Adnotacje z `SOURCE`/`CLASS` obsługują **annotation processors** w czasie kompilacji — generują nowy kod:
- **Lombok** — `@Getter`, `@Builder`, `@Slf4j`;
- **MapStruct** — mappery DTO ↔ encja;
- **Dagger**, **Micronaut** — wstrzykiwanie zależności bez refleksji w czasie działania (szybki start).

:::note "Adnotacje we współczesnych frameworkach"
Spring Boot, Jakarta EE, Quarkus, Micronaut — wszystkie opisują konfigurację adnotacjami. Czytając kod w rodzaju `@RestController` + `@GetMapping("/users/{id}")`, pamiętaj: adnotacja to tylko etykieta, a pracę wykonuje framework, który ją znalazł.
:::

:::interview "Pytania rekrutacyjne"
**Czym są adnotacje i jak się je przetwarza?** — To metadane kodu. Przetwarza je kompilator (`@Override`), annotation processors przy budowaniu (Lombok, MapStruct) albo frameworki przez refleksję w czasie działania (`@Retention(RUNTIME)`).

**Czym różnią się `RetentionPolicy.SOURCE`, `CLASS`, `RUNTIME`?** — Tym, do jakiego etapu adnotacja jest zachowywana: tylko w źródłach, w pliku `.class` bez dostępu w czasie działania albo dostępna przez refleksję.
:::

## Zadanie domowe

:::task easy "@Deprecated poprawnie"
Oznacz metodę `oldSum(int, int)` jako `@Deprecated(since = "2.0", forRemoval = true)` z tagiem Javadoc `@deprecated` wskazującym zamiennik. Zobacz, jak wyświetla ją IDE i jakie ostrzeżenie daje `javac -Xlint:deprecation`.
:::

:::task medium "Mini-JUnit"
Utwórz adnotację `@MyTest` i klasę z kilkoma metodami-testami (część rzuca wyjątki). Napisz runner, który przez refleksję znajduje metody z `@MyTest`, wywołuje je i wypisuje „PASSED/FAILED” oraz statystykę końcową.
:::

:::task hard "Walidacja pól"
Utwórz adnotacje `@NotBlank`, `@Min(int)`, `@Max(int)` dla pól i klasę `Validator` z metodą `List<String> validate(Object o)`, która refleksją sprawdza pola i zbiera komunikaty o błędach. Porównaj wynik z Jakarta Bean Validation (`hibernate-validator`) na tej samej klasie.
:::
