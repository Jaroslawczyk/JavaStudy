Jak przejść po `Set`, skoro nie ma on `get(index)`? Pętlą **for-each** — a ona działa z każdym obiektem implementującym **`Iterable`**. Implementujemy iteratory dla wszystkich trzech naszych kolekcji i przechodzimy pierwszą mini-rozmowę rekrutacyjną o kolekcjach.

## Znaczniki czasu wideo

- {{t j1 8:17:46}} — jak wypisać wszystkie elementy `Set` bez `get`
- {{t j1 8:18:12}} — for-each po standardowych kolekcjach działa
- {{t j1 8:19:16}} — po naszej `CarList` — błąd kompilacji
- {{t j1 8:19:38}} — for-each korzysta z interfejsu `Iterable`
- {{t j1 8:20:25}} — `Collection` dziedziczy po `Iterable` — szczyt hierarchii
- {{t j1 8:20:43}} — `CarCollection extends Iterable<Car>`
- {{t j1 8:21:33}} — test pętli for-each
- {{t j1 8:22:41}} — metoda `iterator()` i obiekt `Iterator`
- {{t j1 8:23:02}} — metody `hasNext()` i `next()`
- {{t j1 8:23:18}} — w co rozwija się for-each
- {{t j1 8:24:16}} — iterator dla `CarArrayList`
- {{t j1 8:25:11}} — `index++` i `++index`
- {{t j1 8:26:29}} — iterator dla `CarLinkedList`
- {{t j1 8:28:07}} — iterator dla `CarHashSet` — trudniejszy
- {{t j1 8:32:04}} — `NullPointerException` i poprawka — testy ratują
- {{t j1 8:34:24}} — mini-rozmowa rekrutacyjna z przerobionego materiału

## for-each od środka

```java
for (Car car : cars) {
    System.out.println(car);
}
```

kompilator zamienia na:

```java
Iterator<Car> iterator = cars.iterator();
while (iterator.hasNext()) {
    Car car = iterator.next();
    System.out.println(car);
}
```

Dlatego for-each działa z tablicami i z każdą klasą implementującą `Iterable<T>` — interfejs z jedną metodą `Iterator<T> iterator()`.

```text
Iterable
 └─ Collection
     ├─ List  → ArrayList, LinkedList
     └─ Set   → HashSet, TreeSet, LinkedHashSet
```

## Iteratory naszych kolekcji

```java
// CarArrayList
@Override
public Iterator<Car> iterator() {
    return new Iterator<>() {
        private int index = 0;

        @Override
        public boolean hasNext() {
            return index < size;
        }

        @Override
        public Car next() {
            return array[index++];     // najpierw zwróć array[index], potem zwiększ
        }
    };
}
```

```java
// CarLinkedList
@Override
public Iterator<Car> iterator() {
    return new Iterator<>() {
        private Node node = first;

        @Override
        public boolean hasNext() {
            return node != null;
        }

        @Override
        public Car next() {
            Car car = node.value;
            node = node.next;
            return car;
        }
    };
}
```

```java
// CarHashSet: szukamy niepustego kubełka, potem idziemy po jego łańcuchu
@Override
public Iterator<Car> iterator() {
    return new Iterator<>() {
        private int index = 0;         // ile elementów już zwrócono
        private int arrayIndex = 0;    // bieżący kubełek
        private Entry entry;           // bieżący element łańcucha

        @Override
        public boolean hasNext() {
            return index < size;
        }

        @Override
        public Car next() {
            while (array[arrayIndex] == null) {
                arrayIndex++;
            }
            if (entry == null) {
                entry = array[arrayIndex];
            }
            Car result = entry.value;
            entry = entry.next;
            if (entry == null) {
                arrayIndex++;
            }
            index++;
            return result;
        }
    };
}
```

:::tip "Testy łapią błędy"
W wideo autor przez pomyłkę napisał warunek `!= null` zamiast `== null` w pętli szukania kubełka — test od razu padł z `NullPointerException`. Właśnie po to pisze się testy przed implementacją.
:::

## Czego nie ma w wideo

### Kontrakt Iterator

- `next()` przy braku elementów powinno rzucać `NoSuchElementException` — nasze wersje szkoleniowe tego nie robią; dodaj `if (!hasNext()) throw new NoSuchElementException();`.
- Jest opcjonalna metoda `remove()` — usuwa ostatni zwrócony element **w trakcie** przechodzenia. To jedyny bezpieczny sposób usuwania podczas iteracji:

