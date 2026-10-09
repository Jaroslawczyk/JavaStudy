W `ArrayList` wstawianie i usuwanie na początku i w środku jest kosztowne. **`LinkedList`** rozwiązuje to inaczej: żadnej tablicy — tylko łańcuch węzłów, z których każdy zna sąsiadów. Piszemy własną implementację `CarLinkedList` i omawiamy słynne pytanie „ArrayList czy LinkedList?” — z poprawkami ważnymi na rozmowie w 2026 roku.

## Znaczniki czasu wideo

- {{t j1 6:50:27}} — problemy `ArrayList` → lista wiązana
- {{t j1 6:51:27}} — popularne pytanie: czym `ArrayList` różni się od `LinkedList`
- {{t j1 6:51:34}} — klasa `Node`: `previous`, `value`, `next`; pola `first`, `last`, `size`
- {{t j1 6:52:04}} — dodawanie pierwszego i kolejnych elementów
- {{t j1 6:53:02}} — pobranie elementu: idziemy po `next`
- {{t j1 6:53:24}} — wstawianie w środek: przepinamy referencje
- {{t j1 6:53:58}} — usuwanie: na węzeł nikt już nie wskazuje
- {{t j1 6:54:23}} — `CarLinkedList implements CarList`
- {{t j1 6:55:04}} — zagnieżdżona `private static class Node`
- {{t j1 6:56:28}} — metoda `add`
- {{t j1 6:59:10}} — `add(car, index)` i pomocnicza `getNode(index)`
- {{t j1 7:03:20}} — przypadek szczególny: wstawienie na początek
- {{t j1 7:05:38}} — `removeAt` i przypadki brzegowe (pierwszy/ostatni)
- {{t j1 7:09:51}} — `remove(car)`, `get`, `clear`
- {{t j1 7:12:28}} — te same testy przechodzą dla nowej implementacji
- {{t j1 7:13:19}} — porównanie `ArrayList` i `LinkedList`
- {{t j1 7:15:54}} — pytania rekrutacyjne

## Jak zbudowana jest LinkedList

```text
first                                              last
  ↓                                                  ↓
[null | 5 | ●]  ⇄  [● | 7 | ●]  ⇄  [● | 100 | ●]  ⇄  [● | 3 | null]
 prev value next
```

Każdy **węzeł** (`Node`) przechowuje wartość i dwie referencje — do poprzedniego i następnego węzła (lista dwukierunkowa). Kolekcja przechowuje referencje do pierwszego i ostatniego węzła oraz rozmiar.

```java
public class CarLinkedList implements CarList {
    private Node first;
    private Node last;
    private int size = 0;

    private static class Node {          // static: węzeł nie potrzebuje dostępu do pól listy
        private Node previous;
        private Car value;
        private Node next;

        Node(Node previous, Car value, Node next) {
            this.previous = previous;
            this.value = value;
            this.next = next;
        }
    }

    @Override
    public void add(Car car) {
        if (size == 0) {
            first = new Node(null, car, null);
            last = first;
        } else {
            Node secondLast = last;
            last = new Node(secondLast, car, null);
            secondLast.next = last;
        }
        size++;
    }

    @Override
    public void add(Car car, int index) {
        if (index < 0 || index > size) throw new IndexOutOfBoundsException();
        if (index == size) {
            add(car);
            return;
        }
        Node nodeNext = getNode(index);
        Node nodePrevious = nodeNext.previous;
        Node newNode = new Node(nodePrevious, car, nodeNext);
        nodeNext.previous = newNode;
        if (nodePrevious != null) {
            nodePrevious.next = newNode;
        } else {
            first = newNode;                 // wstawienie na początek
        }
        size++;
    }

    @Override
    public boolean removeAt(int index) {
        Node node = getNode(index);
        Node nodeNext = node.next;
        Node nodePrevious = node.previous;
        if (nodeNext != null) nodeNext.previous = nodePrevious; else last = nodePrevious;
        if (nodePrevious != null) nodePrevious.next = nodeNext; else first = nodeNext;
        size--;
        return true;
    }

    @Override
    public Car get(int index) {
        return getNode(index).value;
    }

    private Node getNode(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
        Node node = first;
        for (int i = 0; i < index; i++) {
            node = node.next;                // idziemy po łańcuchu — to O(n)!
        }
        return node;
    }

    // remove(car), size(), clear() — patrz wideo
}
```

Usunięty węzeł staje się nieosiągalny — zbierze go garbage collector, pamięć zwalnia się od razu.

## ArrayList kontra LinkedList

Tak porównanie brzmi w wideo — i tak trzeba je uściślić:

