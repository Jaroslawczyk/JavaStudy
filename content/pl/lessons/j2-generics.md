Drugą część kursu zaczynamy od **typów generycznych** (generics, typy parametryzowane). To mechanizm, dzięki któremu `List<String>` przechowuje tylko napisy, a kompilator wyłapuje błędy typów jeszcze przed uruchomieniem programu. Bez generyków nie przeczytasz żadnego współczesnego kodu w Javie: kolekcje, Stream API, Optional, Spring — wszystko na nich stoi.

## Znaczniki czasu wideo

- {{t j2 0:00}} — wstęp do drugiej części, nowy projekt
- {{t j2 0:10}} — klasa `Box` przechowująca `Object`
- {{t j2 3:18}} — `ClassCastException`: napis zamiast liczby
- {{t j2 5:40}} — klasa parametryzowana `Box<T>`
- {{t j2 8:31}} — wymazywanie typów (type erasure)
- {{t j2 9:31}} — kolekcje, które pisaliśmy, też można sparametryzować
- {{t j2 10:34}} — kilka parametrów: `Map<K, V>`
- {{t j2 11:22}} — `Box<K, V>` z dwoma typami
- {{t j2 13:27}} — parametr to tylko typ referencyjny (`Integer`, nie `int`)
- {{t j2 14:01}} — zadanie domowe: `Box` z trzema typami
- {{t j2 14:46}} — omówienie rozwiązania

## Problem: pojemnik na Object

Załóżmy, że potrzebujemy „pudełka”, które przechowa cokolwiek. Przed Javą 5 pisano tak:

```java
public class Box {
    private Object item;

    public Box(Object item) { this.item = item; }
    public Object getItem() { return item; }
}

Box box1 = new Box(5);
Box box2 = new Box("10");           // błąd, ale kompilator milczy
int sum = (Integer) box1.getItem() + (Integer) box2.getItem();
// ClassCastException: String cannot be cast to Integer — w trakcie działania!
```

Dwa problemy: **ręczne rzutowania** na każdym kroku i **błędy, które wychodzą dopiero przy uruchomieniu**.

## Rozwiązanie: parametr typu

```java
public class Box<T> {          // T — parametr typu (Type)
    private T item;

    public Box(T item) { this.item = item; }
    public T getItem() { return item; }
}

Box<Integer> box1 = new Box<>(5);
Box<Integer> box2 = new Box<>("10");   // ❌ błąd kompilacji — dokładnie tego chcemy
int sum = box1.getItem() + box2.getItem();  // bez rzutowań
```

- `T` to tylko nazwa zastępcza. Konwencja: `T` (type), `E` (element), `K`/`V` (key/value), `R` (result), `U`, `S` — dodatkowe typy.
- `<>` po prawej to **operator diamentu** (Java 7+): typ jest wywnioskowany z lewej strony.
- Parametrów może być kilka: `class Box<K, V>`, jak `Map<K, V>`.

```java
public class Pair<K, V> {
    private final K key;
    private final V value;
    public Pair(K key, V value) { this.key = key; this.value = value; }
    public K getKey() { return key; }
    public V getValue() { return value; }
}

Pair<String, Integer> age = new Pair<>("Anna", 30);
```

## Wymazywanie typów (type erasure)

