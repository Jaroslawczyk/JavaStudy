Kończymy kolekcje: trzy rodzaje `Set` i `Map` o różnej kolejności elementów, podchwytliwe pytanie „jak zgubić element w `HashMap`” oraz interfejs **`Queue`** — kolejki według zasad FIFO i LIFO.

## Znaczniki czasu wideo

- {{t j1 9:33:24}} — jeszcze kilka kolekcji, które trzeba znać
- {{t j1 9:34:06}} — `HashSet`/`TreeSet`/`LinkedHashSet` i `HashMap`/`TreeMap`/`LinkedHashMap`
- {{t j1 9:35:04}} — `Linked…`: kolejność dodania dzięki powiązaniom między elementami
- {{t j1 9:35:42}} — pytanie rekrutacyjne: związek `HashMap`, `equals` i `hashCode`
- {{t j1 9:36:03}} — eksperyment: zmieniamy `id` klucza po `put`
- {{t j1 9:38:06}} — `NullPointerException`: `get` zwróciło `null`
- {{t j1 9:39:07}} — dlaczego: zmienił się hash code klucza
- {{t j1 9:39:51}} — jak zgubić element w `Map`
- {{t j1 9:40:34}} — podsumowanie: którą kolekcję wybrać
- {{t j1 9:41:12}} — hierarchia kolekcji i interfejs `Queue`
- {{t j1 9:41:45}} — LIFO: stos talerzy
- {{t j1 9:42:46}} — klasa `Stack` jest przestarzała
- {{t j1 9:42:53}} — FIFO: kolejka w sklepie
- {{t j1 9:43:24}} — metody kolejki: `add`, `peek`, `poll`
- {{t j1 9:44:13}} — `LinkedList` implementuje i `List`, i `Queue`
- {{t j1 9:44:29}} — interfejs `CarQueue`, testy i implementacja

## Kolejność elementów: Hash, Linked, Tree

| Kolekcja | Kolejność | Złożoność głównych operacji |
|---|---|---|
| `HashSet` / `HashMap` | **Żadna** (może się zmieniać przy wzroście) | O(1) |
| `LinkedHashSet` / `LinkedHashMap` | **Kolejność dodania** | O(1) |
| `TreeSet` / `TreeMap` | **Posortowane** (elementy / klucze) | O(log n) |

Wersje `Linked…` działają jak `Hash…`, ale każdy element jest dodatkowo powiązany z poprzednio i następnie dodanym — jak w `LinkedList`. Dlatego przy przechodzeniu kolejność jest zachowana. Dla `Tree…` elementy (klucze) muszą implementować `Comparable` albo potrzebny jest `Comparator`.

## Jak zgubić element w HashMap

```java
Map<CarOwner, Car> map = new HashMap<>();
CarOwner key = new CarOwner(1, "Iwan", "Iwanow");
map.put(key, new Car("Brand1", 1));

key.setId(8);                     // zmieniamy pole, od którego zależy hashCode!

Car car = map.get(key);           // null — HashMap szuka w innym kubełku
System.out.println(car.getBrand()); // NullPointerException
```

Obiekt-klucz jest w `Map` (`keySet()` go pokaże, już z `id = 8`), ale nie da się go znaleźć: przy `put` kubełek wybrano według starego hash code'u, a `get` liczy nowy.

:::interview "Pytanie rekrutacyjne"
**W jakiej sytuacji element może zgubić się w HashMap?** — Gdy kluczem jest obiekt zmienny i po `put` zmieniono w nim pole uczestniczące w `hashCode`. Wniosek: klucze powinny być **niezmienne** — `String`, `Integer`, `record`, klasy z polami `final`.
:::

## Kolejki: FIFO i LIFO

- **LIFO** (Last In, First Out) — „ostatni przyszedł, pierwszy wyszedł”: stos talerzy. Struktura — **stos**.
- **FIFO** (First In, First Out) — „pierwszy przyszedł, pierwszy obsłużony”: kolejka do kasy. Struktura — **kolejka**.