| Operacja | `ArrayList` | `LinkedList` (wg wideo) | `LinkedList` (dokładniej) |
|---|---|---|---|
| `get(index)` | O(1) | O(n) | O(n) |
| `add(e)` na koniec | O(1)* | O(1) | O(1) |
| `add(index, e)` na początek/środek | O(n) | O(1) | **O(n)** szukanie węzła + O(1) przepięcie; na początek/koniec — O(1) |
| `remove(index)` | O(n) | O(1) | **O(n)** szukanie węzła + O(1) przepięcie |
| `remove(e)` / `contains(e)` | O(n) | O(n) | O(n) |
| Pamięć na element | ~4–8 bajtów (referencja) | — | ~24–40 bajtów (węzeł + 3 referencje) |

\* zamortyzowane.

:::warning "Najważniejsza poprawka do wideo"
W wideo powiedziano, że wstawianie w środek i usuwanie po indeksie w `LinkedList` to O(1). Ale żeby wstawić na pozycję `index`, najpierw trzeba do niej **dojść** — spójrz na własne `getNode`: to pętla, O(n). O(1) to tylko **przepięcie referencji**, gdy węzeł jest już znaleziony: przy pracy z początkiem/końcem listy lub przy przechodzeniu przez `ListIterator`. Jeśli na rozmowie odpowiesz „wstawianie w środek to O(1)” bez zastrzeżenia, dobry rekruter od razu zapyta: „A jak znajdziesz środek?”
:::

### Co wybierać w praktyce

- **Prawie zawsze `ArrayList`.** Tablica leży w pamięci jednym blokiem i świetnie współpracuje z cache procesora; `System.arraycopy` przesuwa tysiące elementów bardzo szybko. W realnych pomiarach `ArrayList` często wyprzedza `LinkedList` nawet przy wstawianiu w środek.
- Potrzebna **kolejka lub stos** — `ArrayDeque` (szybsza niż `LinkedList` i przestarzały `Stack`).
- `LinkedList` przydaje się rzadko: częste wstawianie/usuwanie w trakcie przechodzenia iteratorem, gdy pozycja jest już znana. Nawet jej autor, Joshua Bloch, przyznawał, że sam jej nie używa.

## Pytania rekrutacyjne

:::interview "Z wideo — z uściślonymi odpowiedziami"
1. **Czym różnią się ArrayList i LinkedList?** — Podstawą `ArrayList` jest tablica dynamiczna, podstawą `LinkedList` — lista dwukierunkowa węzłów. `LinkedList` implementuje też `Deque` (kolejkę dwustronną).
2. **Złożoność pobrania po indeksie?** — `ArrayList` O(1), `LinkedList` O(n).
3. **Złożoność usuwania po indeksie?** — `ArrayList` O(n) przez przesuwanie; `LinkedList` O(n) przez szukanie węzła (samo przepięcie — O(1)). Usunięcie pierwszego/ostatniego w `LinkedList` — O(1).
4. **Kiedy LinkedList jest lepsza od ArrayList?** — Gdy jest dużo wstawień/usunięć na początku listy lub w trakcie przechodzenia iteratorem. W pozostałych przypadkach — `ArrayList`; do kolejek — `ArrayDeque`.
5. **Jakie problemy ma ArrayList przy masowym dodawaniu i usuwaniu?** — Tablica sama się nie zmniejsza: pojemność pozostaje duża (`trimToSize()` to rozwiązuje), a wstawianie/usuwanie na początku to O(n).
:::

## Zadanie domowe

W wideo nie ma osobnego zadania — autor radzi napisać `LinkedList` samodzielnie, nawet jeśli zajmie to kilka dni.

:::task easy "Napisz od nowa"
Bez podpowiedzi zaimplementuj `CarLinkedList` (wszystkie metody `CarList`) i uruchom na niej testy z poprzedniej lekcji, zmieniając tylko linię tworzenia kolekcji w `setUp`.
:::

:::task medium "getNode od bliższego końca"
Zoptymalizuj `getNode`: jeśli `index < size / 2`, idź od `first` do przodu, w przeciwnym razie — od `last` do tyłu. Średnio daje to dwa razy mniej kroków (dokładnie tak zrobiono w JDK). Dodaj test sprawdzający `get` dla ostatnich elementów.
:::

:::task medium "addFirst, removeFirst, removeLast"
Dodaj metody działające w O(1): `addFirst`, `removeFirst`, `removeLast`. Za ich pomocą zaimplementuj stos (LIFO) i kolejkę (FIFO) na swojej liście.
:::

:::task hard "Odwracanie listy i uczciwy benchmark"
Napisz metodę `reverse()`, która odwraca listę dwukierunkową **w miejscu** w O(n) bez tworzenia nowych węzłów. Następnie porównaj `ArrayList` i `LinkedList` z JDK na 100 000 wstawień w środek: (a) przez `add(size/2, e)`, (b) przez `ListIterator` ustawiony na środku. Wyjaśnij wyniki.
??? Podpowiedź
W (a) `LinkedList` za każdym razem szuka środka — O(n) na wstawienie — i może przegrać z `ArrayList`. W (b) iterator już stoi na miejscu i wstawienie naprawdę jest O(1).
:::
