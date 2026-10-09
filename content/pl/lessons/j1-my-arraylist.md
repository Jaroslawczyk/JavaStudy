Tablicy nie można ani powiększyć, ani zmniejszyć. Zanim użyjemy gotowych kolekcji Javy, autor pisze **własną kolekcję** `MyArrayList` — dynamiczną tablicę napisów. Gdy zrozumiesz jej budowę, będziesz dokładnie wiedzieć, jak działa prawdziwa `ArrayList`.

## Znaczniki czasu wideo

- {{t j1 3:24:18}} — kolekcje: po co są potrzebne
- {{t j1 3:25:20}} — tablica pracowników
- {{t j1 3:26:15}} — dodawanie elementu do tablicy: tworzymy nową, kopiujemy
- {{t j1 3:28:05}} — usuwanie elementu: znowu nowa tablica
- {{t j1 3:30:03}} — pomysł własnej kolekcji: tablica na 10 + `size`
- {{t j1 3:31:49}} — klasa `MyArrayList`
- {{t j1 3:32:21}} — metoda `add` i podwajanie tablicy
- {{t j1 3:34:36}} — metoda `remove(int index)` z przesuwaniem elementów
- {{t j1 3:36:25}} — `getSize()` i `get(int index)`
- {{t j1 3:37:00}} — używamy kolekcji w `main`, dodajemy 100 pracowników
- {{t j1 3:39:32}} — sprawdzanie indeksów w `remove` i `get`
- {{t j1 3:40:39}} — przeciążone `remove(String)` z wyszukiwaniem przez `equals`
- {{t j1 3:42:59}} — podsumowanie: napisałeś odpowiednik `ArrayList`

## Problem tablic

Aby „dodać” element do tablicy, trzeba utworzyć nową tablicę o 1 większą i wszystko skopiować. Aby „usunąć” — nową o 1 mniejszą i skopiować bez usuniętego elementu. Za każdym razem ręcznie, z ryzykiem pomyłki w indeksach. Kolekcja chowa tę pracę w środku.

## Własna kolekcja

```java
public class MyArrayList {
    private String[] array = new String[10];   // wewnętrzny magazyn
    private int size;                          // ile elementów faktycznie leży

    public void add(String s) {
        array[size] = s;
        size++;
        if (size == array.length) {            // brak miejsca — powiększamy 2 razy
            String[] newArray = new String[array.length * 2];
            for (int i = 0; i < array.length; i++) {
                newArray[i] = array[i];
            }
            array = newArray;
        }
    }

    public void remove(int index) {
        if (index >= 0 && index < size) {
            for (int i = index; i < size - 1; i++) {
                array[i] = array[i + 1];       // przesuwamy ogon w lewo
            }
            size--;
        }
    }

    public void remove(String s) {
        int index = -1;
        for (int i = 0; i < size; i++) {
            if (s.equals(array[i])) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            remove(index);
        }
    }

    public String get(int index) {
        if (index >= 0 && index < size) {
            return array[index];
        }
        return "Nie znaleziono elementu";
    }

    public int getSize() {
        return size;
    }
}
```

```text
size = 4, usuwamy index = 1:
[ Nikita | Igor | Wania | Aleksiej | … ]
          ◄──── przesunięcie ────
[ Nikita | Wania | Aleksiej | Aleksiej | … ]   size = 3 → ostatni „nadmiarowy” element jest ignorowany
```

Kluczowa idea: **pojemność** (`array.length`) i **rozmiar** (`size`) to różne rzeczy. Tablica jest zawsze trochę większa niż potrzeba, więc `add` zwykle działa natychmiast, a kosztowne kopiowanie zdarza się rzadko.

## Czego nie ma w wideo

### Złożoność operacji (Big O)

| Operacja | Złożoność | Dlaczego |
|---|---|---|
| `get(index)` | O(1) | Bezpośredni dostęp po indeksie tablicy |
| `add(element)` na koniec | O(1) zamortyzowane | Zwykle tylko zapis; czasem kopiowanie O(n) |
| `remove(index)` | O(n) | Przesunięcie wszystkich elementów z prawej |
| `remove(String)` / wyszukiwanie | O(n) | Przegląd po kolei |

