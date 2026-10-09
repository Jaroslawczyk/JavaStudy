Końcowa „rozmowa rekrutacyjna” o kolekcjach: pytania z prawdziwych rozmów. Pracuj jak w wideo — przeczytaj pytanie, **odpowiedz na głos**, dopiero potem otwórz odpowiedź. Odpowiedzi poniżej są uściślone z uwzględnieniem poprawek z poprzednich lekcji.

:::tip "Jak trenować"
Odpowiadanie na głos to nie to samo, co „przemyślenie w głowie”. Nagraj się albo poproś znajomego, by zagrał rekrutera. Zaznaczaj pytania, przy których się zawahałeś, i wracaj do odpowiednich lekcji.
:::

## Znaczniki czasu wideo

- {{t j1 9:49:38}} — jak przechodzić tę „rozmowę”
- {{t j1 9:50:34}} — pytania 1–7: hierarchia, List, Set
- {{t j1 9:53:24}} — pytania 8–9: `equals` i `hashCode`
- {{t j1 9:54:11}} — pytania 10–15: `Map`, `HashMap`, `HashSet`
- {{t j1 9:55:51}} — pytania 16–21: złożoność obliczeniowa
- {{t j1 9:57:43}} — zakończenie działu

## Pytania

:::task video "1. Opowiedz o hierarchii Collection Framework"
{{t j1 9:50:34}}
??? Odpowiedź
Na górze jest `Iterable` (dzięki niemu działa for-each). Pod nim `Collection`, po którym dziedziczą `List`, `Set` i `Queue`. Główne implementacje: `List` — `ArrayList`, `LinkedList`; `Set` — `HashSet`, `LinkedHashSet`, `TreeSet`; `Queue`/`Deque` — `ArrayDeque`, `LinkedList`, `PriorityQueue`. Osobno stoi `Map`: `HashMap`, `LinkedHashMap`, `TreeMap`.
:::

:::task video "2. Czym różnią się LinkedList i ArrayList?"
{{t j1 9:51:14}}
??? Odpowiedź
`ArrayList` opiera się na tablicy dynamicznej, `LinkedList` — na liście dwukierunkowej węzłów (i implementuje też `Deque`). Stąd różna złożoność operacji i zużycie pamięci (węzeł `LinkedList` jest cięższy niż referencja w tablicy).
:::

:::task video "3. Kiedy używać LinkedList, a kiedy ArrayList?"
{{t j1 9:51:27}}
??? Odpowiedź
Domyślnie — `ArrayList`: szybki dostęp po indeksie, zwartość, przyjazność dla cache procesora. `LinkedList` — przy wielu wstawieniach/usunięciach na początku lub w pozycji, w której już stoi iterator. Do kolejek i stosów lepsza jest `ArrayDeque`.
:::

:::task video "4. Czym List różni się od Set?"
{{t j1 9:51:42}}
??? Odpowiedź
`List` przechowuje elementy po kolei, dopuszcza duplikaty i ma dostęp po indeksie. `Set` nie dopuszcza identycznych elementów i nie ma metod indeksowych (`get`, `remove(index)`, `add(index, e)`).
:::

:::task video "5. Skoro Set nie ma get, jak wypisać wszystkie elementy?"
{{t j1 9:52:09}}
??? Odpowiedź
`Set` dziedziczy po `Iterable`, więc przechodzi się po nim pętlą for-each (albo iteratorem, albo `stream()`/`forEach`).
:::

:::task video "6. Główne implementacje Set i ich różnice?"
{{t j1 9:52:19}}
??? Odpowiedź
`HashSet` — bez kolejności, O(1); `LinkedHashSet` — kolejność dodania, O(1); `TreeSet` — posortowane, O(log n).
:::

:::task video "7. Klasa User z polem name — jak posortuje je TreeSet?"
{{t j1 9:52:46}}
??? Odpowiedź
Pytanie z haczykiem: jeśli `User` nie implementuje `Comparable` i do konstruktora `TreeSet` nie przekazano `Comparator`, program padnie z `ClassCastException` przy dodawaniu.
:::

:::task video "8. Czym są equals i hashCode, po co są potrzebne?"
{{t j1 9:53:24}}
??? Odpowiedź
To metody klasy `Object`. `equals` porównuje obiekty po zawartości (domyślnie — po referencji). `hashCode` zwraca `int` — liczbową reprezentację obiektu; kolekcje haszujące (`HashSet`, `HashMap`) wybierają na jego podstawie kubełek.
:::

:::task video "9. Jakie są zasady equals i hashCode?"
{{t j1 9:53:50}}
??? Odpowiedź
Nadpisałeś `equals` — nadpisz `hashCode`. Obiekty równe wg `equals` muszą mieć równe hash code'y. Różne hash code'y — obiekty na pewno różne. Równe hash code'y nie gwarantują równości (kolizja). Do tego kontrakt `equals`: zwrotność, symetria, przechodniość, spójność, `equals(null) == false`.
:::

:::task video "10. Do czego służy Map?"
{{t j1 9:54:11}}
??? Odpowiedź
Do przechowywania par „klucz — wartość” i szybkiego pobierania wartości po kluczu.
:::

:::task video "11. Czy w Map mogą być dwa identyczne klucze? Dwie identyczne wartości?"
{{t j1 9:54:23}}
??? Odpowiedź
Klucze — nie (ponowny `put` nadpisze wartość). Wartości — tak.
:::

