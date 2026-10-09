Pytanie „wymień zasady OOP” pojawia się niemal na każdej rozmowie na stanowisko Junior. Omawiamy **hermetyzację, dziedziczenie i polimorfizm** z przykładami z życia i z kodu — i dodajemy to, czego w wideo nie ma: **abstrakcję**, kompozycję i zasady **SOLID**.

## Znaczniki czasu wideo

- {{t j2 7:17:14}} — powtarzamy OOP w formie rozmowy rekrutacyjnej
- {{t j2 7:17:30}} — czym jest OOP
- {{t j2 7:17:53}} — główne paradygmaty (zasady) OOP
- {{t j2 7:18:17}} — hermetyzacja
- {{t j2 7:18:34}} — przykład: kierowca i samochód
- {{t j2 7:19:06}} — dziedziczenie: rodzina kotowatych
- {{t j2 7:19:26}} — polimorfizm: interfejs `Employee`
- {{t j2 7:21:25}} — jedno wywołanie `work()` — różne zachowanie
- {{t j2 7:21:46}} — „jeden interfejs — wiele implementacji”
- {{t j2 7:22:03}} — przykład: tani i drogi samochód

## Czym jest OOP

Programowanie obiektowe to podejście, w którym program buduje się z **obiektów**: każdy łączy dane (pola) i zachowanie (metody) i współdziała z innymi przez ich publiczny interfejs. Klasa to „projekt”, obiekt — egzemplarz według tego projektu.

## Hermetyzacja

**Ukrywanie implementacji** i ochrona stanu obiektu: dane zmieniają się tylko przez metody, które pilnują reguł.

```java
public class BankAccount {
    private long balance;                       // z zewnątrz nie da się zmienić bezpośrednio

    public void deposit(long amount) {
        if (amount <= 0) throw new IllegalArgumentException("Kwota musi być > 0");
        balance += amount;
    }
    public long getBalance() { return balance; } // tylko odczyt — brak settera
}
```

W Javie hermetyzację osiąga się modyfikatorami dostępu (`private`, package-private, `protected`, `public`) i [modułami](#/extra/modules). Przykład z wideo: kierowca używa kierownicy i pedałów, nie sterując bezpośrednio dopływem paliwa.

:::tip "Hermetyzacja ≠ getter i setter na każde pole"
Jeśli każde pole ma publiczny setter, obiekt niczego nie chroni. Dawaj metody z **sensem** (`deposit`, `withdraw`), a nie `setBalance`. Obiekty niezmienne (`record`, pola `final`) to najsilniejsza hermetyzacja.
:::

## Dziedziczenie

Klasa pochodna dostaje pola i metody rodzica i dodaje własne: `class Lion extends Feline`. Wspólne cechy kotowatych — w rodzicu, unikalne — u lwa, tygrysa, kota. W Javie klasa dziedziczy **tylko po jednej** klasie, ale implementuje dowolną liczbę interfejsów.

## Polimorfizm

**Jeden interfejs — wiele implementacji**: kod pracuje ze wspólnym typem, a zachowanie określa rzeczywisty obiekt w czasie działania (wiązanie dynamiczne).

```java
interface Employee { void work(); }
class Programmer implements Employee { public void work() { System.out.println("Programista pisze kod"); } }
class Cook implements Employee { public void work() { System.out.println("Kucharz gotuje"); } }

List<Employee> staff = List.of(new Programmer(), new Cook());
for (Employee e : staff) e.work();     // jedno wywołanie — różne zachowanie
```

Rodzaje polimorfizmu: **nadpisywanie** (runtime, jak wyżej) i **przeciążanie** (compile-time — jedna nazwa metody z różnymi parametrami). Więcej o wiązaniu — w artykule [Static vs dynamic binding](#/extra/binding).

## Abstrakcja — czwarta zasada

Wideo wymienia trzy zasady, ale w wielu źródłach i na rozmowach jest ich **cztery**: dochodzi **abstrakcja** — wyodrębnienie istotnych cech obiektu i pominięcie nieistotnych. Interfejs `Employee` to abstrakcja: ważne jest, że pracownik potrafi `work()`, a nie jak wygląda jego dzień pracy. Wymienienie wszystkich czterech nigdy nie będzie błędem.

:::interview "Pytania rekrutacyjne"
**Wymień zasady OOP.** — Hermetyzacja, dziedziczenie, polimorfizm (+ abstrakcja).

**Podaj przykład polimorfizmu z życia.** — Samochód: interfejs jeden (kierownica, pedały), a implementacja różna: drogi samochód jedzie łagodniej i szybciej niż tani.

**Kompozycja czy dziedziczenie?** — „Przedkładaj kompozycję nad dziedziczenie”: dziedziczenie sztywno wiąże klasy i psuje się przy zmianie rodzica; kompozycja (obiekt zawiera inny i deleguje do niego) jest elastyczniejsza. Dziedziczenie — gdy naprawdę „jest” (is-a) i spełniona jest zasada podstawienia Liskov.
:::

## SOLID (nie z wideo, ale pytają już od Junior+)

| Litera | Zasada | W skrócie |
|---|---|---|
| **S** | Single Responsibility | Klasa ma jeden powód do zmiany |
| **O** | Open/Closed | Otwarta na rozszerzanie, zamknięta na modyfikację (nowe zachowanie — nową klasą) |
| **L** | Liskov Substitution | Podklasę można podstawić za rodzica bez niespodzianek (kwadrat to nie prostokąt z setterami) |
| **I** | Interface Segregation | Wiele małych interfejsów jest lepszych niż jeden „gruby” |
| **D** | Dependency Inversion | Zależeć od abstrakcji, a nie od konkretnych klas (podstawa DI w Springu) |

Warto też znać: **DRY**, **KISS**, **YAGNI** i główne wzorce GoF (Singleton, Factory, Builder, Strategy, Observer, Decorator — ten ostatni już widziałeś w strumieniach wejścia-wyjścia).

## Zadanie domowe

W wideo nie ma zadań — praktyka.

:::task easy "Hermetyzowane konto"
Przepisz klasę z publicznymi polami `balance` i `owner` tak, by saldo nie mogło być ujemne, a właściciela nie dało się zmienić po utworzeniu. Napisz testy na zabronione operacje.
:::

:::task medium "Polimorfizm zamiast switch"
Jest metoda `double area(String type, double… params)` z dużym `switch` według typu figury. Przepisz na interfejs `Shape` z metodą `area()` i klasy-implementacje. Dodaj nową figurę — ile miejsc w kodzie trzeba było zmienić przed i po?
:::

:::task hard "Naruszenia SOLID"
Dana jest klasa `OrderService`, która sama waliduje zamówienie, liczy rabat przez `if (customer.type == VIP)`, zapisuje do bazy przez `new MySqlRepository()` i wysyła e-mail przez `new SmtpClient()`. Znajdź naruszenia każdej litery SOLID i zrefaktoryzuj: wydziel interfejsy `DiscountPolicy`, `OrderRepository`, `Notifier`, przekazuj zależności przez konstruktor i pokryj serwis testami z fałszywymi implementacjami. O wstrzykiwaniu zależności — [DI](#/extra/dependency-injection).
:::
