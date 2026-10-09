Teraz system przechowuje pary „właściciel → samochód”. Do takich danych służy interfejs **`Map`** i jego najpopularniejsza implementacja — **`HashMap`**. Piszemy własną `CarHashMap`, omawiamy kolizje, drzewa w kubełkach, złożoność i dowiadujemy się, że `HashSet` w rzeczywistości jest zbudowany na `HashMap`. To chyba najczęstsze pytanie na rozmowach Java Junior.

## Znaczniki czasu wideo

- {{t j1 8:54:14}} — nowe wymagania: pary „właściciel — samochód”
- {{t j1 8:55:20}} — interfejs `Map`
- {{t j1 8:55:27}} — klasa `CarOwner`
- {{t j1 8:56:03}} — interfejs `CarMap`: `put`, `get`, `keySet`, `values`, `remove`, `size`, `clear`
- {{t j1 8:57:56}} — testy dla `CarMap`
- {{t j1 9:00:55}} — jak zbudowana jest `HashMap`: tablica 16 kubełków
- {{t j1 9:01:32}} — `Entry` z kluczem, wartością i `next`
- {{t j1 9:02:13}} — ten sam klucz — wartość jest nadpisywana
- {{t j1 9:03:17}} — powiększenie przy wypełnieniu 75 %
- {{t j1 9:03:50}} — implementacja `CarHashMap`
- {{t j1 9:05:20}} — metoda `put`
- {{t j1 9:09:29}} — metoda `get`
- {{t j1 9:10:45}} — metoda `remove`
- {{t j1 9:14:40}} — `keySet` i `values`
- {{t j1 9:16:14}} — powiększanie tablicy i współczynnik wypełnienia
- {{t j1 9:20:14}} — testy padły: klucz nie ma `equals`/`hashCode`
- {{t j1 9:21:51}} — analiza i pytania rekrutacyjne
- {{t j1 9:25:26}} — złożoność: przypadek najlepszy i najgorszy
- {{t j1 9:26:33}} — `TREEIFY_THRESHOLD = 8`: drzewo zamiast listy
- {{t j1 9:28:43}} — `put` z istniejącym kluczem
- {{t j1 9:29:11}} — `HashSet` wewnątrz używa `HashMap`
- {{t j1 9:30:06}} — przepisujemy `CarHashSet` na `HashMap`

## Interfejs Map

```java
Map<CarOwner, Car> map = new HashMap<>();
CarOwner owner = new CarOwner(1, "Iwan", "Iwanow");

map.put(owner, new Car("BMW", 1));         // dodaj parę
Car car = map.get(owner);                   // pobierz wartość po kluczu
map.put(owner, new Car("Audi", 2));        // ten sam klucz — wartość NADPISANA
map.remove(owner);                          // usuń parę po kluczu
Set<CarOwner> owners = map.keySet();        // wszystkie klucze (unikalne → Set)
Collection<Car> cars = map.values();        // wszystkie wartości (mogą się powtarzać)
```

- **Klucze są unikalne**, wartości — nie.
- `Map` **nie dziedziczy** po `Collection` i nie jest `Iterable`: metody `put(key, value)` i `remove(key)` nie pasują do kontraktu `Collection`.

## Jak zbudowana jest HashMap

```text
table[16]:
 0 [null]
 …
 6 [Entry key=owner1, value=BMW] → [Entry key=owner2, value=Audi]   ← kolizja
 …
15 [null]
```

1. W środku jest tablica kubełków z obiektami `Entry { key, value, next }`, początkowo na 16 komórek.
2. Pozycję pary wyznacza **hash code klucza**.
3. Kubełek pusty — wkładamy `Entry`. Zajęty — porównujemy klucze przez `equals`: równe — **nadpisujemy value**; różne — **kolizja**, dodajemy do łańcucha.
4. `get` i `remove` działają tak samo: hash → kubełek → szukanie w łańcuchu przez `equals`.
5. Przy wypełnieniu 75 % (**load factor 0,75**) tablica się podwaja, a wszystkie pary są rozkładane na nowo.

Jeśli zrozumiałeś `HashSet` z poprzednich lekcji — `HashMap` jest zbudowana prawie tak samo, tylko `Entry` przechowuje dodatkowo klucz.

## Implementacja put (skrócona)

```java
private boolean put(CarOwner key, Car value, Entry[] dst) {
    int position = getElementPosition(key, dst.length);
    Entry existed = dst[position];
    if (existed == null) {
        dst[position] = new Entry(key, value, null);
        return true;                                    // nowa para
    }
    while (true) {
        if (existed.key.equals(key)) {
            existed.value = value;                      // klucz już jest — nadpisz
            return false;
        }
        if (existed.next == null) {
            existed.next = new Entry(key, value, null); // kolizja — na koniec łańcucha
            return true;
        }
        existed = existed.next;
    }
}
```

:::warning "Klucze muszą mieć equals i hashCode"
W wideo testy najpierw padają: klasa `CarOwner` nie nadpisuje `equals` i `hashCode`, więc identyczni właściciele byli traktowani jak różne klucze. Zasada z lekcji o `equals`/`hashCode` w działaniu.
:::

## Złożoność HashMap

| Operacja | Przypadek najlepszy / średni | Przypadek najgorszy |
|---|---|---|
| `put`, `get`, `remove`, `containsKey` | **O(1)** | **O(log n)** (Java 8+), wcześniej O(n) |