```java
Queue<String> queue = new ArrayDeque<>();
queue.offer("Anna");          // na koniec
queue.offer("Borys");
queue.peek();                 // "Anna" — podejrzyj pierwszego bez usuwania
queue.poll();                 // "Anna" — zabierz pierwszego

Deque<String> stack = new ArrayDeque<>();
stack.push("talerz 1");
stack.push("talerz 2");
stack.pop();                  // "talerz 2" — ostatni, który przyszedł
```

### Metody Queue: dwie wersje

| Działanie | Rzuca wyjątek | Zwraca wartość specjalną |
|---|---|---|
| Dodaj na koniec | `add(e)` | `offer(e)` → `false` |
| Weź i usuń pierwszy | `remove()` | `poll()` → `null` |
| Podejrzyj pierwszy | `element()` | `peek()` → `null` |

W wideo implementowana jest `CarQueue` z metodami `add`, `peek`, `poll` na bazie `CarLinkedList`: usuwanie z początku listy wiązanej to O(1), a z początku `ArrayList` — O(n). Dlatego w JDK `LinkedList` implementuje i `List`, i `Queue` (dokładniej — `Deque`).

:::outdated "Stack jest przestarzały — używaj ArrayDeque"
Autor wspomina, że klasa `Stack` jest przestarzała. Dziedziczy po zsynchronizowanym `Vector` i jest wolna. Do stosu i kolejki używa się dziś **`ArrayDeque`** — jest szybsza i od `Stack`, i od `LinkedList` (bufor cykliczny na tablicy, bez węzłów). `LinkedList` jako kolejka przydaje się tylko wtedy, gdy potrzebne są elementy `null` lub metody `List`.
:::

## Czego nie ma w wideo

- **`PriorityQueue`** — kolejka priorytetowa (kopiec binarny): `poll()` zawsze oddaje najmniejszy element według `Comparator`. `offer`/`poll` — O(log n).
- **`BlockingQueue`** (`ArrayBlockingQueue`, `LinkedBlockingQueue`) — kolejki bezpieczne wątkowo dla schematu „producent — konsument” (część 2 kursu).
- **`LinkedHashMap` jako cache LRU**: konstruktor z `accessOrder = true` i nadpisane `removeEldestEntry` — klasyczne zadanie rekrutacyjne.
- **Java 21 — Sequenced Collections**: `LinkedHashSet`, `LinkedHashMap`, `List`, `Deque`, `TreeSet` dostały wspólne metody `getFirst()`, `getLast()`, `reversed()`, `putFirst()`…

## Zadanie domowe

W wideo nie ma zadań — sprawdźmy zrozumienie w praktyce.

:::task easy "Trzy Set — trzy kolejności"
Dodaj te same 10 słów do `HashSet`, `LinkedHashSet` i `TreeSet` i wypisz wszystkie trzy. Wyjaśnij różnicę w kolejności.
:::

:::task medium "Zgubiony klucz"
Odtwórz eksperyment z wideo: zmienny klucz, `put`, zmiana pola, `get`. Następnie zrób `CarOwner` niezmiennym (pola `final`, bez setterów, lub `record`) i pokaż, że problem zniknął.
:::

:::task medium "Sprawdzanie nawiasów"
Za pomocą `ArrayDeque` jako stosu napisz metodę `boolean isBalanced(String s)`, sprawdzającą, czy nawiasy `()[]{}` w napisie są poprawnie rozmieszczone: `"{[()]}"` → `true`, `"([)]"` → `false`. Klasyczne zadanie rekrutacyjne.
:::

:::task hard "Cache LRU"
Zaimplementuj klasę `LruCache<K, V>` o pojemności `n` na bazie `LinkedHashMap` z `accessOrder = true`: przy dodaniu ponad pojemność usuwany jest element, do którego najdłużej się nie odwoływano. Pokryj testami. Następnie zaimplementuj to samo bez `LinkedHashMap` — na `HashMap` + własnej liście dwukierunkowej (jak w lekcji o `LinkedList`).
??? Podpowiedź
```java
class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    LruCache(int capacity) {
        super(16, 0.75f, true);    // accessOrder = true
        this.capacity = capacity;
    }
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```
:::
