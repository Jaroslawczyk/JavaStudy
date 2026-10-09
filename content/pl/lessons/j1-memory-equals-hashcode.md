Trzy tematy, bez których nie da się zrozumieć `HashSet` i `HashMap`, a o które pytają na prawie każdej rozmowie: **jak zorganizowana jest pamięć w Javie** (stos i sterta), **garbage collector** oraz metody **`equals()`** i **`hashCode()`**.

## Znaczniki czasu wideo

- {{t j1 7:18:07}} — trzy ważne tematy: pamięć, `equals`, `hashCode`
- {{t j1 7:18:40}} — dwa identyczne samochody, a `==` daje `false`
- {{t j1 7:19:40}} — stos i sterta (heap)
- {{t j1 7:20:07}} — typy proste i referencje żyją na stosie
- {{t j1 7:20:29}} — obiekty tworzone są na stercie, na stosie jest tylko adres
- {{t j1 7:21:01}} — co porównuje `==`
- {{t j1 7:21:25}} — dwie zmienne — jeden obiekt
- {{t j1 7:23:05}} — obiekt bez referencji i garbage collector
- {{t j1 7:24:13}} — pytanie: czy GC usunie dwa obiekty wskazujące na siebie nawzajem?
- {{t j1 7:24:37}} — dlaczego napisów nie porównuje się przez `==`
- {{t j1 7:25:32}} — metoda `equals`
- {{t j1 7:26:21}} — `equals` z `Object` porównuje referencje
- {{t j1 7:27:04}} — nadpisujemy `equals` w `Car`
- {{t j1 7:30:04}} — metoda `hashCode`
- {{t j1 7:30:50}} — zasada: równe wg `equals` → równe hash code'y
- {{t j1 7:32:28}} — kolizje
- {{t j1 7:33:12}} — generowanie `equals` i `hashCode` w IDEA
- {{t j1 7:35:00}} — pytania rekrutacyjne

## Stos i sterta

```java
int number = 5;                     // stos: number = 5
Car car1 = new Car("BMW", 1);       // stos: car1 = adres → sterta: obiekt Car
Car car2 = car1;                    // stos: car2 = ten sam adres
```

| | Stos (stack) | Sterta (heap) |
|---|---|---|
| Co przechowuje | Zmienne lokalne: typy proste i **referencje** | Wszystkie **obiekty** utworzone przez `new` (i tablice) |
| Czyj | Każdy wątek ma własny | Jedna na całą JVM, wspólna dla wątków |
| Rozmiar | Mały (zwykle ~1 MB na wątek, flaga `-Xss`) | Duży, ograniczony flagą `-Xmx` (domyślnie ≈ ¼ RAM) |
| Czyszczenie | Automatycznie po wyjściu z metody | Garbage collector (GC) |
| Błąd przy przepełnieniu | `StackOverflowError` (np. nieskończona rekurencja) | `OutOfMemoryError: Java heap space` |

Dlatego `car1 == car2` porównuje **wartości na stosie** — czyli adresy. Dla typów prostych to same wartości, a dla obiektów — odpowiedź na pytanie „czy to ten sam obiekt?”.

## Garbage collector

```java
Car car1 = new Car("BMW", 1);
Car car2 = new Car("BMW", 1);
car2 = car1;     // na drugi obiekt nikt już nie wskazuje — stanie się śmieciem
```

GC usuwa obiekty, **do których nie da się dotrzeć** od „korzeni”: zmiennych lokalnych na stosach wątków, pól statycznych, aktywnych wątków. Dlatego:

- dwa obiekty wskazujące **tylko na siebie nawzajem** zostaną usunięte — nie da się do nich dojść od korzeni. Java używa GC **śledzącego** (tracing), a nie liczenia referencji, więc cykle mu nie przeszkadzają;
- nie trzeba wywoływać GC ręcznie (`System.gc()`) — to tylko „prośba”, JVM decyduje sama.

:::note "Uściślenie do wideo"
W wideo pada „obiekt jest usuwany, gdy nie ma do niego referencji ze stosu”. To uproszczenie: korzeniami (GC roots) są też pola statyczne klas, referencje JNI, wątki. Obiekt, na który wskazuje pole `static`, nie zostanie usunięty nigdy — klasyczne źródło wycieków pamięci. Domyślnym GC jest dziś **G1** (a od Javy 27 — we wszystkich środowiskach); dla minimalnych pauz jest **ZGC**.
:::

## equals — porównanie zawartości

