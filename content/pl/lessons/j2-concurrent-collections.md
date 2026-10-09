Zwykłe kolekcje (`ArrayList`, `HashMap`) **nie są bezpieczne wątkowo**: jeśli dwa wątki jednocześnie dodają elementy, część danych ginie. Omawiamy trzy rozwiązania: ręczną synchronizację, opakowania `Collections.synchronized…` i specjalne kolekcje z `java.util.concurrent`.

## Znaczniki czasu wideo

- {{t j2 3:23:33}} — kolekcje i wielowątkowość
- {{t j2 3:24:02}} — dwa wątki dodają po 100 elementów do `ArrayList`
- {{t j2 3:26:16}} — w liście 131 elementów zamiast 200
- {{t j2 3:26:24}} — rozwiązanie 1: blok `synchronized` wokół `add`
- {{t j2 3:27:16}} — rozwiązanie 2: `Collections.synchronizedList(…)`
- {{t j2 3:28:41}} — minus: jeden monitor na całą kolekcję
- {{t j2 3:29:28}} — rozwiązanie 3: `CopyOnWriteArrayList`, `CopyOnWriteArraySet`
- {{t j2 3:30:08}} — `ConcurrentHashMap`
- {{t j2 3:30:46}} — podsumowanie lekcji

## Problem

```java
List<Integer> numbers = new ArrayList<>();
Runnable add100 = () -> { for (int i = 0; i < 100; i++) { sleep(1); numbers.add(i); } };
// dwa wątki → size() = 131, czasem ArrayIndexOutOfBoundsException
```

`add` wewnątrz `ArrayList` to „zapisz do `elementData[size]`, zwiększ `size`”: dwa wątki piszą do jednej komórki, zwiększenie ginie, przy powiększaniu tablicy możliwy jest wyjątek.

## Rozwiązanie 1: ręczna synchronizacja

```java
synchronized (monitor) { numbers.add(i); }
```

Działa, ale o monitorze trzeba pamiętać przy **każdym** dostępie — także przy odczycie i przechodzeniu.

## Rozwiązanie 2: opakowania synchronizowane

```java
List<Integer> numbers = Collections.synchronizedList(new ArrayList<>());
Map<String, Integer> map = Collections.synchronizedMap(new HashMap<>());
Set<String> set = Collections.synchronizedSet(new HashSet<>());
```

Każda metoda opakowania jest `synchronized` na jednym monitorze. Prosto, ale wolno: nawet dwóch czytelników czeka na siebie.

:::warning "Przechodzenie po kolekcji synchronizowanej"
Iteracja to wiele wywołań, a opakowanie ich nie chroni. Przechodzenie trzeba synchronizować ręcznie na samej kolekcji, inaczej możliwy jest `ConcurrentModificationException`:

```java
synchronized (numbers) {
    for (Integer n : numbers) System.out.println(n);
}
```
:::

## Rozwiązanie 3: kolekcje java.util.concurrent

| Interfejs | Implementacja bezpieczna wątkowo | Kiedy |
|---|---|---|
| `List` | `CopyOnWriteArrayList` | Dużo odczytów, mało zapisów (listy słuchaczy, konfiguracje) |
| `Set` | `CopyOnWriteArraySet`, `ConcurrentHashMap.newKeySet()` | To samo / przypadek ogólny |
| `Map` | `ConcurrentHashMap` | Główny wybór dla wspólnych map |
| `SortedMap` | `ConcurrentSkipListMap` | Potrzebne sortowanie kluczy |
| `Queue` | `ConcurrentLinkedQueue`, `BlockingQueue` | Kolejki zadań |

### Copy-on-write

Przy każdym zapisie tworzona jest **kopia** wewnętrznej tablicy, nowe dane trafiają do kopii, potem referencja jest podmieniana. Czytelnicy nigdy nie są blokowani i przechodzą po „migawce” — `ConcurrentModificationException` się nie zdarza. Cena — zapis O(n): na często zmienianych kolekcjach to bardzo wolne.

