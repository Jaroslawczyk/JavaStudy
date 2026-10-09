Wbudowane kolekcje Javy: **`ArrayList`** — dynamiczna lista, **`HashSet`** — zbiór bez powtórzeń, **`TreeSet`** — posortowany zbiór. Do tego typy generyczne w nawiasach ostrych `<>` i coś, czego w wideo nie ma, a co jest potrzebne od pierwszego dnia — **`HashMap`**.

## Znaczniki czasu wideo

- {{t j1 3:54:51}} — wada naszej kolekcji: tylko napisy
- {{t j1 3:55:12}} — wbudowana kolekcja `ArrayList`
- {{t j1 3:55:41}} — lista bez typu przechowuje cokolwiek — to źle
- {{t j1 3:55:52}} — typ elementów w nawiasach ostrych `<String>`
- {{t j1 3:56:32}} — `add`, `size()`, `get(index)`
- {{t j1 3:57:45}} — `remove` po indeksie i po wartości
- {{t j1 3:58:20}} — przechodzenie pętlą for-each
- {{t j1 3:58:59}} — `List<Integer>`: typów prostych nie wolno, potrzebne klasy opakowujące
- {{t j1 4:00:14}} — suma liczb z listy
- {{t j1 4:00:50}} — tablica czy lista?
- {{t j1 4:02:26}} — `HashSet`: bez powtórzeń i bez kolejności
- {{t j1 4:04:40}} — `TreeSet`: posortowany zbiór
- {{t j1 4:06:17}} — zadanie domowe

## ArrayList

```java
import java.util.ArrayList;
import java.util.List;

List<String> employees = new ArrayList<>();
employees.add("Siergiej");
employees.add("Natalia");
employees.add("Oleg");

System.out.println(employees.size());   // 3
System.out.println(employees.get(0));   // Siergiej

employees.remove(0);            // po indeksie
employees.remove("Natalia");    // po wartości (przez equals)

for (String name : employees) {
    System.out.println(name);
}
```

- `List<String>` to **typ generyczny**: kompilator nie pozwoli włożyć do listy niczego poza napisami.
- `new ArrayList<>()` to „diament” (diamond): typ po prawej jest wnioskowany z deklaracji po lewej.
- Bez `<…>` (typ surowy, raw type) lista przyjmuje dowolne `Object` — tak pisano przed Javą 5, dziś to ostrzeżenie i źródło błędów.

### Tylko typy referencyjne

```java
List<int> nums;            // błąd kompilacji
List<Integer> numbers = new ArrayList<>();
for (int i = 0; i <= 1000; i++) {
    numbers.add(i);        // autoboxing int → Integer
}
int sum = 0;
for (int n : numbers) {    // unboxing
    sum += n;
}
System.out.println(sum);   // 500500
```

### Najprzydatniejsze metody List

| Metoda | Co robi |
|---|---|
| `add(e)` / `add(i, e)` | Dodaj na koniec / pod indeks |
| `get(i)` / `set(i, e)` | Pobierz / zamień |
| `remove(i)` / `remove(obj)` | Usuń po indeksie / po wartości |
| `size()` / `isEmpty()` | Rozmiar / czy pusta |
| `contains(obj)` / `indexOf(obj)` | Czy jest / gdzie jest |
| `clear()` | Wyczyść |
| `sort(null)` lub `Collections.sort(list)` | Sortowanie |
| `getFirst()` / `getLast()` / `reversed()` | Pierwszy / ostatni / odwrócona kolejność (Java 21+) |

:::warning "remove(1) dla List<Integer>"
`numbers.remove(1)` usunie element **o indeksie 1**, a nie liczbę 1. Aby usunąć wartość: `numbers.remove(Integer.valueOf(1))`. Klasyczna pułapka z przeciążeniami `remove(int)` / `remove(Object)`.
:::

## Tablica czy lista?

Autor cytuje radę „zawsze używaj listy zamiast tablic” i sam stosuje tablice tylko dla małych, niezmiennych zestawów (klatki animacji w grze). W praktyce:

- **`List`** — domyślnie w logice biznesowej: wygodne metody, sama rośnie.
- **Tablica** — dla stałych danych, dużych ilości typów prostych (`int[]` jest znacznie oszczędniejsza niż `List<Integer>`), niskopoziomowej wydajności.

## HashSet i TreeSet

**Set** (zbiór) nie przechowuje powtórzeń.

```java
Set<String> names = new HashSet<>();
names.add("Olga");
names.add("Iwan");
names.add("Olga");                  // nie zostanie dodana
System.out.println(names.size());   // 2
```

| | `HashSet` | `LinkedHashSet` | `TreeSet` |
|---|---|---|---|
| Powtórzenia | nie | nie | nie |
| Kolejność | **żadna** (może się zmieniać) | kolejność dodania | **posortowana** |
| Szybkość `add`/`contains` | O(1) | O(1) | O(log n) |
| `get(index)` | nie | nie | nie — tylko przechodzenie |