Metoda `equals` jest dziedziczona z `Object` i domyślnie robi to samo co `==` — porównuje referencje. Aby porównywać po polach, się ją **nadpisuje**:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;                       // ten sam obiekt
    if (o == null || getClass() != o.getClass()) return false;
    Car car = (Car) o;
    return number == car.number && Objects.equals(brand, car.brand);
}
```

### Kontrakt equals

1. **Zwrotność**: `x.equals(x)` — `true`.
2. **Symetria**: jeśli `x.equals(y)`, to i `y.equals(x)`.
3. **Przechodniość**: `x.equals(y)` i `y.equals(z)` → `x.equals(z)`.
4. **Spójność**: powtórne wywołania dają ten sam wynik, dopóki obiekty się nie zmieniły.
5. `x.equals(null)` — zawsze `false`.

## hashCode — liczbowa reprezentacja obiektu

`hashCode()` zwraca `int`, dzięki któremu kolekcje haszujące (`HashSet`, `HashMap`) szybko znajdują „kubełek” dla obiektu.

```java
@Override
public int hashCode() {
    return Objects.hash(brand, number);
}
```

### Zasady equals i hashCode

1. **Nadpisałeś `equals` — nadpisz `hashCode`.** Inaczej równe obiekty dostaną różne hash code'y, `HashSet` będzie przechowywać „duplikaty”, a `HashMap` nie znajdzie klucza.
2. Jeśli obiekty są **równe** wg `equals` → hash code'y **muszą** być równe.
3. Jeśli hash code'y są **różne** → obiekty na pewno są różne.
4. Jeśli hash code'y są **równe** → obiekty mogą się różnić — to **kolizja** (hash code'ów jest ~4,3 mld, a obiektów może być dowolnie wiele).

<kbd>Alt+Insert</kbd> → **equals() and hashCode()** — IDEA wygeneruje obie metody według wybranych pól.

## Czego nie ma w wideo

### getClass() czy instanceof?

Kod wygenerowany przez IDEA sprawdza `getClass() != o.getClass()` — obiekt podklasy nigdy nie będzie równy obiektowi rodzica. Wariant z `instanceof` dopuszcza podklasy, ale łatwo łamie **symetrię**. Bez ważnego powodu używaj `getClass()` albo rób klasę `final`.

### Rekordy robią to za ciebie

```java
public record Car(String brand, int number) { }
// equals, hashCode i toString generują się automatycznie ze wszystkich pól
```

### Napisy i pula napisów

**Literały** napisowe o tym samym tekście JVM przechowuje w **puli napisów** (string pool) w jednym egzemplarzu, więc `"BMW" == "BMW"` przypadkiem daje `true`. Ale napis z wejścia, pliku czy po sklejeniu to nowy obiekt. Dlatego napisy — tylko przez `equals`. Hash code `String` liczy się raz i jest cache'owany.

### Nie wkładaj zmiennych pól do hashCode klucza

Jeśli pole uczestniczące w `hashCode` zmieni się w obiekcie, który już leży w `HashSet`/`HashMap`, obiekt „zgubi się” w kolekcji. Szczegóły w lekcji o `HashMap`.

## Pytania rekrutacyjne

:::interview "Z wideo"
1. **Jak zorganizowana jest pamięć w Javie?** — Typy proste i referencje do obiektów — na stosie (każdy wątek ma własny), same obiekty — na stercie.
2. **Kiedy garbage collector usuwa obiekt?** — Gdy obiekt jest nieosiągalny od GC roots (stosy, pola statyczne, wątki).
3. **Czy GC usunie dwa obiekty wskazujące tylko na siebie?** — Tak, jeśli nie da się do nich dojść od korzeni.
4. **Dlaczego nie można porównywać napisów i obiektów przez `==`?** — `==` porównuje referencje (adresy), a nie zawartość.
5. **Jak porównać obiekty po polach?** — Nadpisać `equals` (a razem z nim `hashCode`).
6. **Jakie są zasady equals i hashCode?** — Nadpisałeś `equals` → nadpisz `hashCode`; równe obiekty — równe hash code'y; różne hash code'y — różne obiekty; równe hash code'y nie gwarantują równości (kolizja).
:::

## Zadanie domowe

W wideo nie ma osobnego zadania — utrwalmy praktyką.

:::task easy "Sprawdzenie kontraktu"
Wygeneruj `equals`/`hashCode` dla `Car`. Napisz testy sprawdzające zwrotność, symetrię, przechodniość, `equals(null) == false` oraz że równe samochody mają równe hash code'y.
:::

:::task medium "Zepsuty hashCode"
Nadpisz w `Car` tylko `equals` (bez `hashCode`), włóż do `HashSet<Car>` 1000 par identycznych samochodów i wypisz `size()`. Następnie zrób `hashCode` zawsze zwracający `1` i zmierz czas dodania 100 000 samochodów. Wyjaśnij oba wyniki.
:::

:::task medium "StackOverflowError i OutOfMemoryError"
Wywołaj oba błędy celowo: nieskończona rekurencja i nieskończone dodawanie dużych tablic do listy. Drugie uruchom z flagą `-Xmx64m` i zobacz, jak szybko skończy się pamięć. Czym te błędy różnią się od wyjątków (`Exception`)?
:::

:::task hard "equals z dziedziczeniem"
Jest `Point(x, y)` i `ColorPoint extends Point` z polem `color`. Zaimplementuj `equals` przez `instanceof` i pokaż na przykładzie złamanie symetrii (`point.equals(colorPoint) != colorPoint.equals(point)`). Następnie popraw przez `getClass()` oraz przez kompozycję (`ColorPoint` zawiera `Point`, zamiast po nim dziedziczyć). Który wariant zaleca „Effective Java”?
:::
