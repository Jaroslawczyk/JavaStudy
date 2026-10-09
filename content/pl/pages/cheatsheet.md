# Ściąga z Javy: krótko i na temat

Ściąga do szybkiego powtórzenia. Szczegóły znajdziesz w lekcjach kursu.

## Podstawy

- Java kompiluje się do **kodu bajtowego**, który działa na **JVM** (`.java` → `javac` → `.class` → `java`).
- **JDK** = JRE + narzędzia (`javac`, `jar`); **JRE** = JVM + biblioteki.
- Punkt wejścia: `public static void main(String[] args)`.
- Nazewnictwo: klasy `PascalCase`, metody i zmienne `camelCase`, stałe `UPPER_SNAKE`, pakiety `lowercase`.
- Wielkość liter ma znaczenie. Plik z `public class Foo` musi nazywać się `Foo.java`.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

## Typy danych

| Typ | Rozmiar | Zakres / uwaga |
|---|---|---|
| `byte` | 8 bitów | −128…127 |
| `short` | 16 bitów | −32 768…32 767 |
| `int` | 32 bity | ≈ ±2,1 mld (domyślny dla liczb całkowitych) |
| `long` | 64 bity | przyrostek `L` |
| `float` | 32 bity | przyrostek `f` |
| `double` | 64 bity | domyślny dla ułamków |
| `char` | 16 bitów | UTF-16, `'a'` |
| `boolean` | — | `true` / `false` |

- Cała reszta to **typy referencyjne** (obiekty, tablice, `String`). Wartość domyślna: `null`; pola prymitywne — `0` / `false`.
- **Klasy opakowujące:** `Integer`, `Long`, `Double`, `Boolean`… Autoboxing/unboxing. `Integer` jest cache'owany w zakresie −128…127: `==` dla większych wartości porównuje referencje → używaj `equals`.
- Rozszerzanie (`int → long`) jest automatyczne; zawężanie wymaga rzutowania: `(int) 3.9` → `3`.
- Przepełnienie `int` po cichu „zawija się”. Do pieniędzy — `BigDecimal`, nie `double`.
- `var x = 10;` — wnioskowanie typu (tylko zmienne lokalne).
- `int / int` to dzielenie całkowite: `7 / 2 == 3`, `7 % 2 == 1`.

## Operatory i sterowanie

- Porównanie: `==` (prymitywy / referencje), `equals()` (wartość obiektów).
- Logika: `&&`, `||` są **leniwe** (short-circuit); `&`, `|` obliczają obie strony.
- `i++` (najpierw wartość, potem +1), `++i` (najpierw +1).
- Operator trójargumentowy: `a > b ? a : b`.

```java
for (int i = 0; i < n; i++) { }
for (String s : list) { }          // for-each
while (cond) { }
do { } while (cond);
break; continue;                    // wyjście / następna iteracja

// wyrażenie switch (Java 14+)
String name = switch (day) {
    case 1, 7 -> "weekend";
    case 2, 3, 4, 5, 6 -> "work";
    default -> "?";
};
```

## Łańcuchy znaków

- `String` jest **niemutowalny** (immutable), literały trafiają do String Pool.
- Porównanie: `s1.equals(s2)`, `equalsIgnoreCase`. Nie `==`!
- Częste metody: `length()`, `charAt(i)`, `substring(a, b)`, `indexOf`, `contains`, `split`, `trim`/`strip`, `isBlank`, `toUpperCase`, `replace`, `join`, `repeat`.
- Dużo konkatenacji w pętli → `StringBuilder` (niebezpieczny wątkowo; `StringBuffer` — bezpieczny wątkowo, wolniejszy).
- Text block: `""" ... """` (Java 15+). Formatowanie: `"%s = %d".formatted(a, b)`.

## Tablice

```java
int[] a = new int[5];          // zera
int[] b = {1, 2, 3};
int[][] m = new int[3][4];
a.length;                      // pole, nie metoda
Arrays.sort(b); Arrays.toString(b); Arrays.fill(a, 0);
Arrays.copyOf(b, 10); Arrays.equals(a, b); Arrays.asList(1, 2, 3);
```

- Stały rozmiar. Wyjście poza zakres → `ArrayIndexOutOfBoundsException`.

