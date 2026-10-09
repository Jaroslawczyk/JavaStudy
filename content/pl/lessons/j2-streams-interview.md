Krótka „rozmowa rekrutacyjna” z lambd i Stream API. Autor zauważa, że ten temat rzadko jest odpytywany dogłębnie — najważniejsze to umieć korzystać ze strumieni. Ale podstawowe pytania trzeba znać pewnie, a na live codingu strumienie pojawiają się stale.

## Znaczniki czasu wideo

- {{t j2 5:13:27}} — początek rozmowy
- {{t j2 5:13:32}} — interfejs funkcyjny, `stream()`, po co strumienie
- {{t j2 5:14:28}} — sposoby tworzenia strumieni
- {{t j2 5:14:42}} — operacje końcowe i pośrednie
- {{t j2 5:15:43}} — `map`, `Optional`, `filter`
- {{t j2 5:16:56}} — jak `sorted()` sortuje obiekty
- {{t j2 5:17:37}} — koniec działu

## Pytania

:::task video "1. Czym jest interfejs funkcyjny?"
{{t j2 5:13:32}}
??? Odpowiedź
Interfejsem z dokładnie jedną metodą abstrakcyjną (`default`/`static` się nie liczą). Tylko jego można zaimplementować lambdą lub referencją do metody. Oznacza się go `@FunctionalInterface`. Przykłady: `Runnable`, `Comparator`, `Predicate`, `Function`.
:::

:::task video "2. Co robi metoda stream()?"
{{t j2 5:13:42}}
??? Odpowiedź
Tworzy z kolekcji sekwencyjny strumień — przepływ elementów do przetwarzania taśmowego. Sama kolekcja się nie zmienia.
:::

:::task video "3. Po co zamieniać kolekcje na strumienie?"
{{t j2 5:13:54}}
??? Odpowiedź
Żeby zwięźle i deklaratywnie opisać filtrowanie, przekształcanie, sortowanie, grupowanie bez kolekcji pośrednich; leniwe wykonanie z zatrzymaniem (`limit`, `findFirst`); proste zrównoleglenie przez `parallelStream()`.
:::

:::task video "4. Jakie znasz sposoby tworzenia strumieni?"
{{t j2 5:14:28}}
??? Odpowiedź
`collection.stream()/parallelStream()`, `Arrays.stream(array)`, `Stream.of(...)`, `Stream.iterate`, `Stream.generate`, `IntStream.range`, `Files.lines(path)`, `String.chars()`, `Stream.empty()`, `Stream.ofNullable` (9).
:::

:::task video "5. Czym operacja końcowa różni się od pośredniej?"
{{t j2 5:14:42}}
??? Odpowiedź
Pośrednia zwraca `Stream` i jest leniwa; w łańcuchu może ich być dowolnie wiele. Końcowa zwraca wynik (lub `void`), uruchamia cały taśmociąg i zamyka strumień; jest jedna i na końcu.
:::

:::task video "6. Przykłady operacji końcowych i pośrednich"
{{t j2 5:15:19}}
??? Odpowiedź
Końcowe: `collect`, `toList`, `count`, `min`/`max`, `forEach`, `reduce`, `anyMatch`, `findFirst`. Pośrednie: `filter`, `map`, `flatMap`, `sorted`, `distinct`, `limit`, `skip`, `peek`.
:::

:::task video "7. Co robi map?"
{{t j2 5:15:43}}
??? Odpowiedź
Stosuje funkcję do każdego elementu; typ wyniku może różnić się od wyjściowego (`Stream<User>` → `Stream<String>`).
:::

:::task video "8. Optional — co to jest i jaki ma związek ze strumieniami?"
{{t j2 5:15:55}}
??? Odpowiedź
Pojemnik na wartość, której może nie być. Operacje `findFirst`, `findAny`, `min`, `max`, `reduce` bez wartości początkowej zwracają `Optional`, bo strumień może być pusty. Wartość wyjmuje się przez `orElse…`, `ifPresent…`, `map`.
:::

:::task video "9. Jak działa filter?"
{{t j2 5:16:33}}
??? Odpowiedź
Przyjmuje `Predicate` i przepuszcza dalej tylko elementy, dla których zwrócił `true`.
:::

:::task video "10. Jak sorted() sortuje obiekty naszej klasy?"
{{t j2 5:16:56}}
??? Odpowiedź
Bez argumentów — według porządku naturalnego: klasa musi implementować `Comparable`, inaczej `ClassCastException`. Albo przekazać `Comparator`: `sorted(Comparator.comparing(User::name))`.
:::

## Dodatkowe pytania (nie z wideo)

:::task easy "map vs flatMap"
Czym się różnią?
??? Odpowiedź
`map` — jeden element w jeden. `flatMap` — jeden element w strumień elementów, które są „spłaszczane” do wspólnego strumienia: `List<List<T>>` → `Stream<T>`.
:::

:::task medium "Dlaczego strumienia nie można użyć ponownie?"
I co się stanie przy próbie?
??? Odpowiedź
Strumień to jednorazowy opis obliczenia nad źródłem; po operacji końcowej jest zamknięty, ponowne wywołanie rzuca `IllegalStateException`. Potrzebny jest nowy strumień ze źródła.
:::

:::task medium "Collectors.toList() vs Stream.toList()"
Jaka jest różnica?
??? Odpowiedź
`Stream.toList()` (Java 16) zwraca listę niezmienną i dopuszcza elementy `null`. `Collectors.toList()` zwraca listę zmienną (w praktyce `ArrayList`, ale bez gwarancji w specyfikacji).
:::

:::task hard "Live coding: grupowanie"
Dana jest `List<Order(String customer, double amount)>`. Jednym wyrażeniem otrzymaj `Map<String, Double>` — sumę zamówień według klientów, posortowaną malejąco według sumy.
??? Odpowiedź
`orders.stream().collect(groupingBy(Order::customer, summingDouble(Order::amount))).entrySet().stream().sorted(Map.Entry.<String, Double>comparingByValue().reversed()).collect(toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new))` — `LinkedHashMap` zachowuje kolejność sortowania.
:::