```java
Iterator<Car> it = cars.iterator();
while (it.hasNext()) {
    if (it.next().getNumber() < 10) {
        it.remove();          // bezpiecznie
    }
}
```

### Fail-fast i ConcurrentModificationException

Iteratory kolekcji JDK są **fail-fast**: jeśli kolekcję zmieniono nie przez iterator w trakcie przechodzenia, kolejne `next()` rzuci `ConcurrentModificationException`. Wewnątrz kolekcja trzyma licznik zmian `modCount`, a iterator porównuje go ze swoją kopią.

### ListIterator

Listy mają `listIterator()` — chodzi w obie strony (`previous()`), potrafi `set` i `add` w bieżącej pozycji. Właśnie z nim wstawianie do `LinkedList` naprawdę jest O(1) (lekcja o `LinkedList`).

## Mini-rozmowa rekrutacyjna

:::interview "Pytania z wideo — z uściślonymi odpowiedziami"
1. **Hierarchia Collection Framework?** — `Iterable` → `Collection` → `List` (`ArrayList`, `LinkedList`), `Set` (`HashSet`, `LinkedHashSet`, `TreeSet`), `Queue`. Osobno — `Map`.
2. **Czym różnią się Set i List?** — Set nie przechowuje duplikatów i nie ma metod indeksowych.
3. **ArrayList vs LinkedList?** — Tablica kontra lista dwukierunkowa węzłów; szczegóły i poprawki w lekcji o `LinkedList`.
4. **Złożoność wstawiania bez indeksu?** — `ArrayList`, `LinkedList`, `HashSet` — O(1) (w `ArrayList` zamortyzowane).
5. **Wstawianie z indeksem?** — `ArrayList` O(n); `LinkedList` O(n) z uwzględnieniem szukania węzła (O(1) na początek/koniec); w `Set` niemożliwe.
6. **`contains`?** — `ArrayList` i `LinkedList` O(n); `HashSet` średnio O(1).
7. **Kiedy czego używać?** — `ArrayList` domyślnie; `HashSet` — gdy potrzebne są unikalne elementy, a kolejność nie ma znaczenia; `LinkedList` — rzadko (patrz jej lekcja).
8. **Jak zorganizowana jest pamięć? Czy GC usunie obiekty wskazujące na siebie?** — Stos/sterta; tak, jeśli są nieosiągalne od korzeni.
9. **Zasady equals/hashCode? Po co hashCode?** — Patrz lekcja o `equals`/`hashCode`; hash code wyznacza kubełek w tablicy haszującej.
10. **Co się stanie z HashSet, gdy nadpiszesz tylko equals?** — Duplikaty, `contains`/`remove` nie znajdują istniejących elementów.
:::

## Zadanie domowe

:::task video "Iteratory dla własnych kolekcji — z wideo"
Zaimplementuj `Iterable<Car>` we wszystkich trzech kolekcjach (`CarArrayList`, `CarLinkedList`, `CarHashSet`) i sprawdź testem, że for-each przechodzi dokładnie po 100 elementach. Dla `CarLinkedList` i `CarHashSet` autor proponuje najpierw spróbować samodzielnie. {{t j1 8:26:29}}
:::

:::task easy "NoSuchElementException"
Dodaj we wszystkich trzech iteratorach sprawdzenie `hasNext()` w `next()` z rzuceniem `NoSuchElementException` oraz test tego zachowania.
:::

:::task medium "Iterator.remove()"
Zaimplementuj metodę `remove()` w iteratorze `CarArrayList`: usuwa ostatni element zwrócony przez `next()` i poprawnie przesuwa wewnętrzny indeks. Ponowne `remove()` bez `next()` powinno rzucać `IllegalStateException`.
:::

:::task hard "Fail-fast"
Dodaj do `CarArrayList` licznik `modCount`, zwiększany przy każdej zmianie strukturalnej (`add`, `remove`, `clear`). Iterator zapamiętuje go przy tworzeniu i w `next()` rzuca `ConcurrentModificationException`, jeśli wartości się rozjechały. Napisz test: usuwanie z listy wewnątrz for-each ma padać, a przez `iterator.remove()` — działać.
:::