## OOP

**4 zasady:** hermetyzacja (ukrywanie danych: `private` + gettery/settery), dziedziczenie (`extends`), polimorfizm (jeden interfejs — różne zachowanie), abstrakcja.

```java
class Animal {
    protected String name;
    Animal(String name) { this.name = name; }
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override void speak() { System.out.println("Woof"); }
}
Animal a = new Dog("Rex");   // rzutowanie w górę
a.speak();                   // Woof — dynamiczne wiązanie
```

- **Modyfikatory dostępu:** `private` (klasa) < package-private (pakiet) < `protected` (pakiet + podklasy) < `public` (wszyscy).
- **Konstruktor:** nazwa klasy, bez typu zwracanego. Jeśli go nie napiszesz, istnieje domyślny bezargumentowy. `this(...)` / `super(...)` — w pierwszej linii.
- **Przeciążanie (overload):** ta sama nazwa, różne parametry (rozstrzygane przy kompilacji). **Nadpisywanie (override):** ta sama metoda w podklasie (rozstrzygane w czasie działania).
- `static` należy do klasy, nie do obiektu. `final`: zmiennej nie można przypisać ponownie, metody nadpisać, klasy dziedziczyć.
- Klasa dziedziczy tylko jedną klasę, ale może implementować wiele interfejsów.
- `Object`: `equals`, `hashCode`, `toString`, `getClass`. **Kontrakt:** równe obiekty → równy `hashCode`. Nadpisujesz jedno — nadpisz oba.
- `instanceof` + pattern matching: `if (o instanceof String s) { s.length(); }`.

### Klasa abstrakcyjna vs interfejs

| | `abstract class` | `interface` |
|---|---|---|
| Stan (pola) | tak | tylko stałe `static final` |
| Konstruktor | tak | nie |
| Dziedziczenie | jedna | wiele (`implements`) |
| Metody | abstrakcyjne i zwykłe | `abstract`, `default`, `static`, `private` |
| Kiedy | wspólna baza („jest”) | kontrakt („potrafi”) |

### Klasy zagnieżdżone, enum, record

- Zagnieżdżone: `static nested`, inner (trzyma referencję do obiektu zewnętrznego), lokalne, anonimowe (`new Interface() { ... }`).
- `enum` — zbiór stałych, może mieć pola i metody; `values()`, `valueOf()`, `ordinal()`.
- `record Point(int x, int y) {}` — niemutowalny nośnik danych (konstruktor, akcesory `x()`, `equals`, `hashCode`, `toString` generowane automatycznie).
- `sealed interface Shape permits Circle, Square {}` — ogranicza podklasy.

## Wyjątki

```text
Throwable
├── Error                 (OutOfMemoryError, StackOverflowError — nie łapiemy)
└── Exception
    ├── checked           (IOException, SQLException — trzeba obsłużyć)
    └── RuntimeException  (unchecked: NPE, IllegalArgument, IndexOutOfBounds, ClassCast, Arithmetic)
```

```java
try (var in = new FileInputStream("f.txt")) {   // try-with-resources: automatyczne close()
    // ...
} catch (IOException | IllegalStateException e) {
    log(e);
} finally {
    // wykona się prawie zawsze
}
throw new IllegalArgumentException("bad");
void read() throws IOException { }               // deklaracja wyjątku checked
```

- Łap **konkretne** wyjątki, nie połykaj ich po cichu. Najpierw wąskie `catch`, potem szerokie.
- Własny wyjątek: `class MyEx extends RuntimeException`.
- `finally` nie wykona się przy `System.exit()` ani awarii JVM.

## Kolekcje

```text
Iterable → Collection ─┬─ List  (ArrayList, LinkedList)
                       ├─ Set   (HashSet, LinkedHashSet, TreeSet)
                       └─ Queue (ArrayDeque, PriorityQueue)
Map (HashMap, LinkedHashMap, TreeMap)   — nie dziedziczy po Collection
```