Skąd O(log n): jeśli w jednym kubełku zbierze się **8** lub więcej elementów (`TREEIFY_THRESHOLD`), łańcuch zamienia się w **drzewo czerwono-czarne**, jak w `TreeSet`. Nie wszyscy rekruterzy to wiedzą — dobry plus na rozmowie.

:::note "Uściślenie do wideo"
Zamiana kubełka w drzewo następuje tylko wtedy, gdy pojemność tablicy wynosi co najmniej **64** (`MIN_TREEIFY_CAPACITY`); w przeciwnym razie `HashMap` po prostu powiększa tablicę. Gdy w kubełku znów jest ≤ 6 elementów, drzewo wraca do postaci listy. Drzewa działają najlepiej, gdy klucze implementują `Comparable`.
:::

## HashSet zbudowany na HashMap

```java
public class CarHashSet implements CarSet {
    private static final Object PRESENT = new Object();
    private final Map<Car, Object> map = new HashMap<>();

    public boolean add(Car car)      { return map.put(car, PRESENT) == null; }
    public boolean remove(Car car)   { return map.remove(car) != null; }
    public boolean contains(Car car) { return map.containsKey(car); }
    public int size()                { return map.size(); }
    public void clear()              { map.clear(); }
    public Iterator<Car> iterator()  { return map.keySet().iterator(); }
}
```

Elementy zbioru to **klucze** `HashMap`, a wartość jest u wszystkich ta sama — zaślepka. Dokładnie tak napisany jest `java.util.HashSet`.

## Pytania rekrutacyjne

:::interview "Z wideo — z uściśleniami"
1. **Czym jest Map?** — Kolekcją par „klucz — wartość” z unikalnymi kluczami.
2. **Główne metody?** — `put`, `get`, `remove`, `containsKey`, `keySet`, `values`, `entrySet`, `size`, `clear`.
3. **Czy Map należy do hierarchii Collection?** — Nie: nie dziedziczy ani po `Collection`, ani po `Iterable`. Przechodzi się po jej widokach: `keySet()`, `values()`, `entrySet()`.
4. **Dlaczego Map wydzielono osobno?** — Jej metody (`put(k, v)`, `remove(key)`) nie pasują do kontraktu `Collection`.
5. **Jak zbudowana jest HashMap?** — Tablica kubełków `Entry` (klucz, wartość, next); pozycja wg hash code'u klucza; przy tym samym kubełku porównanie kluczy przez `equals`: równe — nadpisanie, różne — kolizja.
6. **Jak rozwiązywane są kolizje?** — Łańcuchem (listą wiązaną) w kubełku; przy 8+ elementach (i pojemności ≥ 64) — drzewem czerwono-czarnym.
7. **Złożoność?** — Średnio O(1), w najgorszym przypadku O(log n).
8. **Czy kolejność elementów jest gwarantowana?** — Nie.
9. **`put` z istniejącym kluczem?** — Wartość jest nadpisywana, metoda zwraca starą wartość.
10. **Jak zbudowany jest HashSet?** — W środku `HashMap`: elementy to klucze, wartość to wspólna zaślepka.
:::

## Czego nie ma w wideo

### Przydatne metody Map (Java 8+)

```java
Map<String, Integer> counts = new HashMap<>();
counts.merge("java", 1, Integer::sum);              // licznik w jednej linii
counts.getOrDefault("kotlin", 0);                    // 0, jeśli klucza nie ma
counts.putIfAbsent("go", 0);
counts.computeIfAbsent("python", k -> 42);
for (Map.Entry<String, Integer> e : counts.entrySet()) {   // właściwy sposób przechodzenia po Map
    System.out.println(e.getKey() + " = " + e.getValue());
}
counts.forEach((k, v) -> System.out.println(k + " = " + v));
```

### Inne szczegóły

- `HashMap` dopuszcza **jeden klucz `null`** i dowolne wartości `null`.
- `Hashtable` to przestarzały zsynchronizowany odpowiednik; do wielowątkowości — `ConcurrentHashMap` (część 2 kursu).
- `Map.of("a", 1, "b", 2)` — niezmienna `Map` (Java 9+).

## Zadanie domowe

W wideo nie ma osobnego zadania — autor proponuje napisać `CarHashMap` samodzielnie, analogicznie do `CarHashSet`.

:::task easy "Własna CarHashMap"
Zaimplementuj `CarHashMap` według schematu z lekcji i sprawdź ją testami z wideo: 100 różnych kluczy → rozmiar 100; 100 wstawień z 10 różnymi kluczami → rozmiar 10; usuwanie; `keySet`/`values`; `get`.
:::

:::task medium "Licznik słów"
Za pomocą `HashMap<String, Integer>` i `merge` policz częstość słów w tekście. Wypisz 10 najczęstszych, sortując `entrySet()` po wartości malejąco (`Map.Entry.comparingByValue(Comparator.reverseOrder())`).
:::

:::task medium "HashSet przez HashMap"
Przepisz swój `CarHashSet` na `HashMap`, jak w wideo ({{t j1 9:30:06}}), i upewnij się, że wszystkie dotychczasowe testy przechodzą.
:::

:::task hard "Złe hash code'y i drzewa"
Utwórz klasę-klucz `BadKey(int id)` z `hashCode()` zawsze zwracającym 42. Dodaj 100 000 kluczy do `HashMap` i zmierz czas `get` — najpierw gdy `BadKey` **nie** implementuje `Comparable`, potem gdy implementuje. Wyjaśnij różnicę, opierając się na budowie kubełków-drzew.
:::
