Końcowa „rozmowa rekrutacyjna” z całego kursu: po 2–3 pytania z każdego tematu — OOP, kolekcje, generyki, wielowątkowość, strumienie, wejście-wyjście. Tak przebiega prawdziwa rozmowa techniczna z Java SE. Odpowiedz na głos na każde pytanie; gdzie masz wątpliwości — wróć do lekcji przez link w znaczniku czasu.

:::tip "Jak przygotować się do prawdziwej rozmowy"
Nie ucz się tekstu na pamięć — tłumacz własnymi słowami i podawaj przykład z kodu. Na pytanie, na które nie znasz odpowiedzi, uczciwie powiedz „nie wiem, ale rozumowałbym tak…”. Odbyta rozmowa, nawet nieudana, to cenne doświadczenie: zapisuj pytania i uzupełniaj braki. O co jeszcze pytają na poziomie Junior i Middle — na stronie [Poziomy](#/page/levels).
:::

## Znaczniki czasu wideo

- {{t j2 7:22:50}} — format końcowej rozmowy
- {{t j2 7:23:51}} — OOP, przeciążanie, static, modyfikatory, interfejsy
- {{t j2 7:27:36}} — kolekcje
- {{t j2 7:31:05}} — generyki
- {{t j2 7:31:37}} — wielowątkowość
- {{t j2 7:35:02}} — Stream API
- {{t j2 7:36:16}} — serializacja i wejście-wyjście
- {{t j2 7:37:30}} — słowa autora na pożegnanie

## OOP i podstawy

:::task video "1. Zasady OOP. Czym jest polimorfizm? Przykład z życia."
{{t j2 7:23:51}}
??? Odpowiedź
Hermetyzacja, dziedziczenie, polimorfizm (+ abstrakcja). Polimorfizm — „jeden interfejs, wiele implementacji”: metoda przyjmująca typ interfejsu zachowuje się różnie zależnie od rzeczywistego obiektu. Przykład — samochody z jednakowym sterowaniem, ale różnym zachowaniem.
:::

:::task video "2. Czym jest przeciążanie? Czy można mieć metody o tej samej nazwie różniące się tylko typem zwracanym?"
{{t j2 7:24:44}}
??? Odpowiedź
Przeciążanie — metody o jednej nazwie i różnych parametrach (liczba, typy, kolejność) w jednej klasie. Różnica tylko w typie zwracanym to błąd kompilacji.
:::

:::task video "3. Składowe statyczne i niestatyczne. Skąd można się do czego odwoływać?"
{{t j2 7:25:20}}
??? Odpowiedź
Statyczne należą do klasy i są dostępne bez obiektu; niestatyczne — do obiektu. Z metody statycznej — tylko do składowych statycznych (niestatyczne bez obiektu nie istnieją); z niestatycznej — do dowolnych.
:::

:::task video "4. Modyfikatory dostępu"
{{t j2 7:26:08}}
??? Odpowiedź
`public` — wszędzie; `protected` — pakiet + podklasy; package-private (bez modyfikatora) — wewnątrz pakietu; `private` — wewnątrz klasy. (W wideo dla `protected` wspomniano tylko podklasy — widzi go też cały pakiet.)
:::

:::task video "5. Klasa abstrakcyjna vs interfejs"
{{t j2 7:26:32}}
??? Odpowiedź
Interfejs — kontrakt/zachowanie, bez stanu (tylko stałe), wielokrotna implementacja; od Javy 8 ma metody `default`/`static`, od Javy 9 — `private`. Klasa abstrakcyjna — wspólna istota pokrewnych klas: pola, konstruktory, dowolna implementacja; dziedziczyć można tylko po jednej.
:::

## Kolekcje

:::task video "6. Hierarchia Collection Framework"
{{t j2 7:27:36}}
??? Odpowiedź
`Iterable` → `Collection` → `List` (`ArrayList`, `LinkedList`), `Set` (`HashSet`, `LinkedHashSet`, `TreeSet`), `Queue`/`Deque` (`ArrayDeque`, `LinkedList`, `PriorityQueue`). Osobno `Map`: `HashMap`, `LinkedHashMap`, `TreeMap`.
:::

:::task video "7. ArrayList vs LinkedList: budowa i wybór"
{{t j2 7:28:11}}
??? Odpowiedź
`ArrayList` — tablica dynamiczna: dostęp po indeksie O(1), wstawianie w środek O(n). `LinkedList` — lista dwukierunkowa: wstawianie/usuwanie na końcach i przez iterator O(1), dostęp po indeksie O(n). Domyślnie — `ArrayList`; do kolejek — `ArrayDeque`.
:::

:::task video "8. List vs Set"
{{t j2 7:28:45}}
??? Odpowiedź
`List` — uporządkowana, dopuszcza duplikaty, dostęp po indeksie. `Set` — bez duplikatów, bez metod indeksowych.
:::

:::task video "9. equals i hashCode: po co i jakie zasady?"
{{t j2 7:29:12}}
??? Odpowiedź
Metody `Object`: porównanie po zawartości i liczbowa reprezentacja dla kolekcji haszujących. Nadpisałeś `equals` — nadpisz `hashCode`; równe obiekty — równe hashe; równe hashe nie gwarantują równości.
:::

:::task video "10. Jak zbudowana jest HashMap i jak rozwiązuje się kolizje?"
{{t j2 7:29:54}}
??? Odpowiedź
Tablica kubełków (domyślnie 16, powiększenie przy wypełnieniu 75 %). Indeks — z hasha klucza; zajęty — porównanie kluczy `equals`: równe — podmiana wartości, inaczej kolizja — element trafia do listy wiązanej kubełka; przy 8+ elementach w kubełku i pojemności ≥ 64 lista zamienia się w drzewo czerwono-czarne.
:::

:::task video "11. Złożoność wstawiania na początek: ArrayList i LinkedList"
{{t j2 7:30:55}}
??? Odpowiedź
`ArrayList` — O(n) (przesunięcie wszystkich elementów), `LinkedList` — O(1).
:::

## Generyki

:::task video "12. Czym są generyki i wildcard?"
{{t j2 7:31:05}}
??? Odpowiedź
Typy parametryzowane: klasy, interfejsy, metody z parametrem typu; kontrola typów przy kompilacji, wymazywanie w czasie działania. Wildcard `?` — nieznany typ, ograniczany przez `? extends T` (czytamy) i `? super T` (piszemy) — PECS.
:::

## Wielowątkowość

:::task video "13. Jak zatrzymać wątek? interrupt i join"
{{t j2 7:31:37}}
??? Odpowiedź
Kooperacyjnie przez `interrupt()` (flaga + `InterruptedException` w oczekiwaniu); `stop()` od Javy 20 nie działa. `join()` — czekać na zakończenie innego wątku.
:::

:::task video "14. Sposoby synchronizacji. Czym jest monitor?"
{{t j2 7:32:32}}
??? Odpowiedź
Metoda `synchronized` (monitor `this` lub `Class`) i blok `synchronized` z jawnym monitorem; także `Lock`, atomiki, kolekcje współbieżne.
:::

:::task video "15. Demony, wait, notify/notifyAll"
{{t j2 7:33:04}}
??? Odpowiedź
Demon kończy się, gdy zakończyły się wszystkie wątki główne. `wait()` — czekać i zwolnić monitor; `notify()` budzi jeden czekający wątek, `notifyAll()` — wszystkie. Wywoływane wewnątrz `synchronized` na tym samym obiekcie, `wait` — w pętli.
:::

:::task video "16. ExecutorService: po co, submit vs execute, Runnable vs Callable"
{{t j2 7:33:40}}
??? Odpowiedź
Pula wielokrotnie używanych wątków z kolejką zadań. `execute(Runnable)` — bez wyniku; `submit` zwraca `Future`. `Callable` zwraca wartość i może rzucać wyjątki sprawdzane.
:::

:::task video "17. volatile"
{{t j2 7:34:35}}
??? Odpowiedź
Widoczność zapisu dla wszystkich wątków i zakaz przestawiania operacji wokół pola; nie czyni `++` atomowym.
:::

## Stream API

:::task video "18. Co robi stream() i po co strumienie?"
{{t j2 7:35:02}}
??? Odpowiedź
Zamienia kolekcję w taśmociąg przetwarzania: zwięzłe filtrowanie, przekształcanie, sortowanie bez kolekcji pośrednich; leniwość; łatwe zrównoleglenie przez `parallelStream()`.
:::

:::task video "19. Operacje końcowe i pośrednie. Co robi map?"
{{t j2 7:35:43}}
??? Odpowiedź
Pośrednie zwracają `Stream` i są leniwe, może ich być dowolnie wiele; końcowa jest jedna i uruchamia taśmociąg. `map` przekształca każdy element, typ może się zmienić.
:::

## Wejście-wyjście

:::task video "20. Serializacja: co to jest i jakie są warunki?"
{{t j2 7:36:16}}
??? Odpowiedź
Zamiana obiektu w bajty i z powrotem. Warunki: `Serializable`/`Externalizable`; pola serializowalne lub `transient`; nieserializowalny przodek ma dostępny konstruktor bezparametrowy.
:::

:::task video "21. transient i klasy buforowane"
{{t j2 7:37:05}}
??? Odpowiedź
`transient` wyłącza pole z serializacji. Bufor: `BufferedInputStream`, `BufferedOutputStream`, `BufferedReader`, `BufferedWriter`.
:::

:::note "O „bezużytecznych” pytaniach"
Na koniec autor nazywa pytanie o rodzaje garbage collectorów bezużytecznym w pracy ({{t j2 7:38:06}}). Dla Juniora to uczciwe, ale już na poziomie Middle znajomość GC (G1 — domyślny, ZGC dla małych pauz, Parallel dla przepustowości) i umiejętność czytania logów GC pomagają rozwiązywać realne problemy z wydajnością i pamięcią. Nie wkuwaj, ale podstawy warto rozumieć.
:::

## O co zapytają dalej (nie z wideo)

:::task easy "Pula napisów i porównywanie napisów"
Czym `==` różni się od `equals` dla napisów? Czym jest pula napisów?
??? Odpowiedź
`==` porównuje referencje, `equals` — zawartość. Literały są przechowywane w puli napisów i używane ponownie, więc `"a" == "a"` może być `true`, ale `new String("a") == "a"` — `false`. Napisy porównuje się przez `equals`.
:::

:::task medium "Records, var, wyrażenia switch"
Czego ze współczesnej Javy (17–25) używasz?
??? Odpowiedź
`record` dla niezmiennych danych, `var`, bloki tekstowe `"""`, wyrażenia switch i pattern matching (`instanceof` ze zmienną, `switch` po typach, wzorce rekordów), hierarchie `sealed`, wątki wirtualne, Sequenced Collections, `Stream.toList()`.
:::

:::task medium "Jak zbudowana jest pamięć JVM?"
Sterta, stos i co gdzie leży.
??? Odpowiedź
Stos wątku — ramki wywołań, lokalne typy proste i referencje. Sterta — obiekty (wspólna dla wątków, sprzątana przez GC, pokolenia young/old). Metaspace — metadane klas. `StackOverflowError` — przepełnienie stosu (głęboka rekurencja), `OutOfMemoryError` — brak sterty/metaspace.
:::

:::task hard "Live coding"
Zaprojektuj bezpieczny wątkowo cache LRU na N elementów z metodami `get` i `put` i wyjaśnij złożoność operacji.
??? Odpowiedź
`LinkedHashMap` z `accessOrder = true` i `removeEldestEntry`, wszystkie metody pod jedną blokadą (`synchronized` lub `ReentrantLock`) — O(1). Przy dużej rywalizacji — gotowe biblioteki (Caffeine). Omów, dlaczego sama `ConcurrentHashMap` nie daje kolejności usuwania.
:::

## Co dalej

Gratulujemy ukończenia kursu! Przeszedłeś Java SE na poziomie wystarczającym na rozmowę na stanowisko Junior. Kolejne kroki: [Roadmap](#/roadmap) — czego jeszcze nauczyć się w Javie, [Kariera](#/page/career) — stos backendowy i rynek pracy, [AI](#/page/ai) — jak pracować z asystentami AI.
