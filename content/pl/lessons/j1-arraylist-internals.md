Najczęstszy temat na rozmowach rekrutacyjnych z Javy to kolekcje. W tej lekcji projektujemy system ewidencji samochodów na parkingu: najpierw **interfejs**, potem **testy**, potem implementację `CarArrayList` — odpowiednik `ArrayList`. I analizujemy złożoność obliczeniową operacji (Big O).

## Znaczniki czasu wideo

- {{t j1 6:10:14}} — dlaczego na rozmowach zawsze pytają o kolekcje
- {{t j1 6:11:25}} — zadanie: ewidencja samochodów, wymagania
- {{t j1 6:12:06}} — klasa `Car` (marka i numer)
- {{t j1 6:12:44}} — SOLID: projektujemy na poziomie abstrakcji
- {{t j1 6:13:18}} — interfejs `CarList`
- {{t j1 6:14:42}} — najpierw testy: `CarListTest`
- {{t j1 6:15:33}} — test: dodano 100 — rozmiar 100
- {{t j1 6:16:52}} — test: usunięcie po indeksie zmniejsza rozmiar
- {{t j1 6:19:08}} — test: usunięcie obiektu; usunięcie nieistniejącego zwraca `false`
- {{t j1 6:21:42}} — testy `clear` i wyjścia poza zakres
- {{t j1 6:24:02}} — TDD: testy przed implementacją
- {{t j1 6:24:20}} — `CarArrayList implements CarList`
- {{t j1 6:26:03}} — `get` i `throw new IndexOutOfBoundsException()`
- {{t j1 6:27:39}} — `add` z powiększaniem tablicy i `Arrays.copyOf`
- {{t j1 6:29:50}} — `removeAt`: przesunięcie w lewo
- {{t j1 6:31:36}} — `remove(car)` i `equals`
- {{t j1 6:34:25}} — nowe wymaganie: wstawianie pod indeks
- {{t j1 6:37:13}} — implementacja: przesunięcie w prawo
- {{t j1 6:40:36}} — złożoność algorytmów: O(1) i O(n)
- {{t j1 6:44:35}} — tablica nie zmniejsza się przy usuwaniu
- {{t j1 6:45:41}} — `System.arraycopy` i metody natywne
- {{t j1 6:50:03}} — zadanie domowe

## Najpierw interfejs

```java
public interface CarList {
    Car get(int index);
    void add(Car car);
    void add(Car car, int index);
    boolean remove(Car car);
    boolean removeAt(int index);
    int size();
    void clear();
}
```

Zasada z SOLID (Dependency Inversion): kod zależy od **abstrakcji**, a nie od implementacji. Testy pisze się dla interfejsu — potem podstawia się dowolną implementację (`CarArrayList`, `CarLinkedList`) i wszystkie testy muszą przejść.

## Testy przed implementacją (TDD)

```java
class CarListTest {
    private CarList carList;

    @BeforeEach
    void setUp() {
        carList = new CarArrayList();
        for (int i = 0; i < 100; i++) {
            carList.add(new Car("Brand" + i, i));
        }
    }

    @Test
    void whenAdded100ElementsThenSizeMustBe100() {
        assertEquals(100, carList.size());
    }

    @Test
    void whenElementRemovedByIndexThenSizeMustBeDecreased() {
        assertTrue(carList.removeAt(5));
        assertEquals(99, carList.size());
    }

    @Test
    void whenNonExistentElementRemovedThenReturnFalse() {
        assertFalse(carList.remove(new Car("Toyota", 15)));
        assertEquals(100, carList.size());
    }

    @Test
    void whenIndexOutOfBoundsThenThrowException() {
        assertThrows(IndexOutOfBoundsException.class, () -> carList.get(100));
    }

    @Test
    void insertIntoMiddle() {
        carList.add(new Car("BMW", 1), 50);
        assertEquals("BMW", carList.get(50).getBrand());
    }
}
```

## Implementacja CarArrayList

```java
public class CarArrayList implements CarList {
    private Car[] array = new Car[10];
    private int size = 0;

    @Override
    public Car get(int index) {
        checkIndex(index);
        return array[index];
    }

    @Override
    public void add(Car car) {
        increaseArray();
        array[size] = car;
        size++;
    }

    @Override
    public void add(Car car, int index) {
        if (index < 0 || index > size) {          // index == size — wstawienie na koniec, dozwolone
            throw new IndexOutOfBoundsException();
        }
        increaseArray();
        System.arraycopy(array, index, array, index + 1, size - index);   // przesunięcie w prawo
        array[index] = car;
        size++;
    }

    @Override
    public boolean remove(Car car) {
        for (int i = 0; i < size; i++) {
            if (array[i].equals(car)) {
                return removeAt(i);
            }
        }
        return false;
    }

    @Override
    public boolean removeAt(int index) {
        checkIndex(index);
        for (int i = index; i < size - 1; i++) {   // przesunięcie w lewo
            array[i] = array[i + 1];
        }
        size--;
        return true;
    }

    @Override
    public int size() { return size; }

    @Override
    public void clear() {
        array = new Car[10];
        size = 0;
    }

    private void checkIndex(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
    }

    private void increaseArray() {
        if (size >= array.length) {
            array = Arrays.copyOf(array, array.length * 2);
        }
    }
}
```

