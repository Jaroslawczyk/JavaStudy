Nowe wymaganie: w systemie nie może być dwóch identycznych samochodów. Sprawdzanie duplikatów przeglądaniem to O(n) na każde dodanie. Rozwiązanie — **zbiór (Set)** oparty na **tablicy haszującej**: piszemy `CarHashSet`, omawiamy kolizje i współczynnik wypełnienia, a potem wydzielamy wspólne metody do interfejsu `CarCollection`.

## Znaczniki czasu wideo

- {{t j1 7:36:08}} — wymaganie: bez identycznych samochodów
- {{t j1 7:36:40}} — dlaczego sprawdzanie w `List` jest zbyt kosztowne
- {{t j1 7:37:12}} — interfejs `CarSet`: `add`, `remove`, `size`, `clear`
- {{t j1 7:37:58}} — napisz testy sam
- {{t j1 7:38:26}} — testy: trzy identyczne obiekty → rozmiar +1
- {{t j1 7:42:04}} — teoria: tablica `Entry` na 16 komórek, pozycja = hash code % 16
- {{t j1 7:43:08}} — kolizja: łańcuch przez `next`
- {{t j1 7:44:20}} — współczynnik wypełnienia 0,75
- {{t j1 7:45:07}} — po powiększeniu pozycje są przeliczane
- {{t j1 7:45:38}} — implementacja `CarHashSet`
- {{t j1 7:47:14}} — pozycja elementu i `Math.abs`
- {{t j1 7:48:24}} — metoda `add`
- {{t j1 7:52:53}} — metoda `remove`
- {{t j1 7:57:22}} — powiększanie tablicy i przeliczanie pozycji
- {{t j1 8:02:06}} — load factor w kodzie
- {{t j1 8:03:36}} — pytania o `HashSet`
- {{t j1 8:06:24}} — wspólny interfejs `CarCollection`
- {{t j1 8:09:56}} — hierarchia: `Collection` → `List`, `Set`
- {{t j1 8:10:28}} — zadanie domowe: `contains`
- {{t j1 8:14:11}} — refaktoryzacja: wspólne `findElement`

## Tablica haszująca

```text
indeks:  0      1      2      3      4                    …   15
       [null] [null] [null] [null] [Entry 20]→[Entry 36]  …  [null]
                                      (20 % 16 = 4, 36 % 16 = 4 — kolizja)
```

1. W środku jest tablica „kubełków” (bucket) z obiektami `Entry { value, next }`, początkowo na **16** komórek.
2. Pozycja elementu = `hashCode() % długość tablicy`.
3. Jeśli kubełek jest pusty — wkładamy tam. Jeśli zajęty — porównujemy przez **`equals`**: równe — to duplikat, nie dodajemy; różne — **kolizja**, idziemy po łańcuchu `next` i dodajemy na koniec.
4. Gdy elementów jest więcej niż `długość × 0,75` (**load factor**), tablica się **podwaja**, a wszystkie elementy są **rozkładane na nowo** — bo `hashCode % 32` to już nie to samo co `% 16`.

Kolejność elementów wyznaczają hash code'y, a nie kolejność dodania — stąd „chaotyczne” wypisywanie i brak dostępu po indeksie.

## Implementacja CarHashSet (skrócona)

```java
public class CarHashSet implements CarSet {
    private static final int INITIAL_CAPACITY = 16;
    private static final double LOAD_FACTOR = 0.75;
    private Entry[] array = new Entry[INITIAL_CAPACITY];
    private int size = 0;

    private static class Entry {
        private final Car value;
        private Entry next;
        Entry(Car value, Entry next) { this.value = value; this.next = next; }
    }

    @Override
    public boolean add(Car car) {
        if (size >= array.length * LOAD_FACTOR) {
            increaseArray();
        }
        boolean added = add(car, array);
        if (added) size++;
        return added;
    }

    private boolean add(Car car, Entry[] dst) {
        int position = getElementPosition(car, dst.length);
        if (dst[position] == null) {
            dst[position] = new Entry(car, null);
            return true;
        }
        Entry existed = dst[position];
        while (true) {
            if (existed.value.equals(car)) return false;        // duplikat
            if (existed.next == null) {
                existed.next = new Entry(car, null);             // na koniec łańcucha
                return true;
            }
            existed = existed.next;
        }
    }

    private int getElementPosition(Car car, int arrayLength) {
        return Math.abs(car.hashCode() % arrayLength);
    }

    private void increaseArray() {
        Entry[] newArray = new Entry[array.length * 2];
        for (Entry entry : array) {
            for (Entry e = entry; e != null; e = e.next) {
                add(e.value, newArray);                          // przeliczanie pozycji
            }
        }
        array = newArray;
    }

    // remove, contains, size, clear — patrz wideo
}
```

