Porządkujemy **wyjątki**: hierarchia `Throwable`, wyjątki sprawdzane (checked) i niesprawdzane (unchecked), `throws` i kiedy co obsługiwać. Na koniec — metoda `finalize()`, o którą pytają na rozmowach, choć dawno jest przestarzała.

## Znaczniki czasu wideo

- {{t j2 7:06:49}} — jakie są rodzaje wyjątków
- {{t j2 7:07:19}} — dzielenie przez zero: `ArithmeticException` w czasie działania
- {{t j2 7:08:01}} — wyjątki runtime / unchecked
- {{t j2 7:08:13}} — `ArrayIndexOutOfBoundsException`, `NullPointerException`
- {{t j2 7:09:23}} — wszystkie dziedziczą po `RuntimeException`
- {{t j2 7:09:39}} — wyjątki sprawdzane (checked)
- {{t j2 7:10:34}} — `throws`: przekazujemy wyjątek dalej
- {{t j2 7:11:42}} — `throws` w `main`
- {{t j2 7:13:05}} — `Exception`, `Throwable`, `Error`
- {{t j2 7:13:38}} — `OutOfMemoryError`
- {{t j2 7:14:25}} — metoda `finalize()`
- {{t j2 7:15:13}} — do czego służyła i dlaczego się jej nie używa
- {{t j2 7:15:52}} — eksperyment: `finalize` przy odśmiecaniu

## Hierarchia

```
Throwable
├── Error                    — problemy JVM: OutOfMemoryError, StackOverflowError
└── Exception
    ├── RuntimeException     — unchecked: NPE, IllegalArgumentException, ArithmeticException,
    │                          IndexOutOfBoundsException, ClassCastException…
    └── (cała reszta)        — checked: IOException, SQLException, InterruptedException…
```

| | Checked | Unchecked |
|---|---|---|
| Dziedziczy po | `Exception` (nie `RuntimeException`) | `RuntimeException` lub `Error` |
| Kompilator wymaga obsługi | ✅ `try-catch` lub `throws` | ❌ |
| Przyczyna | okoliczności zewnętrzne: brak pliku, padła sieć | błąd programisty lub złe argumenty |
| Co robić | obsłużyć lub świadomie przekazać dalej | poprawić kod (a nie łapać) |

## throws

```java
private static InputStream open(File file) throws FileNotFoundException {
    return new FileInputStream(file);        // nie obsługujemy tutaj — niech zdecyduje wywołujący
}

public static void main(String[] args) {
    try {
        open(new File("data.txt"));
    } catch (FileNotFoundException e) {
        System.out.println("Nie znaleziono pliku: " + e.getMessage());
    }
}
```

`throws` w sygnaturze to część kontraktu metody: wywołujący musi obsłużyć lub przekazać dalej. Jeśli przekazać z `main`, wyjątek wywróci program ze stack trace'em — dla przykładów edukacyjnych dopuszczalne, w prawdziwym kodzie — nie.

:::interview "Pytanie rekrutacyjne"
**Czym checked różnią się od unchecked?** — Sprawdzane (podklasy `Exception` poza `RuntimeException`) kompilator każe obsłużyć lub zadeklarować w `throws`; opisują oczekiwane awarie zewnętrzne. Niesprawdzanych (`RuntimeException` i podklasy) obsługiwać nie trzeba, zwykle to błędy w kodzie. `Error` — awarie JVM, ich się nie łapie. Wspólny przodek — `Throwable`.
:::

## Dobre praktyki (nie z wideo)

- **Nie połykaj wyjątków:** pusty `catch` albo samo `e.printStackTrace()` na produkcji to utrata informacji. Loguj (`log.error("…", e)`) lub rzucaj dalej.
- **Opakowuj z przyczyną:** `throw new ServiceException("Nie udało się wczytać zamówienia " + id, e);` — zachowuje się oryginalny stack trace (`getCause()`).
- **Multi-catch (Java 7):** `catch (IOException | SQLException e)`.
- **Łap konkretne typy**, a nie `Exception`/`Throwable`.
- **Własne wyjątki:** `class OrderNotFoundException extends RuntimeException` — we współczesnych frameworkach (Spring) częściej używa się unchecked, a błędy zamienia na odpowiedzi HTTP centralnie.
- **Helpful NullPointerExceptions** (Java 14+): komunikat wskazuje, co dokładnie było `null`: `Cannot invoke "String.length()" because "user.name" is null`.

## finalize()

Metodę `Object.finalize()` wywoływał garbage collector **przed** usunięciem obiektu — pomyślano ją do zwalniania zasobów.

Dlaczego się jej nie używa:
- **Nie wiadomo, kiedy** zostanie wywołana i czy w ogóle (GC może nie zadziałać do końca programu).
- Spowalnia odśmiecanie, obiekt może „zmartwychwstać”, wyjątki w niej są po cichu ignorowane.
- To źródło podatności (finalizer attack).

:::outdated "finalize() oznaczona do usunięcia (JEP 421, Java 18)"
`finalize()` uznano za przestarzałą już w Javie 9, a od Javy 18 jest **deprecated for removal** (JEP 421); finalizację można wyłączyć flagą `--finalization=disabled`. Zamienniki:
- **try-with-resources** i `AutoCloseable` — deterministyczne zwalnianie zasobów (główny sposób);
- **`java.lang.ref.Cleaner`** (Java 9) — zabezpieczenie na wypadek, gdy zapomniano wywołać `close()`.
:::

:::interview "Pytanie rekrutacyjne"
**Po co jest `finalize()`?** — Była wywoływana przez GC przed zniszczeniem obiektu do zwolnienia zasobów. Nie jest gwarantowany ani moment, ani samo wywołanie, więc nie można na niej polegać; metoda jest przestarzała i oznaczona do usunięcia (JEP 421). Używa się try-with-resources i `Cleaner`.
:::

## Zadanie domowe

W wideo nie ma zadań — własne zadania.

:::task easy "Sklasyfikuj"
Dla każdego wyjątku podaj checked/unchecked/error i typową przyczynę: `IOException`, `NumberFormatException`, `InterruptedException`, `ConcurrentModificationException`, `StackOverflowError`, `CloneNotSupportedException`, `IllegalStateException`. Wywołaj każdy w kodzie.
:::

:::task medium "Własne wyjątki"
Serwis przelewów: `InsufficientFundsException` (checked — klient może zasilić konto) i `AccountNotFoundException` (unchecked). Metoda `transfer` przekazuje dalej pierwszy, kod wywołujący wypisuje zrozumiały komunikat. Opakuj niskopoziomowy błąd we własny wyjątek z przyczyną i wypisz cały łańcuch `getCause()`.
:::

:::task hard "Cleaner zamiast finalize"
Zrób klasę `NativeBuffer implements AutoCloseable`, która „przydziela zasób” (wypisuje) i zwalnia go w `close()`. Zarejestruj akcję zabezpieczającą przez `Cleaner`, która zadziała, jeśli zapomniano o `close()`. Pokaż oba scenariusze: try-with-resources oraz zapomniany obiekt + `System.gc()`. Dlaczego akcja czyszcząca nie może odwoływać się do samego obiektu?
:::