`ArrayList` to po prostu **nakładka na tablicę** — „tablica dynamiczna”.

## Złożoność operacji (Big O)

**Big O** opisuje, jak rośnie czas operacji wraz ze wzrostem liczby elementów `n`:

- **O(1)** — czas stały: nie zależy od rozmiaru kolekcji.
- **O(n)** — liniowy: 10 razy więcej elementów — ok. 10 razy dłużej.
- **O(log n)** — logarytmiczny (drzewa, wyszukiwanie binarne) — spotkasz go w `TreeSet`.

| Operacja `ArrayList` | Złożoność | Dlaczego |
|---|---|---|
| `get(index)` | **O(1)** | Bezpośredni dostęp do komórki tablicy |
| `add(e)` na koniec | **O(1)** zamortyzowane | Zapis do komórki; rzadkie powiększenie kopiuje tablicę w O(n) |
| `add(e, index)` na początek/środek | **O(n)** | Przesunięcie wszystkich elementów w prawo |
| `removeAt(index)` / `remove(e)` | **O(n)** | Przesunięcie (i wyszukiwanie dla `remove(e)`) |
| `contains(e)` | **O(n)** | Przegląd po kolei |

Zalety `ArrayList`: szybki dostęp po indeksie i dodawanie na koniec. Wady: wstawianie/usuwanie na początku i w środku.

### System.arraycopy

IDEA podświetla ręczną pętlę kopiowania i proponuje zamianę na `System.arraycopy(src, srcPos, dest, destPos, length)`. To metoda `native` (zaimplementowana w C/C++ w JVM), która kopiuje cały blok pamięci — dużo szybciej niż pętla. **Złożoność pozostaje O(n)**, mniejsza jest tylko stała.

## Czego nie ma w wideo

:::note "O „wycieku pamięci” w ArrayList"
Autor mówi, że niezmniejszająca się tablica powoduje „wyciek pamięci”. Dokładniej: pamięć zajęta przez **pojemność** (capacity) nie zwalnia się automatycznie — to zachowanie oczekiwane, a nie wyciek. Aby zmniejszyć tablicę, jest `arrayList.trimToSize()`. Prawdziwy wyciek to sytuacja, gdy po usunięciu w komórkach zostają referencje do obiektów; implementacja JDK zeruje zwolnioną komórkę: `elementData[--size] = null;` — zrób to samo u siebie.
:::

- Prawdziwa `ArrayList` rośnie **1,5 raza**, a nie 2, i przydziela tablicę leniwie — przy pierwszym dodaniu.
- Jeśli rozmiar jest znany z góry, twórz `new ArrayList<>(10_000)` — bez zbędnych powiększeń.
- `ArrayList` nie jest bezpieczna wątkowo: do wielowątkowości — `Collections.synchronizedList` lub `CopyOnWriteArrayList` (część 2).
- Nie myl jej z przestarzałym `Vector` — zsynchronizowanym „starszym bratem” `ArrayList` z Javy 1.0, nieużywanym w nowym kodzie.

## Zadanie domowe

:::task video "remove przez System.arraycopy — z wideo"
Przepisz `removeAt` tak, by przesunięcie wykonywało się przez `System.arraycopy`. Najpierw ręcznie, potem porównaj z wariantem proponowanym przez IDEA (<kbd>Alt+Enter</kbd> → *Replace with System.arraycopy*). Testy muszą zostać zielone. {{t j1 6:50:03}}
??? Podpowiedź
Przesuwamy w lewo elementy na prawo od usuwanego: `System.arraycopy(array, index + 1, array, index, size - index - 1);`, potem `array[--size] = null;`.
:::

:::task easy "Zerowanie i trimToSize"
Dodaj do `CarArrayList` zerowanie zwalnianej komórki przy usuwaniu oraz metodę `trimToSize()`, zmniejszającą tablicę do `size`. Napisz test: po dodaniu 100 i usunięciu 90 elementów `trimToSize()` nie psuje `get`.
:::

:::task medium "Wzrost 1,5 raza"
Zmień strategię wzrostu na 1,5× (`oldCapacity + (oldCapacity >> 1)`). Dodaj licznik powiększeń i porównaj, ile razy tablica rośnie przy dodaniu 1 000 000 elementów przy wzroście ×2 i ×1,5. Dlaczego JDK wybrał 1,5?
:::

:::task hard "Pomiar złożoności"
Napisz program, który dla `n` = 10 000, 100 000 i 1 000 000 mierzy (przez `System.nanoTime()`) czas: 1000 wstawień na początek, 1000 wstawień na koniec i 1000 `get` po losowym indeksie — dla `ArrayList`. Zbuduj tabelę i upewnij się, że wstawianie na początek rośnie liniowo z `n`, a pozostałe operacje prawie wcale.
??? Podpowiedź
Przed pomiarem „rozgrzej” JVM kilkoma przebiegami — inaczej kompilacja JIT zniekształci wyniki. Do poważnych pomiarów używa się **JMH** (Java Microbenchmark Harness).
:::