:::task video "12. Jak zbudowana jest HashMap?"
{{t j1 9:54:31}}
??? Odpowiedź
Tablica kubełków (początkowo 16) z obiektów `Entry`/`Node` (hash, klucz, wartość, next). Pozycja — wg hash code'u klucza. Kubełek pusty — wkładamy parę. Zajęty — porównujemy klucze przez `equals`: równe — nadpisujemy wartość, różne — kolizja. Przy wypełnieniu 75 % (load factor) tablica się podwaja, a pary są rozkładane na nowo.
:::

:::task video "13. Jak rozwiązywane są kolizje w HashMap?"
{{t j1 9:55:04}}
??? Odpowiedź
Łańcuchowo: nowy element dodaje się do listy wiązanej kubełka. Jeśli w kubełku jest 8+ elementów, a pojemność tablicy ≥ 64, lista zamienia się w drzewo czerwono-czarne (Java 8+).
:::

:::task video "14. Jak można zgubić element w HashMap?"
{{t j1 9:55:21}}
??? Odpowiedź
Użyć zmiennego obiektu jako klucza i po `put` zmienić pole uczestniczące w `hashCode`: `get` będzie szukać w innym kubełku. Dlatego klucze powinny być niezmienne.
:::

:::task video "15. Jak zbudowany jest HashSet?"
{{t j1 9:55:36}}
??? Odpowiedź
W środku jest `HashMap`: elementy zbioru przechowywane są jako klucze, a wartość jest u wszystkich ta sama (obiekt-zaślepka).
:::

:::task video "16. Złożoność wstawiania na początek/środek: ArrayList i LinkedList?"
{{t j1 9:55:51}}
??? Odpowiedź
`ArrayList` — O(n) przez przesuwanie. `LinkedList` — O(n) z uwzględnieniem szukania pozycji po indeksie; samo przepięcie to O(1), więc wstawienie na początek/koniec lub przez `ListIterator` — O(1). (W wideo dla `LinkedList` podano O(1) — dodaj zastrzeżenie na rozmowie.)
:::

:::task video "17. Złożoność pobrania po indeksie?"
{{t j1 9:56:10}}
??? Odpowiedź
`ArrayList` — O(1), `LinkedList` — O(n).
:::

:::task video "18. Złożoność usuwania po indeksie?"
{{t j1 9:56:24}}
??? Odpowiedź
`ArrayList` — O(n). `LinkedList` — O(n) na szukanie węzła + O(1) na przepięcie; usunięcie pierwszego/ostatniego — O(1).
:::

:::task video "19. Złożoność usuwania po wartości (wszystkie kolekcje)?"
{{t j1 9:56:30}}
??? Odpowiedź
`ArrayList` O(n); `LinkedList` O(n) — wyszukiwanie, samo usunięcie O(1) (jak mówi wideo); `HashSet`/`HashMap` średnio O(1), w najgorszym przypadku O(log n); `TreeSet` O(log n).
:::

:::task video "20. Złożoność contains?"
{{t j1 9:57:16}}
??? Odpowiedź
`ArrayList`, `LinkedList` — O(n); `HashSet`, `HashMap.containsKey` — średnio O(1) (w najgorszym O(log n)); `TreeSet` — O(log n).
:::

:::task video "21. Złożoność wstawiania bez indeksu?"
{{t j1 9:57:27}}
??? Odpowiedź
O(1) dla wszystkich poza `TreeSet` (O(log n)). W `ArrayList` — zamortyzowane, przez rzadkie powiększenia tablicy.
:::

## Dodatkowe pytania (nie z wideo, ale częste)

:::task easy "Comparable vs Comparator"
Czym się różnią i kiedy czego używać?
??? Odpowiedź
`Comparable` to „porządek naturalny”, implementowany przez samą klasę (`compareTo`). `Comparator` to porządek zewnętrzny, osobny obiekt (`compare`); potrzebny, gdy klasy nie da się zmienić lub porządków jest kilka.
:::

:::task medium "Iteratory fail-fast"
Czym jest `ConcurrentModificationException` i jak poprawnie usuwać elementy podczas przechodzenia?
??? Odpowiedź
Iteratory kolekcji JDK są fail-fast: przy strukturalnej zmianie kolekcji nie przez iterator w trakcie przechodzenia kolejne `next()` rzuca wyjątek (sprawdzenie `modCount`). Usuwaj przez `iterator.remove()` lub `collection.removeIf(...)`.
:::

:::task medium "HashMap a wielowątkowość"
Dlaczego `HashMap` nie można używać z kilku wątków i co wybrać zamiast niej?
??? Odpowiedź
`HashMap` nie jest zsynchronizowana: jednoczesne `put` mogą zgubić dane lub zepsuć strukturę. Opcje: `ConcurrentHashMap` (główny wybór), `Collections.synchronizedMap` (jedna blokada na wszystko); przestarzała `Hashtable` — nie używa się. Szczegóły w części 2 kursu.
:::

:::task hard "Zaprojektuj strukturę"
Potrzebna jest struktura przechowująca użytkowników po `id` z dostępem O(1), potrafiąca wypisać ich w kolejności rejestracji i usuwać najstarszych po przekroczeniu limitu. Których kolekcji JDK użyjesz i dlaczego?
??? Odpowiedź
`LinkedHashMap<Long, User>` — O(1) po kluczu i kolejność wstawiania; usuwanie najstarszych przez `removeEldestEntry` lub `pollFirstEntry()` z `SequencedMap` (Java 21+).
:::