Generyki istnieją **tylko dla kompilatora**. Po kompilacji `Box<Integer>` i `Box<String>` to ta sama klasa `Box`, a `T` zostaje zastąpione przez `Object` (lub przez ograniczenie, jeśli jest — zob. lekcję [Ograniczenia i wildcard](#/lessons/j2-bounded-wildcards)). Kompilator sam wstawia rzutowania tam, gdzie trzeba.

Konsekwencje, o które pytają na rozmowach:

| Nie wolno | Dlaczego |
|---|---|
| `new T()` | W czasie działania nie wiadomo, czym jest `T` |
| `new T[10]` | To samo; tablice „znają” swój typ w czasie działania |
| `obj instanceof Box<String>` | Brak informacji o `String` (można `instanceof Box<?>`) |
| `Box<int>` | Parametr to tylko typ referencyjny; użyj `Integer` (autoboxing) |
| Przeciążyć `m(List<String>)` i `m(List<Integer>)` | Po wymazaniu sygnatury są identyczne |
| Pole statyczne typu `T` | Statyka jest wspólna dla wszystkich `Box<…>`, a `T` każdy ma swoje |

:::interview "Pytanie rekrutacyjne"
**Czym jest type erasure?** — Kompilator sprawdza typy na podstawie generyków, a następnie wymazuje parametry typów: w bajtkodzie zostają typy „surowe” (`Object` lub górne ograniczenie), a rzutowania są wstawiane automatycznie. Dlatego w czasie działania `List<String>` i `List<Integer>` są nierozróżnialne. Zrobiono tak dla zgodności wstecznej z kodem sprzed Javy 5.
:::

## Czego nie ma w wideo

### Raw types — typy „surowe”

`Box box = new Box(5);` bez nawiasów kątowych to **raw type**. Zostawiono go dla zgodności, kompilator zgłasza ostrzeżenie `unchecked`. W nowym kodzie nie używaj raw types: tracisz całą kontrolę typów.

### `var` i generyki (Java 10+)

```java
var map = new HashMap<String, List<Integer>>();   // typ wywnioskowany z prawej strony
```

Z `var` nie można użyć pustego diamentu `<>` po prawej — kompilator nie ma z czego wywnioskować typu (wyjdzie `HashMap<Object, Object>`).

### Rekordy też mogą być generyczne

```java
record Pair<K, V>(K key, V value) {}          // Java 16+
var p = new Pair<>("Java", 25);
```

Więcej o rekordach — w artykule [Records](#/extra/records).

:::outdated "Jak dziś tworzy się małe kolekcje"
W wideo kolekcje tworzy się przez `new ArrayList<>()` i `add`. Dla małych niezmiennych zestawów od Javy 9 są fabryki: `List.of(1, 2, 3)`, `Set.of("a", "b")`, `Map.of("k", 1)`. Są krótsze i bezpieczniejsze (próba modyfikacji rzuci `UnsupportedOperationException`).
:::

:::note "Przyszłość: generyki dla typów prostych"
Na razie `List<int>` jest niemożliwe, a `List<Integer>` przechowuje opakowane obiekty — to dodatkowa pamięć i praca dla garbage collectora. Projekt **Valhalla** (value classes) od dawna przygotowuje rozwiązanie; w 2026 roku nie jest to jeszcze część stabilnej Javy. Dla dużych zbiorów liczb używaj `int[]` lub `IntStream`.
:::

## Zadanie domowe

:::task video "Pudełko z trzema typami — z wideo"
Rozbuduj klasę `Box` tak, by przechowywała trzy wartości **różnych** typów (np. `String`, `Integer`, `Float`), i policz sumę liczb z pudełka: `"a"`, `5`, `12.0f` → `17`. {{t j2 14:01}}
??? Podpowiedź
Trzy parametry: `class Box<T, V, S>`. Omówienie: {{t j2 14:46}}
:::

:::task easy "Pair i swap"
Napisz generyczną klasę `Pair<A, B>` i metodę `Pair<B, A> swap()`, która zwraca nową parę z zamienionymi elementami. Sprawdź na `Pair<String, Integer>`.
:::

:::task medium "Bezpieczny typowo cache"
Napisz klasę `TypedCache<K, V>` na bazie `HashMap<K, V>` z metodami `put`, `get` i `getOrDefault(K key, V def)`. Spróbuj włożyć napis do `TypedCache<String, Integer>` — upewnij się, że kod się nie kompiluje. Następnie przepisz na raw type `HashMap` i pokaż, jak ten sam błąd dochodzi do `ClassCastException`.
:::

:::task hard "Wymazywanie na własne oczy"
1) Utwórz `List<String>` i `List<Integer>`, porównaj `a.getClass() == b.getClass()` i wyjaśnij wynik. 2) Przez raw type włóż `Integer` do `List<String>` i znajdź wiersz, w którym program naprawdę się wywróci (nie tam, gdzie `add`!). 3) Skompiluj `Box<T>` i obejrzyj bajtkod poleceniem `javap -c Box` — znajdź `Object` i `checkcast`.
??? Podpowiedź
`ClassCastException` wystąpi przy odczycie, gdzie kompilator wstawił ukryty `checkcast`, np. `String s = list.get(0);`.
:::
