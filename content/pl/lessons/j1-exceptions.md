**Wyjątek (exception)** to sygnał, że coś poszło nie tak: dzielenie przez zero, zły format liczby, wyjście poza zakres tablicy. Uczymy się przechwytywać wyjątki przez `try-catch-finally`, by program się nie wysypywał — i omawiamy to, czego nie ma w wideo: hierarchię, wyjątki kontrolowane, `throw`/`throws` i try-with-resources.

## Znaczniki czasu wideo

- {{t j1 5:10:14}} — temat lekcji: obsługa wyjątków
- {{t j1 5:10:42}} — dzielenie `7 / 0` wysypuje program
- {{t j1 5:11:38}} — czytamy log: `ArithmeticException: / by zero`
- {{t j1 5:12:01}} — konstrukcja `try-catch`
- {{t j1 5:12:38}} — wyjątek to obiekt
- {{t j1 5:13:41}} — wszystkie wyjątki dziedziczą po `Exception`
- {{t j1 5:14:11}} — `NumberFormatException` przy `parseInt`
- {{t j1 5:14:49}} — po wyjątku reszta bloku `try` jest pomijana
- {{t j1 5:15:24}} — kilka bloków `catch`
- {{t j1 5:16:57}} — łapiemy wszystko: `catch (Exception e)`
- {{t j1 5:17:54}} — kolejność `catch` ma znaczenie: najpierw szczegółowe, potem ogólne
- {{t j1 5:19:20}} — blok `finally`
- {{t j1 5:20:05}} — `finally` wykonuje się zawsze
- {{t j1 5:20:38}} — zadanie domowe

## try-catch

```java
int a = 0;
try {
    int b = 7 / a;                          // tu rzucany jest wyjątek
    int i = Integer.parseInt("12ab");       // do tej linii nie dojdziemy
    System.out.println("Nie wypisze się");
} catch (ArithmeticException e) {
    System.out.println("Nie można dzielić przez zero");
} catch (NumberFormatException e) {
    System.out.println("Błąd konwersji");
} finally {
    System.out.println("Jesteśmy w bloku finally");   // wykona się w każdym przypadku
}
System.out.println("Cześć");                          // program działa dalej
```

Jak to działa:

1. Kod w `try` wykonuje się linia po linii.
2. Gdy tylko zostanie rzucony wyjątek, **reszta kodu w `try` jest pomijana**.
3. Java szuka pierwszego `catch`, którego typ pasuje do wyjątku (z uwzględnieniem dziedziczenia), i go wykonuje.
4. `finally` wykonuje się **zawsze** — był wyjątek czy nie. Używa się go do zwalniania zasobów: zamknięcia pliku, połączenia sieciowego lub z bazą.
5. Jeśli żaden `catch` nie pasuje — wyjątek „leci” wyżej, a jeśli nikt go nie złapie, program zakończy się ze śladem stosu (stack trace).

:::warning "Kolejność catch"
Najpierw łapie się wyjątki **szczegółowe**, potem **ogólne**. Jeśli jako pierwszy postawisz `catch (Exception e)`, to kolejny `catch (ArithmeticException e)` się nie skompiluje: `exception ArithmeticException has already been caught` — nic do niego nie dotrze.
:::

## Hierarchia wyjątków

```text
Throwable
├── Error                      — awarie JVM: OutOfMemoryError, StackOverflowError (nie łapie się ich)
└── Exception                  — KONTROLOWANE (checked): IOException, SQLException…
    └── RuntimeException       — NIEKONTROLOWANE (unchecked):
        ├── ArithmeticException
        ├── NullPointerException
        ├── IllegalArgumentException
        │   └── NumberFormatException
        ├── IndexOutOfBoundsException
        │   └── ArrayIndexOutOfBoundsException
        └── ClassCastException
```

## Czego nie ma w wideo

### Wyjątki kontrolowane i niekontrolowane

- **Checked** (podklasy `Exception`, ale nie `RuntimeException`) — kompilator **zmusza** do ich obsługi: albo `try-catch`, albo deklaracja `throws` w sygnaturze. Przykład: odczyt pliku rzuca `IOException`.
- **Unchecked** (`RuntimeException` i podklasy) — zwykle błędy programisty: `null`, zły indeks. Obsługa nie jest obowiązkowa — lepiej poprawić kod.