To klasyka rozmów rekrutacyjnych („czym `ArrayList` różni się od `LinkedList`”) — szczegółowo omówiona w drugiej części kursu.

### Jak to zrobiono w prawdziwej ArrayList

- Początkowa pojemność to 10 (przydzielana przy pierwszym dodaniu), wzrost — **o 1,5 raza** (`oldCapacity + (oldCapacity >> 1)`), a nie 2.
- Kopiowanie — nie pętlą, lecz szybkim natywnym `System.arraycopy` / `Arrays.copyOf`.
- `get` z błędnym indeksem **rzuca** `IndexOutOfBoundsException`, zamiast zwracać napis-zaślepkę. Zwracanie „Nie znaleziono elementu” jest niebezpieczne: kod wywołujący nie odróżni zaślepki od prawdziwego napisu.

### Wyciek pamięci przy usuwaniu

Autor mówi, że po przesunięciu ostatniemu elementowi nie trzeba przypisywać `null`. Dla poprawności *działania* to prawda, ale dla **pamięci** — nie: tablica nadal trzyma referencję do obiektu i garbage collector nie może go usunąć („loitering”). Prawdziwa `ArrayList` robi `elementData[--size] = null;`.

### Dlaczego nie da się jej przejść for-each

for-each działa z tablicami i z obiektami implementującymi interfejs `Iterable`. Aby `for (String s : myList)` zadziałało, `MyArrayList` musi implementować `Iterable<String>` — interfejsy będą w kolejnych lekcjach, a własny iterator napiszesz w drugiej części kursu.

### Typy generyczne (generics)

`MyArrayList` przechowuje tylko `String`. Aby jedna kolekcja pasowała do dowolnych typów — `MyArrayList<T>` — potrzebne są generyki (część 2 kursu).

## Zadanie domowe

W wideo nie ma osobnego zadania — autor radzi **usunąć cały kod i napisać kolekcję od nowa samodzielnie**. To jest pierwsze zadanie.

:::task easy "Napisz od nowa"
Bez podglądania napisz ponownie `MyArrayList` z metodami `add`, `remove(int)`, `remove(String)`, `get`, `getSize`. Sprawdź: dodaj 25 elementów (tablica musi powiększyć się dwa razy), usuń pierwszy, ostatni i środkowy.
:::

:::task easy "contains i indexOf"
Dodaj metody `boolean contains(String s)` i `int indexOf(String s)` (zwraca −1, gdy nie znaleziono). Przepisz `remove(String)` z użyciem `indexOf`.
:::

:::task medium "add pod indeks i set"
Dodaj `add(int index, String s)` — wstawianie z przesunięciem elementów w prawo — oraz `set(int index, String s)` — zamianę. Nie zapomnij o powiększaniu tablicy przy wstawianiu.
??? Podpowiedź
Najpierw upewnij się, że jest miejsce (jeśli `size == array.length` — powiększ), potem przesuwaj od końca: `for (int i = size; i > index; i--) array[i] = array[i - 1];`.
:::

:::task medium "Poprawne błędy i pamięć"
Zmień `get` i `remove(int)` tak, aby przy błędnym indeksie rzucały `IndexOutOfBoundsException` z komunikatem w rodzaju `Index: 12, Size: 5`. W `remove` zeruj zwolnioną komórkę. Dodaj `toString()` zwracające `[a, b, c]`.
:::

:::task hard "MyIntList i porównanie szybkości"
Utwórz podobną kolekcję dla `int` (`MyIntList`). Dodaj do niej 10 mln liczb i zmierz czas (`System.nanoTime()`) dla wzrostu 2× i 1,5×, a także porównaj z `ArrayList<Integer>`. Dlaczego `ArrayList<Integer>` zajmuje zauważalnie więcej pamięci?
??? Podpowiedź
`ArrayList<Integer>` przechowuje nie liczby, lecz referencje do obiektów `Integer` (autoboxing — następna lekcja): każda liczba to osobny obiekt z nagłówkiem. `int[]` trzyma wartości jedna za drugą.
:::
