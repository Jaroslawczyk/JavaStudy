Klasę można zadeklarować wewnątrz innej klasy. W kursie pojawiały się zagnieżdżone `Node` i `Entry` we własnych kolekcjach oraz klasy anonimowe dla `Runnable`. Omówmy wszystkie cztery rodzaje klas zagnieżdżonych, różnice między nimi i typowy wyciek pamięci.

## Cztery rodzaje

| Rodzaj | Deklaracja | Dostęp do pól obiektu zewnętrznego | Przykład |
|---|---|---|---|
| Statyczna zagnieżdżona | `static class Node` wewnątrz klasy | ❌ tylko przez referencję | `Map.Entry`, `Node` w `LinkedList` |
| Wewnętrzna (inner) | `class Node` bez `static` | ✅ bezpośrednio | iterator kolekcji |
| Lokalna | klasa wewnątrz metody | ✅ + zmienne lokalne effectively final | rzadko |
| Anonimowa | `new Interface() { … }` | ✅ + zmienne lokalne effectively final | obsługa zdarzeń, `Comparator` przed Javą 8 |

## Statyczna klasa zagnieżdżona

```java
public class LinkedList<T> {
    private Node<T> first;

    private static class Node<E> {       // niezwiązana z konkretną LinkedList
        E value;
        Node<E> next;
    }
}

Outer.Nested n = new Outer.Nested();     // tworzona bez egzemplarza Outer
```

Logicznie zgrupowana z klasą zewnętrzną i widzi jej składowe `private`, ale obiekt klasy zewnętrznej nie jest jej potrzebny. **Wybór domyślny.**

## Klasa wewnętrzna

```java
public class MyList<T> implements Iterable<T> {
    private Object[] items;
    private int size;

    @Override
    public Iterator<T> iterator() {
        return new Itr();
    }

    private class Itr implements Iterator<T> {      // widzi items i size obiektu zewnętrznego
        private int cursor;
        public boolean hasNext() { return cursor < size; }
        @SuppressWarnings("unchecked")
        public T next() { return (T) items[cursor++]; }
    }
}

MyList<String>.Itr it = list.new Itr();             // z zewnątrz — przez egzemplarz (rzadko)
```

Każdy obiekt klasy wewnętrznej trzyma **ukrytą referencję** `Outer.this`.

:::warning "Wyciek pamięci przez klasę wewnętrzną"
Jeśli obiekt klasy wewnętrznej (lub anonimowej) żyje dłużej niż zewnętrzny — np. zarejestrowano go jako słuchacza w długo żyjącym serwisie albo włożono do statycznego cache — nie pozwala garbage collectorowi usunąć obiektu zewnętrznego ze wszystkimi jego danymi. Klasyka Androida: anonimowy `Handler` trzyma `Activity`. Zasada: jeśli dostęp do obiektu zewnętrznego nie jest potrzebny — rób klasę `static`.
:::

## Klasy lokalne i anonimowe

```java
void sortByLength(List<String> words) {
    words.sort(new Comparator<String>() {               // klasa anonimowa
        @Override
        public int compare(String a, String b) {
            return Integer.compare(a.length(), b.length());
        }
    });
    words.sort(Comparator.comparingInt(String::length)); // dziś — lambda/referencja
}
```

Klasa anonimowa przydaje się, gdy trzeba zaimplementować interfejs z **kilkoma** metodami albo odziedziczyć po klasie abstrakcyjnej „w miejscu”. Dla interfejsów funkcyjnych używaj lambd.

:::note "Typy zagnieżdżone są niejawnie static"
Zagnieżdżone `enum`, `record` i `interface` są zawsze niejawnie statyczne. Od Javy 16 składowe statyczne (w tym rekordy) można deklarować także w klasach wewnętrznych.
:::

:::interview "Pytania rekrutacyjne"
**Czym statyczna klasa zagnieżdżona różni się od wewnętrznej?** — Wewnętrzna trzyma referencję do egzemplarza klasy zewnętrznej i może bezpośrednio sięgać do jego pól; tworzy się ją tylko przez egzemplarz zewnętrzny. Statyczna nie jest związana z egzemplarzem.

**Dlaczego klasa anonimowa widzi tylko zmienne effectively final?** — Wartości są kopiowane do obiektu klasy przy tworzeniu; gdyby zmienną można było zmieniać, kopia i oryginał by się rozjechały.
:::

## Zadanie domowe

:::task easy "Builder jako statyczna klasa zagnieżdżona"
Utwórz klasę `Pizza` z prywatnym konstruktorem i statyczną zagnieżdżoną `Pizza.Builder` (rozmiar, ciasto, lista dodatków). Użycie: `new Pizza.Builder().size(30).topping("ser").build()`.
:::

:::task medium "Własny iterator"
Zaimplementuj `Range implements Iterable<Integer>` (od `from` do `to` z krokiem `step`) z iteratorem jako klasą wewnętrzną. Potem przepisz iterator jako klasę anonimową i jako statyczną zagnieżdżoną (przekazując potrzebne dane przez konstruktor). Porównaj, który wariant jest krótszy, a który bezpieczniejszy.
:::

:::task hard "Znajdź wyciek"
Napisz `EventBus` ze statyczną listą słuchaczy i klasę `Screen` z polem `byte[] data = new byte[10_000_000]`, która rejestruje anonimowego słuchacza. Utwórz i „zapomnij” 100 ekranów w pętli — dostaniesz `OutOfMemoryError` przy `-Xmx256m`. Znajdź przyczynę w zrzucie sterty (VisualVM/IntelliJ) i napraw: klasa statyczna + `WeakReference` albo jawne wypisanie się.
:::
