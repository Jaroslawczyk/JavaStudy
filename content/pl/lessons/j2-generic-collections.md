Stosujemy generyki w praktyce: robimy **generyczne** własne kolekcje z części 1 (`CarList`, `CarSet`, `CarMap`…). Po drodze natrafiamy na ograniczenia generyków — nie można napisać `new T[]`, nie można użyć `T` w statycznej klasie zagnieżdżonej — i uczymy się je obchodzić.

## Znaczniki czasu wideo

- {{t j2 16:46}} — robimy nasze kolekcje generycznymi
- {{t j2 18:56}} — `CarCollection<T> extends Iterable<T>`, `CarList<T>`
- {{t j2 20:24}} — nie można utworzyć tablicy typu `T`: używamy `Object[]` i rzutowania
- {{t j2 24:12}} — statyczna zagnieżdżona `Node` nie widzi `T` → usuwamy `static`
- {{t j2 25:41}} — `CarHashMap<K, V>`: `Entry` i tablica `Object[]`
- {{t j2 29:38}} — podsumowanie: trzy ograniczenia generyków

## Z kolekcji „samochodowych” — w uniwersalne

W części 1 pisaliśmy `CarArrayList`, `CarLinkedList`, `CarHashSet`, `CarHashMap` — potrafiły przechowywać tylko `Car`. Zamieniamy `Car` na parametr — i mamy kolekcje dla dowolnych typów:

```java
public interface CarCollection<T> extends Iterable<T> {
    boolean add(T item);
    boolean remove(T item);
    boolean contains(T item);
    int size();
    void clear();
}

public interface CarList<T> extends CarCollection<T> {
    T get(int index);
    boolean add(T item, int index);
    boolean removeAt(int index);
}
```

`Iterable<T>` też jest sparametryzowany: dzięki temu `for (T item : list)` zwraca elementy właściwego typu bez rzutowań.

## Ograniczenie 1: nie można `new T[]`

```java
public class CarArrayList<T> implements CarList<T> {
    // private T[] array = new T[10];     ❌ generic array creation
    private Object[] array = new Object[10];
    private int size;

    @Override
    @SuppressWarnings("unchecked")
    public T get(int index) {
        checkIndex(index);
        return (T) array[index];          // bezpieczne: wkładamy tam tylko T
    }
}
```

Tak samo działa prawdziwy `java.util.ArrayList` — w środku ma `Object[] elementData`. Rzutowanie `(T)` daje ostrzeżenie `unchecked`; jeśli masz pewność, że jest poprawne (do tablicy trafia tylko `T` przez `add`), wycisz je adnotacją `@SuppressWarnings("unchecked")` na **najmniejszym** obszarze — na metodzie, nie na klasie.

Alternatywy:
- `T[] arr = (T[]) new Object[n];` — działa wewnątrz klasy, ale **nie wolno oddawać takiej tablicy na zewnątrz** (tam będzie `ClassCastException`).
- `T[] arr = (T[]) Array.newInstance(clazz, n);` — prawdziwa tablica właściwego typu, jeśli przekażesz `Class<T> clazz` do konstruktora.

## Ograniczenie 2: statyczna klasa zagnieżdżona nie widzi `T`

```java
public class CarLinkedList<T> implements CarList<T> {
    private Node first, last;

    private class Node {              // bez static: używa T klasy zewnętrznej
        private Node previous;
        private T value;
        private Node next;
    }
}
```

W wideo po prostu usuwa się `static`. Minus: każdy `Node` trzyma ukrytą referencję do obiektu zewnętrznego (dodatkowe bajty na każdy element). **Lepszy wariant** — zostawić klasę statyczną i dać jej własny parametr, jak w JDK:

```java
private static class Node<E> {
    E value;
    Node<E> previous, next;
}
private Node<T> first, last;
```

O rodzajach klas zagnieżdżonych — w artykule [Klasy zagnieżdżone](#/extra/nested-classes).

## Ograniczenie 3: `T` to zawsze typ referencyjny

`CarArrayList<int>` się nie skompiluje — tylko `CarArrayList<Integer>`. Typy proste są automatycznie opakowywane (autoboxing), co kosztuje pamięć.

## Map z dwoma parametrami

```java
public interface CarMap<K, V> {
    void put(K key, V value);
    V get(K key);
    Set<K> keySet();
    List<V> values();
    boolean remove(K key);
    int size();
    void clear();
}

public class CarHashMap<K, V> implements CarMap<K, V> {
    private Object[] array = new Object[16];   // tablica Entry, ale bez new Entry[16]

    private class Entry {
        private K key;
        private V value;
        private Entry next;
    }
}
```

:::interview "Pytanie rekrutacyjne"
**Dlaczego nie można utworzyć tablicy typu generycznego?** — Tablice są kowariantne i sprawdzają typ elementów w czasie działania (`ArrayStoreException`), a generyki są wymazywane i takiej informacji nie mają. Gdyby `new List<String>[10]` było dozwolone, można by przez `Object[]` włożyć tam `List<Integer>` bez żadnego błędu — system typów by się załamał.
:::

## Czego nie ma w wideo

- **`Iterator<T>` własnej kolekcji.** Żeby działał for-each, metoda `iterator()` musi zwracać `Iterator<T>` — klasę anonimową lub zagnieżdżoną z polem-indeksem (zob. lekcję [Iterator](#/lessons/j1-iterator)).
- **Testy też trzeba sparametryzować.** `CarList<Car> list = new CarArrayList<>();` — i wszystkie stare testy z części 1 nadal działają.
- **Interfejsy JDK.** W praktyce własne kolekcje pisze się rzadko: można zaimplementować `java.util.List<T>` przez `AbstractList<T>` — wystarczą `get` i `size`, resztę da JDK.

## Zadanie domowe

:::task video "Sparametryzuj wszystkie kolekcje — z wideo"
Powtórz za autorem: zrób generycznymi `CarCollection`, `CarList`, `CarSet`, `CarQueue`, `CarMap` i wszystkie ich implementacje, a potem uruchom testy z części 1. {{t j2 16:46}}
??? Podpowiedź
Zamieniaj `Car` na `T` od góry: najpierw interfejsy, potem implementacje, potem testy. Dla `Node`/`Entry` usuń `static` albo daj im własny parametr. Omówienie: {{t j2 18:56}}
:::

:::task easy "Generyczny stos"
Napisz `MyStack<T>` na bazie `Object[]` z metodami `push`, `pop`, `peek`, `isEmpty` i automatycznym powiększaniem tablicy. Obsłuż `pop` z pustego stosu (rzuć `NoSuchElementException`).
:::

:::task medium "Tablica właściwego typu"
Dodaj do `CarArrayList<T>` metodę `T[] toArray(Class<T> type)`, która zwraca **prawdziwą** tablicę `T[]` (przez `Array.newInstance`). Pokaż, że wariant z `(T[]) new Object[size]` przy przypisaniu do `String[]` na zewnątrz wywraca się z `ClassCastException`, a twój — nie.
:::

:::task hard "Własna List na bazie AbstractList"
Zaimplementuj niezmienny `Range extends AbstractList<Integer>` — liczby od `from` do `to`, bez przechowywania ich w pamięci. Sprawdź, że działają `contains`, `indexOf`, `subList`, for-each i `stream()`, choć napisałeś tylko `get` i `size`.
:::