:::note "Napisy sortują się jak napisy"
W wideo `TreeSet` z napisami `"15"`, `"3"`, `"4"` dał kolejność `15, 3, 4` — napisy porównuje się **znak po znaku** (leksykograficznie). W `TreeSet<Integer>` liczby sortują się według wartości.
:::

## Czego nie ma w wideo

### Programuj na poziomie interfejsów

```java
List<String> list = new ArrayList<>();        // dobrze: typ zmiennej to interfejs
ArrayList<String> list2 = new ArrayList<>();  // gorzej: przywiązanie do implementacji
```

Tak łatwo zmienić implementację (`ArrayList` → `LinkedList`) bez ruszania reszty kodu.

### Kolekcje niezmienne (Java 9+)

```java
List<String> days = List.of("Pn", "Wt", "Śr");
Set<Integer> primes = Set.of(2, 3, 5, 7);
days.add("Cz");   // UnsupportedOperationException
```

### Usuwanie podczas przechodzenia

```java
for (String name : employees) {
    if (name.startsWith("O")) employees.remove(name);   // ConcurrentModificationException!
}
employees.removeIf(name -> name.startsWith("O"));       // poprawnie (lambdy — część 2)
```

### HashMap — słownik „klucz → wartość”

Autor mówi, że w kursie będzie używana tylko `ArrayList`, ale w prawdziwych projektach **`Map` używa się nie rzadziej niż `List`**:

```java
Map<String, Integer> salaries = new HashMap<>();
salaries.put("Iwan", 5000);
salaries.put("Anna", 6500);
salaries.put("Iwan", 5500);                       // klucz jest unikalny: wartość zostanie nadpisana

System.out.println(salaries.get("Anna"));         // 6500
System.out.println(salaries.getOrDefault("Piotr", 0)); // 0
System.out.println(salaries.containsKey("Iwan")); // true

for (Map.Entry<String, Integer> e : salaries.entrySet()) {
    System.out.println(e.getKey() + " → " + e.getValue());
}
```

Jak `HashMap` jest zbudowana wewnątrz (funkcja skrótu, kubełki, `equals`/`hashCode`) — szczegółowo w **drugiej części kursu**, gdzie autor pisze własne implementacje wszystkich głównych kolekcji.

### Mapa Collections Framework

```text
Iterable
 └─ Collection
     ├─ List   → ArrayList, LinkedList
     ├─ Set    → HashSet, LinkedHashSet, TreeSet
     └─ Queue  → ArrayDeque, PriorityQueue, LinkedList
Map (osobna hierarchia) → HashMap, LinkedHashMap, TreeMap
```

## Zadanie domowe

:::task video "Trzy kolekcje — z wideo"
Utwórz trzy kolekcje: pierwsza przechowuje liczby od 1 do 10; druga — imiona studentów (tyle samo, co liczb); trzecia — napisy w postaci „numer, imię”, wypełniane w pętli z dwóch pierwszych kolekcji. Wypisz trzecią kolekcję pętlą for-each. {{t j1 4:06:17}}
??? Podpowiedź
Użyj zwykłego `for` po indeksie, by brać elementy obu kolekcji jednocześnie: `result.add(numbers.get(i) + ", " + students.get(i));`.
:::

:::task easy "Unikalne słowa"
Dane jest zdanie. Wypisz liczbę słów i liczbę słów **unikalnych** (bez rozróżniania wielkości liter), używając `split` i `HashSet`. Następnie wypisz unikalne słowa alfabetycznie przez `TreeSet`.
:::

:::task medium "Częstość słów"
Policz, ile razy występuje każde słowo w tekście, za pomocą `HashMap<String, Integer>`. Wypisz 3 najczęstsze słowa.
??? Podpowiedź
`counts.put(word, counts.getOrDefault(word, 0) + 1);` — albo krócej `counts.merge(word, 1, Integer::sum);`.
:::

:::task medium "Czyszczenie listy"
Wypełnij `List<Integer>` 20 losowymi liczbami od 1 do 50. Usuń wszystkie parzyste (przez `Iterator` lub `removeIf`), potem usuń duplikaty, **zachowując kolejność** (podpowiedź: `LinkedHashSet`). Wypisz wynik po każdym kroku.
:::

:::task hard "Książka telefoniczna"
Zaimplementuj klasę `PhoneBook` na `Map<String, List<String>>`: jedna osoba może mieć kilka numerów. Metody: `add(name, phone)`, `List<String> find(name)` (pusta lista, jeśli brak), `removeNumber(phone)`, `printAll()` — w kolejności alfabetycznej imion. Zastanów się, którą `Map` wybrać, by wynik był posortowany bez osobnego sortowania.
??? Podpowiedź
`TreeMap` przechowuje klucze posortowane. Dodawanie: `book.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);` — albo ręcznie: `if (!book.containsKey(name)) book.put(name, new ArrayList<>());`.
:::
