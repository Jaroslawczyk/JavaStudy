Parametr typu można zadeklarować nie tylko w klasie, ale i w pojedynczej **metodzie**. Razem z `? extends` i `? super` daje to elastyczne API w rodzaju `Collections.copy(dest, src)`. Na koniec — duże zadanie domowe z koszami owoców i pytania rekrutacyjne o generyki.

## Znaczniki czasu wideo

- {{t j2 44:22}} — metody generyczne: `<U> U getFirstElement(List<U> list)`
- {{t j2 47:10}} — zadanie: metoda `transfer` przekłada elementy z jednej kolekcji do drugiej
- {{t j2 47:30}} — omówienie: statyczna metoda generyczna
- {{t j2 49:43}} — `List<Number>` może przechowywać i `Integer`, i `Double`
- {{t j2 52:44}} — `List<? extends U> src, List<? super U> dst`
- {{t j2 53:31}} — zadanie domowe: owoce i kosze
- {{t j2 55:38}} — omówienie: `Fruit`, `Apple`, `Orange`, `Basket<T extends Fruit>`
- {{t j2 58:22}} — zaleta ograniczenia: `T` ma `getWeight()`
- {{t j2 59:07}} — porównanie koszy przez `Basket<?>`
- {{t j2 1:00:05}} — statyczny `transfer` z `? extends U` i `? super U`
- {{t j2 1:01:43}} — pytania rekrutacyjne o generyki

## Metoda generyczna

```java
public static <U> U getFirstElement(List<U> list) {
    return list.get(0);
}

String s  = getFirstElement(List.of("a", "b"));   // U = String (wywnioskowane)
Integer i = getFirstElement(List.of(1, 2));      // U = Integer
```

- Deklaracja `<U>` stoi **przed typem zwracanym**.
- Typ wnioskuje kompilator z argumentów (type inference). Jawnie: `Main.<String>getFirstElement(list)`.
- Parametr metody jest niezależny od parametru klasy i działa nawet w metodach `static`.

## Przekładamy z jednej kolekcji do drugiej

Pierwsza próba — obie listy tego samego typu:

```java
static <U> void transfer(List<U> src, List<U> dst) {
    dst.addAll(src);
    src.clear();
}
List<Integer> ints = new ArrayList<>(List.of(1, 2));
List<Number> nums = new ArrayList<>();
transfer(ints, nums);        // ❌ U nie może być jednocześnie Integer i Number
```

Choć włożenie `Integer` do `List<Number>` jest logicznie w porządku. Poprawna sygnatura:

```java
static <U> void transfer(List<? extends U> src, List<? super U> dst) {
    dst.addAll(src);
    src.clear();
}
transfer(ints, nums);        // ✅ U = Integer: src — Integer, dst — „Integer lub wyżej”
```

## PECS: Producer Extends, Consumer Super

Reguła Joshuy Blocha (Effective Java):

- kolekcja **oddaje** ci elementy (producer, czytasz z niej) → `? extends T`;
- kolekcja **przyjmuje** elementy (consumer, piszesz do niej) → `? super T`;
- i czytasz, i piszesz → po prostu `T`.

Tak zadeklarowano metody JDK: `Collections.copy(List<? super T> dest, List<? extends T> src)`, `Collection.addAll(Collection<? extends E> c)`, `List.sort(Comparator<? super E> c)`.

## Omówienie zadania z owocami

```java
public abstract class Fruit {
    public abstract float getWeight();
}
public class Apple extends Fruit {
    @Override public float getWeight() { return 1.0f; }
}
public class Orange extends Fruit {
    @Override public float getWeight() { return 1.5f; }
}

public class Basket<T extends Fruit> {
    private final List<T> fruits = new ArrayList<>();

    public void add(T fruit) { fruits.add(fruit); }

    public float getWeight() {
        float result = 0;
        for (T fruit : fruits) {
            result += fruit.getWeight();      // dostępne dzięki T extends Fruit
        }
        return result;
    }

    public int compare(Basket<?> another) {   // dowolny kosz
        return Float.compare(getWeight(), another.getWeight());
    }

    public static <U extends Fruit> void transfer(Basket<? extends U> src, Basket<? super U> dst) {
        dst.fruits.addAll(src.fruits);
        src.fruits.clear();
    }
}
```

