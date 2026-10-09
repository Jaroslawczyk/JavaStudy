**Dziedziczenie** pozwala utworzyć nową klasę na podstawie istniejącej: podklasa dostaje pola i metody nadklasy i dodaje własne cechy. Omawiamy `extends`, `super`, nadpisywanie metod i adnotację `@Override`.

## Znaczniki czasu wideo

- {{t j1 4:06:49}} — czym jest dziedziczenie: rodzina kotowatych
- {{t j1 4:07:53}} — projekt Inheritance, klasa `CatFamily`
- {{t j1 4:09:26}} — `class Cat extends CatFamily`
- {{t j1 4:11:05}} — podklasa dostaje pola nadklasy
- {{t j1 4:12:08}} — wspólna metoda `showInfo` w nadklasie
- {{t j1 4:13:25}} — pola `private` są niedostępne nawet dla podklasy
- {{t j1 4:14:51}} — wywołanie konstruktora nadklasy: `super(...)`
- {{t j1 4:15:39}} — niejawne wywołanie `super()` i dlaczego w `Leon` pojawił się błąd
- {{t j1 4:17:47}} — metoda `eat` w nadklasie
- {{t j1 4:18:45}} — nadpisywanie metody (override)
- {{t j1 4:19:38}} — adnotacja `@Override`
- {{t j1 4:20:28}} — szybkie nadpisywanie: <kbd>Ctrl+O</kbd>
- {{t j1 4:21:34}} — `super.eat()` — wywołanie wersji rodzica
- {{t j1 4:22:18}} — zadanie domowe: `BoxWeight`
- {{t j1 4:23:38}} — omówienie rozwiązania

## Składnia

```java
public class CatFamily {
    private int ears;
    private int paws;
    private boolean bigClaws;

    public CatFamily(int ears, int paws, boolean bigClaws) {
        this.ears = ears;
        this.paws = paws;
        this.bigClaws = bigClaws;
    }

    public void eat() {
        System.out.print("Jem ");
    }

    public void showInfo() {
        System.out.println("Uszy: " + ears + ", łapy: " + paws + ", duże pazury: " + bigClaws);
    }
}
```

```java
public class Cat extends CatFamily {           // Cat — podklasa, CatFamily — nadklasa
    public Cat() {
        super(2, 4, false);                     // najpierw tworzona jest „część rodzica”
    }

    @Override
    public void eat() {
        super.eat();                            // wywołaj wersję nadklasy
        System.out.println("karmę dla kotów");
    }
}

public class Leon extends CatFamily {
    public Leon() {
        super(2, 4, true);
    }

    @Override
    public void eat() {
        super.eat();
        System.out.println("antylopę");
    }
}
```

```java
new Cat().eat();        // Jem karmę dla kotów
new Leon().eat();       // Jem antylopę
new Leon().showInfo();  // metoda odziedziczona, dane — lwa
```

## Najważniejsze zasady

- **Podklasa dziedziczy** wszystkie pola i metody, ale składowe `private` są dla niej **niedostępne bezpośrednio** — pracuj przez metody `public`/`protected` lub konstruktor nadklasy.
- **Konstruktor podklasy zawsze najpierw wywołuje konstruktor nadklasy.** Jeśli nie napiszesz `super(...)`, kompilator wstawi `super()` — wywołanie konstruktora **bezparametrowego**. Jeśli rodzic go nie ma — błąd kompilacji (właśnie to stało się z `Leon` w wideo).
- W Javie klasa może dziedziczyć **tylko po jednej** klasie.

## Nadpisywanie i @Override

**Nadpisywanie (override)** — podklasa daje własną implementację metody o **tej samej sygnaturze** co u rodzica.

`@Override` nie zmienia działania programu, ale:

1. pokazuje czytelnikowi, że metoda nadpisuje metodę rodzica;
2. zmusza kompilator do sprawdzenia tego: literówka (`eatt()`) od razu będzie błędem, a nie po cichu utworzy nową metodę.

:::tip
Zawsze stawiaj `@Override`. <kbd>Ctrl+O</kbd> (Override Methods) w IDEA robi to automatycznie.
:::

## Czego nie ma w wideo

### Object — przodek wszystkich klas

Jeśli nie podano `extends`, klasa niejawnie dziedziczy po `java.lang.Object`. Dlatego każdy obiekt ma metody `toString()`, `equals()`, `hashCode()`, `getClass()`. Często się je nadpisuje:

```java
@Override
public String toString() {
    return "Cat{ears=2, paws=4}";
}
// System.out.println(cat) wypisze teraz czytelny tekst zamiast Cat@1b6d3586
```

### Modyfikator protected

Składowe `protected` są dostępne w podklasach (nawet w innych pakietach) i w obrębie swojego pakietu. Kompromis między `private` a `public`, gdy podklasa naprawdę potrzebuje bezpośredniego dostępu.

### Zasady nadpisywania

- Nie można **zawężać** dostępu: metody `public` nie da się nadpisać jako `protected`.
- Typ zwracany — ten sam lub **podtyp** (kowariantny typ zwracany).
- Nie można rzucać nowych wyjątków **kontrolowanych**, których nie deklaruje rodzic.
- Metody `static` i `private` nie są nadpisywane (statyczne są „przesłaniane”).
- Metody `final` nie można nadpisać (następna lekcja).

### Kolejność tworzenia obiektu podklasy

`new Cat()` → konstruktor `Cat` → najpierw `super(...)` → konstruktor `CatFamily` → (wyżej — `Object`) → potem reszta ciała konstruktora `Cat`. Rodzic zawsze „składa się” pierwszy.

### Dziedziczenie a kompozycja

Dziedziczenie wyraża relację **„jest” (is-a)**: kot *jest* kotowatym. Jeśli relacja to **„ma” (has-a)** — samochód *ma* silnik — używaj **kompozycji** (pole typu `Engine`), a nie dziedziczenia. Zasada „przedkładaj kompozycję nad dziedziczenie” pochodzi z książki „Effective Java” i często pada na rozmowach.

:::outdated "Ograniczone dziedziczenie: sealed (Java 17+)"
Od Javy 17 można jawnie wymienić, kto ma prawo dziedziczyć po klasie:

```java
public sealed class Shape permits Circle, Square { }
public final class Circle extends Shape { }
public final class Square extends Shape { }
```

Pomaga to modelować zamknięte hierarchie i świetnie łączy się z pattern matchingiem w `switch`.
:::

## Zadanie domowe

:::task video "Pudełko z wagą — z wideo"
Utwórz klasę `BoxWeight`, która dziedziczy po `Box` i dodaje prywatne pole `weight`. Zrób konstruktory powtarzające konstruktory `Box`, ale z dodatkową wagą, oraz getter i setter wagi. W `Box` dodaj metodę `showInfo()` (długość, szerokość, wysokość, objętość), a w `BoxWeight` nadpisz ją, by dodatkowo wypisywała wagę. W `main` utwórz zwykłe pudełko i pudełko z wagą różnymi konstruktorami i wypisz informacje. {{t j1 4:22:18}}
??? Podpowiedź
W każdym konstruktorze `BoxWeight` pierwszą linią wywołaj `super(...)` z wymiarami, potem przypisz `this.weight = weight;`. W `showInfo()` najpierw `super.showInfo();`, potem wypisanie wagi. Omówienie: {{t j1 4:23:38}}
:::

:::task easy "toString dla zwierząt"
Nadpisz `toString()` w `CatFamily` tak, aby `System.out.println(cat)` wypisywał klasę i parametry: `Cat{ears=2, paws=4, bigClaws=false}`. Podpowiedź: `getClass().getSimpleName()`.
:::

:::task medium "Pracownicy i pensje"
Klasa `Employee` (imię, stawka bazowa, metoda `double salary()`), podklasy `Manager` (+ premia) i `Developer` (+ dodatek za każdy projekt). Nadpisz `salary()`, używając `super.salary()`. Włóż różnych pracowników do `List<Employee>` i policz łączny fundusz płac.
:::

:::task hard "Łańcuch konstruktorów"
Utwórz hierarchię `A → B → C` (C dziedziczy po B, B po A). W każdym konstruktorze i w bloku inicjalizacyjnym `{ … }` wypisuj komunikat. Przewidź kolejność wyniku przy `new C()`, potem sprawdź. Dodaj do `A` metodę wywoływaną z konstruktora `A` i nadpisaną w `C` — i wyjaśnij, dlaczego pola `C` nie są w niej jeszcze zainicjalizowane (to prawdziwa pułapka!).
??? Podpowiedź
Kolejność: bloki i konstruktor `A`, potem `B`, potem `C`. Nadpisana metoda jest wywoływana **wirtualnie** już z konstruktora `A`, gdy pola `C` mają jeszcze wartości domyślne (`0`/`null`). Wniosek: nie wywołuj metod, które można nadpisać, z konstruktora.
:::
