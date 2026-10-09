Czasem implementacja interfejsu jest potrzebna **raz, w jednym miejscu**, a tworzenie dla niej osobnej klasy trwa zbyt długo. Do tego służą **klasy anonimowe** — a we współczesnej Javie jeszcze krócej: **wyrażenia lambda**.

## Znaczniki czasu wideo

- {{t j1 5:02:57}} — kończymy temat interfejsów: projekt „Anonim”
- {{t j1 5:03:27}} — interfejs `Cookable` z metodą `cook()`
- {{t j1 5:04:01}} — zmiana nazwy klasy i pliku: <kbd>Shift+F6</kbd>
- {{t j1 5:04:14}} — klasa `Director` i metoda `force(Cookable cookable)`
- {{t j1 5:05:17}} — zwykły sposób: klasa `Cooker implements Cookable`
- {{t j1 5:06:04}} — problem: klasa dla jednego użycia
- {{t j1 5:06:22}} — klasa anonimowa: `new Cookable() { … }`
- {{t j1 5:07:59}} — gdzie się tego używa: nasłuchiwacze zdarzeń
- {{t j1 5:08:45}} — metody interfejsu mogą być dowolne
- {{t j1 5:09:04}} — zadanie domowe

## Zwykły sposób

```java
public interface Cookable {
    void cook();
}

public class Director {
    public void force(Cookable cookable) {
        cookable.cook();
    }
}

public class Cooker implements Cookable {
    @Override
    public void cook() {
        System.out.println("Gotuję");
    }
}
```

```java
Director director = new Director();
director.force(new Cooker());
```

## Klasa anonimowa

```java
director.force(new Cookable() {        // klasa bez nazwy implementująca Cookable
    @Override
    public void cook() {
        System.out.println("Gotuję");
    }
});
```

`new Cookable() { … }` jednocześnie **deklaruje** klasę bez nazwy i **tworzy** jej obiekt. W nawiasach klamrowych jest implementacja wszystkich abstrakcyjnych metod interfejsu. Klasa anonimowa może też dziedziczyć po zwykłej lub abstrakcyjnej klasie: `new Animal() { … }`.

Typowe zastosowanie — **nasłuchiwacze (listeners)**: obsługa kliknięcia przycisku w Androidzie, Swingu, JavaFX to obiekt, którego metoda zostanie wywołana, gdy nastąpi zdarzenie.

:::outdated "Dziś zamiast klas anonimowych — lambdy"
Jeśli interfejs ma **dokładnie jedną metodę abstrakcyjną** (taki interfejs nazywa się **funkcyjnym**), od Javy 8 implementuje się go **wyrażeniem lambda**:

```java
director.force(() -> System.out.println("Gotuję"));
```

Obsługę zdarzeń, `Runnable`, `Comparator` we współczesnym kodzie pisze się lambdami. Klasa anonimowa nadal jest potrzebna, gdy metod jest kilka, potrzebny jest stan (pola) lub dziedziczenie po klasie. Lambdy i interfejsy funkcyjne — szczegółowo w drugiej części kursu i w artykule [Programowanie funkcyjne](#/extra/functional).
:::

## Czego nie ma w wideo

### Przechwytywanie zmiennych

Klasa anonimowa (i lambda) może używać zmiennych lokalnych z otaczającej metody, ale tylko **effectively final** — takich, które po przypisaniu się nie zmieniają:

```java
String dish = "barszcz";
director.force(new Cookable() {
    @Override
    public void cook() {
        System.out.println("Gotuję " + dish);   // OK
    }
});
// dish = "zupa";   // po odkomentowaniu — błąd kompilacji wyżej
```

### Jak naprawdę się nazywa

Kompilator jednak nadaje klasie anonimowej nazwę: `Main$1`, `Main$2`… — takie pliki `.class` zobaczysz w folderze kompilacji. Należy ona do **klas zagnieżdżonych** (nested classes) — szczegóły w artykule [Klasy zagnieżdżone](#/extra/nested-classes).

### Kiedy klasa anonimowa to zły pomysł

Jeśli implementacja jest duża (dziesiątki linii) albo potrzebna w kilku miejscach — wydziel ją do zwykłej klasy z nazwą: da się ją przetestować i użyć ponownie.

## Zadanie domowe

:::task video "Dyrektor i księgowy — z wideo"
Interfejs `Accountant` (w wideo — `counter`) z metodą, która przyjmuje liczbę miesięcy i zwraca raport jako napis. Klasa `Director` z metodą `force(Accountant accountant, int months)`: pobiera raport od księgowego i go wypisuje — np. „Raport za 6 miesięcy”. Zrealizuj wywołanie na dwa sposoby: przez obiekt nazwanej klasy implementującej interfejs oraz przez klasę anonimową. {{t j1 5:09:04}}
??? Podpowiedź
```java
public interface Accountant {
    String report(int months);
}
// klasa anonimowa:
director.force(new Accountant() {
    @Override
    public String report(int months) {
        return "Raport za " + months + " miesięcy";
    }
}, 6);
```
:::

:::task easy "Trzeci sposób"
Wykonaj poprzednie zadanie trzecim sposobem — lambdą: `director.force(months -> "Raport za " + months + " mies.", 6);`.
:::

:::task medium "Sortowanie anonimowym komparatorem"
Posortuj `List<String>` imion po długości, a potem alfabetycznie, przekazując do `list.sort(...)` anonimową klasę `Comparator<String>`. Następnie przepisz na lambdę i na `Comparator.comparing(String::length).thenComparing(...)`.
:::

:::task hard "Przycisk z nasłuchiwaczami"
Zamodeluj przycisk: klasa `Button` z metodą `addListener(ClickListener listener)` i `click()`, która wywołuje u wszystkich nasłuchiwaczy metodę `onClick(String buttonName)`. Dodaj trzech nasłuchiwaczy: klasą anonimową z licznikiem kliknięć (pole wewnątrz klasy anonimowej!), lambdą i nazwaną klasą `Logger`. Kliknij przycisk kilka razy i wyjaśnij, dlaczego licznika nie dało się zrobić w lambdzie przez zmienną lokalną.
:::
