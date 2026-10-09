Oprócz konstruktorów Java ma **bloki inicjalizacyjne** — statyczne i niestatyczne. W kodzie aplikacyjnym rzadko są potrzebne, ale kolejność inicjalizacji klasy to ulubiony temat zagadek rekrutacyjnych („co wypisze program?”).

## Blok statyczny

```java
public class Config {
    static final Map<String, String> DEFAULTS;

    static {                                  // wykonuje się RAZ — przy inicjalizacji klasy
        DEFAULTS = new HashMap<>();
        DEFAULTS.put("timeout", "30");
        DEFAULTS.put("retries", "3");
    }
}
```

Klasa jest inicjalizowana leniwie — przy pierwszym „aktywnym” użyciu: utworzeniu obiektu, wywołaniu metody statycznej, odwołaniu do pola statycznego (poza stałymi czasu kompilacji). Blok statyczny jest wygodny do złożonej inicjalizacji pól statycznych i ładowania bibliotek natywnych.

## Blok inicjalizacyjny instancji

```java
public class Order {
    private final List<String> items;

    {                                         // wykonuje się PRZED ciałem każdego konstruktora
        items = new ArrayList<>();
        System.out.println("instance block");
    }

    public Order() { System.out.println("constructor"); }
    public Order(String first) { this(); items.add(first); }
}
```

Używa się go, by nie duplikować wspólnego kodu w kilku konstruktorach (choć częściej wywołuje się w tym celu `this(...)`) oraz w klasach anonimowych, które nie mają konstruktora.

## Kolejność inicjalizacji

```java
class Parent {
    static { System.out.println("1. static Parent"); }
    { System.out.println("3. instance Parent"); }
    Parent() { System.out.println("4. constructor Parent"); }
}
class Child extends Parent {
    static { System.out.println("2. static Child"); }
    { System.out.println("5. instance Child"); }
    Child() { System.out.println("6. constructor Child"); }
}

new Child();
new Child();   // za drugim razem — tylko kroki 3–6
```

Zasada:
1. **Statyka** — raz na klasę: najpierw rodzic, potem potomek; wewnątrz klasy — pola statyczne i `static {}` **w kolejności zapisu**.
2. **Instancja** — przy każdym `new`: wywołanie `super(...)` → pola i bloki instancji rodzica (po kolei) → ciało konstruktora rodzica → pola i bloki potomka → ciało konstruktora potomka.

:::warning "Pułapka: wywołanie wirtualne z konstruktora rodzica"
Jeśli konstruktor rodzica wywołuje nadpisaną metodę, wykona się wersja potomka — gdy pola potomka **nie są jeszcze zainicjalizowane** (jest tam `null`/`0`). Nie wywołuj nadpisywalnych metod z konstruktorów.
:::

:::outdated "Kod przed super() — Java 25"
Wcześniej `super(...)` lub `this(...)` musiały być pierwszą linią konstruktora. Od **Javy 25** (JEP 513, flexible constructor bodies) można przed nimi pisać kod: sprawdzać argumenty i **przypisywać** pola bieżącej klasy (ale nie czytać `this`). Rozwiązuje to też problem z ostrzeżenia powyżej: pole można zainicjalizować przed wywołaniem konstruktora rodzica.

```java
public Child(int value) {
    if (value < 0) throw new IllegalArgumentException();   // przed super — Java 25
    this.value = value;
    super();
}
```
:::

:::interview "Pytanie rekrutacyjne"
**W jakiej kolejności wykonują się bloki statyczne, bloki instancji i konstruktory przy dziedziczeniu?** — Bloki statyczne rodzica, potem potomka (raz). Przy tworzeniu obiektu: bloki i inicjalizatory pól rodzica, konstruktor rodzica, potem bloki/pola potomka i konstruktor potomka.
:::

## Zadanie domowe

:::task easy "Co wypisze program"
Bez uruchamiania zapisz wynik przykładu `Parent/Child` dla dwóch wywołań `new Child()`. Potem uruchom i porównaj. Dodaj pole statyczne `static int counter = init("counter")` między blokami — gdzie pojawi się jego wypis?
:::

:::task medium "Pułapka w konstruktorze"
Napisz `Parent` z konstruktorem wywołującym `describe()` i `Child`, który nadpisuje `describe()` i wypisuje swoje pole `private final String name = "child"`. Wyjaśnij, dlaczego wypisuje się `null`. Napraw na dwa sposoby: bez wywołania metody wirtualnej oraz (w Javie 25) przypisując pole przed `super()`.
:::

:::task hard "Leniwa inicjalizacja klasy"
Udowodnij doświadczalnie, że blok statyczny wykonuje się nie przy ładowaniu programu, lecz przy pierwszym aktywnym użyciu klasy. Sprawdź przypadki: odwołanie do `static final int CONST = 5` (stała czasu kompilacji — blok się **nie** wykona), do `static final Integer BOXED = 5`, wywołanie `Class.forName("…")`, utworzenie tablicy `new Config[10]`. Wyjaśnij każdy wynik.
:::