| Struktura | Kolejność | Duplikaty | Złożoność | Uwagi |
|---|---|---|---|---|
| `ArrayList` | wstawiania | tak | get O(1), add na koniec O(1)*, wstawianie/usuwanie w środku O(n) | tablica w środku, domyślna List |
| `LinkedList` | wstawiania | tak | get O(n), add/remove przez referencję O(1) | rzadko potrzebna |
| `HashSet` | brak | nie | O(1) | oparty na `HashMap` |
| `LinkedHashSet` | wstawiania | nie | O(1) | |
| `TreeSet` | posortowana | nie | O(log n) | drzewo czerwono-czarne |
| `HashMap` | brak | unikalne klucze | O(1) | jeden klucz `null` dozwolony |
| `TreeMap` | wg klucza | — | O(log n) | |
| `ArrayDeque` | — | tak | O(1) na końcach | stos i kolejka |
| `PriorityQueue` | wg priorytetu | tak | O(log n) | kopiec |

\* zamortyzowana.

**HashMap od środka:** `hashCode()` → indeks kubełka → w środku łańcuch (lista; przy ≥ 8 elementach i tablicy ≥ 64 — drzewo). Load factor `0.75`, po przekroczeniu — resize ×2. Dlatego klucze muszą mieć poprawne `equals` + `hashCode` i być niemutowalne.

```java
List<String> list = new ArrayList<>(List.of("a", "b"));   // List.of jest niemutowalna
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.getOrDefault("x", 0);
map.merge("a", 1, Integer::sum);
map.computeIfAbsent("k", k -> 0);
for (Map.Entry<String, Integer> e : map.entrySet()) { }

list.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));
Collections.sort(list);
Collections.unmodifiableList(list);
```

- Usuwanie w `for-each` → `ConcurrentModificationException`. Używaj `Iterator.remove()` lub `removeIf`.
- `Comparable` (naturalny porządek, `compareTo`) vs `Comparator` (zewnętrzny, `compare`).
- Bezpieczne wątkowo: `ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue`.

## Generyki

```java
class Box<T extends Number> { T value; }
<T> T first(List<T> list) { return list.get(0); }
List<? extends Number> read;     // producent: czytamy (extends)
List<? super Integer> write;     // konsument: zapisujemy (super)  — PECS
```

- Wymazywane przy kompilacji (**type erasure**): w czasie działania `List<String>` = `List`. Nie można `new T()`, `new T[]` ani typów prymitywnych w parametrach (`List<int>`).
- `List<Object>` nie jest nadtypem `List<String>` (inwariancja).

## Lambdy i Stream API

- **Interfejs funkcyjny** — dokładnie jedna metoda abstrakcyjna (`@FunctionalInterface`): `Runnable`, `Supplier<T>`, `Consumer<T>`, `Function<T,R>`, `Predicate<T>`, `BiFunction`, `UnaryOperator`.
- Referencje do metod: `String::length`, `System.out::println`, `ArrayList::new`.

```java
List<String> result = people.stream()
    .filter(p -> p.age() >= 18)         // operacje pośrednie (leniwe)
    .map(Person::name)
    .sorted()
    .distinct()
    .limit(10)
    .toList();                           // operacja końcowa uruchamia potok

int sum = nums.stream().mapToInt(Integer::intValue).sum();
Map<String, List<Person>> byCity = people.stream().collect(Collectors.groupingBy(Person::city));
String s = names.stream().collect(Collectors.joining(", "));
boolean any = list.stream().anyMatch(x -> x > 5);   // allMatch, noneMatch
```

- Strumień jest jednorazowy. Nie modyfikuj źródła w trakcie. `parallelStream()` — tylko do ciężkich, niezależnych operacji.
- `Optional<T>`: `of`, `ofNullable`, `empty`, `map`, `orElse`, `orElseGet`, `orElseThrow`, `ifPresent`. Nie używaj go jako pola ani parametru.

## Wielowątkowość

```java
Thread t = new Thread(() -> work());
t.start();                          // start(), nie run()!
t.join();

ExecutorService pool = Executors.newFixedThreadPool(4);
Future<Integer> f = pool.submit(() -> compute());
f.get();
pool.shutdown();

CompletableFuture.supplyAsync(() -> load()).thenApply(this::parse).thenAccept(System.out::println);
```