```java
public String readFirstLine(Path path) throws IOException {   // „mogę rzucić IOException”
    return Files.readAllLines(path).get(0);
}
```

To klasyczne pytanie rekrutacyjne: „Czym różnią się checked od unchecked?”

### Rzucanie wyjątku samemu: throw

```java
public void setAge(int age) {
    if (age <= 0) {
        throw new IllegalArgumentException("Wiek musi być dodatni: " + age);
    }
    this.age = age;
}
```

### Własny wyjątek

```java
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(double needed) {
        super("Niewystarczające środki, brakuje: " + needed);
    }
}
```

### Kilka typów w jednym catch (Java 7+)

```java
try {
    …
} catch (ArithmeticException | NumberFormatException e) {
    System.out.println("Błąd obliczeń: " + e.getMessage());
}
```

### try-with-resources (Java 7+)

Zamiast zamykania zasobu w `finally` — automatyczne zamknięcie wszystkiego, co implementuje `AutoCloseable`:

```java
try (Scanner scanner = new Scanner(Path.of("data.txt"))) {
    while (scanner.hasNextLine()) {
        System.out.println(scanner.nextLine());
    }
} catch (IOException e) {
    System.out.println("Nie udało się odczytać pliku: " + e.getMessage());
}   // scanner.close() wywoła się automatycznie
```

Szczegóły — w drugiej części kursu, w dziale o pracy z plikami.

### Antywzorce

:::warning "Nie połykaj wyjątków"
W wideo jest przykład `catch (Exception e) { }` z pustym ciałem — „złap wszystko i nic nie rób”. Na pokaz w porządku, w prawdziwym kodzie to **jedna z najgorszych praktyk**: błąd znika bez śladu i potem nie da się zrozumieć, dlaczego program dziwnie się zachowuje. Przynajmniej loguj: `log.error("Nie udało się …", e)` (logowanie — artykuł [Logging](#/extra/logging)).
:::

- Nie łap `Exception`/`Throwable` „na wszelki wypadek” — łap to, co umiesz obsłużyć.
- Nie używaj wyjątków zamiast `if`: sprawdzenie `a != 0` jest tańsze i czytelniejsze niż łapanie `ArithmeticException`.
- `e.printStackTrace()` — do nauki; w projektach — logger.
- Nie rób `return` w `finally`: „przebija” on i wynik, i wyjątek z `try`.

## Zadanie domowe

:::task video "Wyjście poza tablicę — z wideo"
Stwórz sytuację, w której zostanie rzucony `ArrayIndexOutOfBoundsException` (np. odwołanie do 11. elementu tablicy 10-elementowej lub do indeksu −1). Obsłuż go w `try-catch` i wypisz „Wyjście poza zakres tablicy”. {{t j1 5:20:38}}
:::

:::task easy "Bezpieczne wczytywanie liczby"
Użytkownik wpisuje napis; program próbuje zamienić go na `int`. Jeśli się nie uda — prosi o ponowne wpisanie, aż do poprawnej liczby (pętla + `try-catch (NumberFormatException)`).
:::

:::task medium "Własny wyjątek dla konta"
Użyj klasy `BankAccount` z poprzednich lekcji. Metoda `withdraw` rzuca twój `InsufficientFundsException` (podklasa `RuntimeException`) z brakującą kwotą. W `main` obsłuż go i wypisz czytelny komunikat. Następnie zrób wyjątek **kontrolowanym** (podklasa `Exception`) i zobacz, czego zażąda kompilator.
:::

:::task hard "Kolejność wykonania"
Napisz metodę z `try`, `catch` i `finally`, w każdym z nich `System.out.println` i `return` z różnymi wartościami. Wywołaj ją, gdy wyjątek jest rzucany i gdy nie jest. Przewidź, co zostanie zwrócone i wypisane, potem sprawdź. Wyjaśnij, dlaczego `return` w `finally` uważa się za błąd.
??? Podpowiedź
`finally` wykonuje się nawet po `return` w `try`. Jeśli w `finally` też jest `return`, zastąpi on wartość z `try` i „połknie” wyjątek — dlatego IDEA podświetla taki kod ostrzeżeniem.
:::