Teraz jabłka można przełożyć do `Basket<Apple>` lub `Basket<Fruit>`, ale nie do `Basket<Orange>` — sprawdzi to kompilator.

:::tip "Float.compare zamiast łańcucha if"
W wideo `compare` najpierw pisze się przez `if/else` zwracające `1/0/-1`, a potem IDEA proponuje `Float.compare(a, b)` ({{t j2 59:54}}). Używaj gotowych `Integer.compare`, `Double.compare`, `Comparator.comparing…` — nie odejmuj liczb (`a - b` przepełnia się dla `int` i jest niedokładne dla `float`).
:::

## Pytania rekrutacyjne

:::interview "Czym są generyki?"
Typami parametryzowanymi: pozwalają deklarować klasy, interfejsy i metody, w których typ danych jest parametrem. Dają kontrolę typów w czasie kompilacji i usuwają ręczne rzutowania. {{t j2 1:01:51}}
:::

:::interview "Do czego służą extends i super w generykach?"
Do ograniczania dopuszczalnych typów. `extends` — sama klasa lub jej podklasa (górne ograniczenie), `super` — sama klasa lub jej nadklasa (dolne ograniczenie, tylko przy wildcard). W praktyce — reguła PECS. {{t j2 1:02:01}}
:::

:::interview "Czym jest wildcard?"
Maską `?` w nawiasach kątowych: „jakiś nieznany typ”. Można ją ograniczyć przez `? extends T` lub `? super T`. {{t j2 1:02:28}}
:::

:::interview "Metoda przyjmuje List<Number>. Czy można przekazać List<Integer>?"
Nie — generyki są inwariantne. Żeby przyjmować dowolne liczby, metoda musi przyjmować `List<? extends Number>`. {{t j2 1:02:46}}
:::

## Czego nie ma w wideo

- **Konstruktory generyczne** też istnieją: `<S> Box(S source, Function<S, T> mapper)`.
- **Przechwytywanie wildcard (wildcard capture).** Do `List<?>` nie można włożyć elementu, nawet wziętego z niej samej. Obchodzi się to prywatną metodą pomocniczą `<T> void swapHelper(List<T> list, int i, int j)` — tak zaimplementowano `Collections.swap`.
- **Metoda generyczna z kilkoma ograniczeniami:** `static <T extends Comparable<T> & Serializable> T pick(T a, T b)`.

## Zadanie domowe

:::task video "Owoce i kosze — z wideo"
Abstrakcyjny `Fruit` z `getWeight()`, `Apple` (1.0) i `Orange` (1.5). Klasa `Basket<T extends Fruit>`: dodawanie owocu, waga kosza, porównanie z **dowolnym** koszem (`Basket<?>`), przełożenie wszystkich owoców do kosza tego samego typu lub typu-rodzica (potem źródłowy jest pusty). Napisz testy. {{t j2 53:31}}
??? Podpowiedź
`static <U extends Fruit> void transfer(Basket<? extends U> src, Basket<? super U> dst)`. Omówienie: {{t j2 55:38}}
:::

:::task easy "Generyczny swap"
Napisz `static <T> void swap(T[] array, int i, int j)` i `static <T> void swap(List<T> list, int i, int j)`. Sprawdź na tablicy napisów i liście liczb.
:::

:::task medium "Kopiowanie według PECS"
Bez `Collections.copy` napisz `static <T> void copy(List<? super T> dst, List<? extends T> src)`. Pokaż, że można skopiować `List<Integer>` do `List<Number>` i do `List<Object>`, ale nie odwrotnie.
:::

:::task hard "Generyczny filtr i mapper"
Bez Stream API napisz `static <T> List<T> filter(Collection<? extends T> c, Predicate<? super T> p)` i `static <T, R> List<R> map(Collection<? extends T> c, Function<? super T, ? extends R> f)`. Wyjaśnij każdy wildcard. Sprawdź: przefiltruj `List<Integer>` predykatem `Predicate<Number>` (`n -> n.doubleValue() > 0`).
??? Podpowiedź
Predykat „konsumuje” elementy (`? super T`), funkcja „konsumuje” `T` i „produkuje” `R` (`? extends R`). To dokładnie sygnatury z `java.util.stream.Stream`.
:::