:::warning "Klasy elementów muszą poprawnie implementować equals i hashCode"
Kolekcja haszująca znajduje kubełek przez `hashCode()`, a porównuje elementy przez `equals()`. Jeśli w `Car` nadpisano tylko `equals`, dwa identyczne samochody trafią do różnych kubełków — i w zbiorze pojawią się duplikaty (pytanie 3 poniżej).
:::

## Złożoność HashSet

| Operacja | Przypadek średni | Przypadek pesymistyczny |
|---|---|---|
| `add`, `remove`, `contains` | **O(1)** | O(n), gdy wszystkie elementy są w jednym kubełku (w prawdziwym JDK — O(log n), patrz lekcja o `HashMap`) |

## Pytania rekrutacyjne

:::interview "Z wideo"
1. **Dlaczego Set nie ma `get(index)`, `remove(index)`, `add(e, index)`?** — Pozycję elementu wyznacza hash code, a nie kolejność; pojęcia „indeks” nie ma.
2. **Czy kolejność elementów w HashSet jest gwarantowana?** — Nie: elementy rozkładane są według hash code'ów, a przy powiększaniu tablicy jeszcze przenoszone.
3. **Co się stanie, gdy nadpiszesz `equals`, ale nie `hashCode`?** — Identyczne obiekty dostaną różne hash code'y i różne kubełki: duplikaty będą dodawane, a `contains`/`remove` zaczną działać nieprzewidywalnie.
4. **Co jeśli `hashCode` zawsze zwraca 1?** — Wszystkie elementy trafią do jednego kubełka, który zdegeneruje się w listę: operacje staną się O(n).
5. **Dlaczego Set ma osobny interfejs, zamiast implementować List?** — Set nie może zaimplementować indeksowych metod `List`; wspólne metody przeniesiono do rodzica `Collection`.
:::

## Czego nie ma w wideo

### Pułapka Math.abs

W wideo wartość bezwzględna jest brana **po** dzieleniu — `Math.abs(hash % n)` — i to jest bezpieczne. Ale częsty wariant „odwrotny” — `Math.abs(hash) % n` — się psuje: `Math.abs(Integer.MIN_VALUE)` zwraca **ujemne** `-2147483648` (lekcja o przeciążaniu), a gdy długość tablicy nie jest potęgą dwójki, indeks wychodzi ujemny. Najczytelniejszy sposób to `Math.floorMod(hash, n)`: wynik zawsze w przedziale `[0, n)`.

### Jak to zrobiono w JDK

- Pojemność tablicy to zawsze **potęga dwójki**, a indeks liczony jest bitowo: `(n - 1) & (h ^ (h >>> 16))` — szybciej niż dzielenie i lepiej „miesza” słabe hash code'y.
- Prawdziwy `HashSet` w ogóle nie ma własnej tablicy haszującej: w środku leży **`HashMap`**, w której elementy są kluczami (omówimy w lekcji o `HashMap`).
- `HashSet` dopuszcza jeden `null`.
- Jeśli kolejność jest ważna — `LinkedHashSet` (kolejność dodania) lub `TreeSet` (sortowanie).

## Zadanie domowe

:::task video "Metoda contains — z wideo"
Dodaj do wspólnego interfejsu `CarCollection` metodę `boolean contains(Car car)`, napisz do niej testy i zaimplementuj we wszystkich trzech kolekcjach: `CarArrayList`, `CarLinkedList`, `CarHashSet`. {{t j1 8:10:28}}
??? Podpowiedź
W listach wygodnie jest wydzielić wyszukiwanie do `private int findElement(Car car)` (zwraca indeks lub −1) i wyrazić przez nie i `remove`, i `contains`: `return findElement(car) != -1;`. W `CarHashSet` — jak `remove`, ale bez przepinania referencji. Omówienie: {{t j1 8:10:58}}
:::

:::task easy "Unikalne słowa"
Za pomocą `HashSet<String>` wypisz, ile unikalnych słów ma długi tekst (np. pierwszy rozdział „Lalki”), i porównaj czas z naiwnym szukaniem duplikatów w `ArrayList`.
:::

:::task medium "floorMod i potęgi dwójki"
Najpierw sprawdź pułapkę: przy długości tablicy 10 policz `Math.abs(Integer.MIN_VALUE) % 10` — wyjdzie ujemny indeks. Następnie zmień `CarHashSet`: pojemność to potęga dwójki, pozycja — `(n - 1) & (h ^ (h >>> 16))`. Napisz test z obiektem, którego `hashCode()` zwraca `Integer.MIN_VALUE`, i upewnij się, że dodawanie i wyszukiwanie działają.
:::

:::task hard "Statystyka kolizji"
Dodaj do `CarHashSet` metodę zwracającą długość najdłuższego łańcucha i udział pustych kubełków. Porównaj trzy implementacje `hashCode` w `Car`: `Objects.hash(brand, number)`, `brand.hashCode() + number` (z wideo) i `number` — na 100 000 samochodów. Która daje mniej kolizji i dlaczego?
:::