### ConcurrentHashMap

Różne wątki mogą jednocześnie pracować z różnymi kubełkami tablicy — blokady nie są globalne. Odczyt w ogóle nie blokuje.

:::outdated "Jak działa ConcurrentHashMap dziś"
Często opowiada się o „segmentach” (16 części tablicy z własnymi blokadami) — tak było **przed Javą 8**. Od Javy 8 `ConcurrentHashMap` używa CAS dla pustych kubełków i `synchronized` na pierwszym węźle kubełka przy kolizji; długie łańcuchy, jak w `HashMap`, zamieniają się w drzewa. Na rozmowie warto znać obie wersje.
:::

:::tip "Atomowe operacje ConcurrentHashMap"
Zamiast „sprawdź-potem-włóż” (wyścig!) używaj metod atomowych:

```java
map.putIfAbsent("a", 1);
map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
map.merge(word, 1, Integer::sum);          // licznik słów
```
Jeszcze jedna różnica względem `HashMap`: klucze i wartości nie mogą być `null`.
:::

:::interview "Pytania rekrutacyjne"
**Co wiesz o kolekcjach synchronizowanych?** — Zwykłe kolekcje nie są bezpieczne wątkowo. `Collections.synchronizedList/Set/Map` je opakowują, synchronizując każdą metodę na jednym monitorze (wolno, przechodzenie trzeba synchronizować ręcznie). Pakiet `java.util.concurrent` daje zoptymalizowane: `ConcurrentHashMap`, `CopyOnWriteArrayList/Set`, `ConcurrentLinkedQueue`, `BlockingQueue`.

**`Hashtable` vs `ConcurrentHashMap`?** — `Hashtable` to przestarzała klasa, wszystkie metody `synchronized` na jednym monitorze. `ConcurrentHashMap` blokuje tylko pojedyncze kubełki, odczyty bez blokad.
:::

## Czego nie ma w wideo

- **Kolekcje niezmienne** (`List.of`, `Map.copyOf`, `Collections.unmodifiableList`) są bezpieczne do odczytu z dowolnych wątków bez żadnej synchronizacji — o ile nie zmienia ich pierwotny właściciel.
- **`Vector` i `Hashtable`** — dziedzictwo Javy 1.0, wszystkie metody synchronizowane. W nowym kodzie nie są używane.
- **Słabo spójne iteratory** kolekcji współbieżnych nie rzucają `ConcurrentModificationException`, ale mogą nie zobaczyć zmian zrobionych w trakcie przechodzenia.

## Zadanie domowe

W wideo nie ma zadania — oto własne.

:::task easy "Zgubione elementy"
Powtórz eksperyment z wideo z `ArrayList`, `Collections.synchronizedList` i `CopyOnWriteArrayList`: 4 wątki po 10 000 dodań. Porównaj rozmiar i czas.
:::

:::task medium "Słownik częstości"
Wczytaj duży tekst, podziel na 4 części i policz częstość słów w 4 wątkach do jednej wspólnej `ConcurrentHashMap<String, Integer>` przez `merge`. Porównaj wynik z wersją jednowątkową — musi się zgadzać. Następnie spróbuj `get` + `put` zamiast `merge` i znajdź rozbieżności.
:::

:::task medium "CopyOnWrite i iterator"
Przechodź po `CopyOnWriteArrayList` w jednym wątku, jednocześnie dodając elementy z innego. Pokaż, że wyjątku nie ma, a iterator widzi „migawkę”. Powtórz z `ArrayList` — dostaniesz `ConcurrentModificationException`.
:::

:::task hard "Cache z jednorazowym obliczeniem"
Napisz `Memoizer<K, V>` z metodą `V get(K key)`, która oblicza wartość kosztowną funkcją **dokładnie raz** na klucz, nawet jeśli 100 wątków jednocześnie zażąda tego samego klucza. Użyj `ConcurrentHashMap.computeIfAbsent`. Zastanów się, dlaczego wewnątrz funkcji nie wolno odwoływać się do tej samej mapy.
:::