- Stany wątku: NEW → RUNNABLE → BLOCKED / WAITING / TIMED_WAITING → TERMINATED.
- **`synchronized`** — wzajemne wykluczanie na monitorze obiektu (metoda lub blok), przy okazji gwarantuje widoczność.
- **`volatile`** — widoczność zmian między wątkami i zakaz zmiany kolejności; **nie** atomowość (`count++` nie jest bezpieczne).
- Atomowość: `AtomicInteger`, `LongAdder`; blokady: `ReentrantLock`, `ReadWriteLock`; synchronizatory: `CountDownLatch`, `Semaphore`, `CyclicBarrier`.
- **Problemy:** race condition, deadlock (zakleszczenie), livelock, starvation (zagłodzenie).
- `wait()` / `notify()` — tylko wewnątrz `synchronized`. `sleep()` nie zwalnia monitora.
- Java 21: **wątki wirtualne** — `Thread.ofVirtual().start(...)`, `Executors.newVirtualThreadPerTaskExecutor()` — tanie wątki do zadań I/O.

## Pamięć i JVM

- **Stack** (na wątek): ramki wywołań, lokalne prymitywy i referencje. **Heap** (wspólny): obiekty. **Metaspace**: metadane klas.
- Java **zawsze przekazuje przez wartość**: dla obiektów kopiowana jest *referencja* — stan obiektu można zmienić, ale podmienić obiektu u wywołującego nie.
- **Garbage Collector** usuwa nieosiągalne obiekty. Generacje: Young (Eden + Survivor) → Old. Kolektory: G1 (domyślny), ZGC, Shenandoah, Parallel.
- Wycieki pamięci: statyczne kolekcje, niezamknięte zasoby, zapomniane listenery, `ThreadLocal`.
- Referencje: strong, `SoftReference`, `WeakReference`, `PhantomReference`.
- Błędy: `StackOverflowError` (głęboka rekurencja), `OutOfMemoryError`.
- Class loadery: Bootstrap → Platform → Application (delegowanie do rodzica).
- Serializacja: `Serializable`, `transient` wyklucza pole. Refleksja: `Class<?> c = obj.getClass();`.

## Wejście-wyjście i czas

```java
Path p = Path.of("data.txt");
List<String> lines = Files.readAllLines(p);
String text = Files.readString(p);
Files.writeString(p, "hi");
try (BufferedReader r = Files.newBufferedReader(p)) { r.readLine(); }
```

- Bajty: `InputStream` / `OutputStream`; znaki: `Reader` / `Writer`. Opakowuj w `Buffered*`. Zawsze zamykaj (try-with-resources).
- Czas (`java.time`, niemutowalny): `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime`, `Instant`, `Duration`, `Period`, `DateTimeFormatter`. Nie używaj starych `Date` i `Calendar`.

## Wersje Javy

| Wersja | Najważniejsze |
|---|---|
| 8 (LTS) | lambdy, Stream API, `Optional`, `java.time`, metody default |
| 9 | moduły, `List.of` / `Map.of` |
| 10 / 11 (LTS) | `var`; `String.isBlank`, `HttpClient` |
| 14–17 (LTS) | wyrażenia switch, text blocks, `record`, `sealed`, wzorce `instanceof` |
| 21 (LTS) | wątki wirtualne, pattern matching w `switch`, record patterns, sequenced collections |

## Praktyczne zasady

- Deklaruj typ przez interfejs: `List<String> l = new ArrayList<>();`.
- Rób klasy niemutowalne, gdzie się da (pola `final`, bez setterów).
- Zwracaj pustą kolekcję, a nie `null`; dla wartości opcjonalnej — `Optional`.
- Porównuj przez `equals`, stałą stawiaj z lewej: `"a".equals(s)` (ochrona przed NPE).
- Zasoby zamykaj przez try-with-resources.
- Kompozycja jest lepsza niż dziedziczenie. Zasady: DRY, KISS, SOLID.

### SOLID w jednym zdaniu

- **S** — klasa ma jeden powód do zmiany.
- **O** — otwarta na rozszerzenie, zamknięta na modyfikację.
- **L** — podklasa zastępuje rodzica bez psucia czegokolwiek.
- **I** — kilka wąskich interfejsów jest lepszych niż jeden szeroki.
- **D** — zależ od abstrakcji, nie od implementacji.
