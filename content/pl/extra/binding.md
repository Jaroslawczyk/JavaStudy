**Wiązanie** (binding) to moment, w którym rozstrzyga się, która dokładnie metoda lub pole zostanie użyte przy wywołaniu. **Statyczne (wczesne)** wiązanie odbywa się przy kompilacji, **dynamiczne (późne)** — w czasie działania. To właśnie wiązanie dynamiczne umożliwia polimorfizm.

## Wiązanie dynamiczne: metody nadpisane

```java
class Animal {
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    @Override void speak() { System.out.println("Hau"); }
}

Animal a = new Dog();     // typ zmiennej Animal, obiekt — Dog
a.speak();                // Hau — wybór według RZECZYWISTEGO typu obiektu
```

Kompilator sprawdza, że metoda `speak()` istnieje w typie `Animal`, a którą implementację wywołać, JVM decyduje w czasie działania według klasy obiektu (przez tablicę metod wirtualnych). Wszystkie niestatyczne, nieprywatne, niefinalne metody w Javie są wirtualne.

## Wiązanie statyczne

Rozstrzyga je kompilator według **zadeklarowanego typu** zmiennej:

| Co | Dlaczego statycznie |
|---|---|
| metody `static` | należą do klasy, nie są nadpisywane, lecz **przesłaniane** |
| metody `private` | niewidoczne dla podklas |
| metody `final` | nie da się ich nadpisać |
| **Przeciążanie** (wybór między `m(Object)` a `m(String)`) | wybór według typów argumentów przy kompilacji |
| **Pola** | nie są polimorficzne, też są przesłaniane |

```java
class Parent {
    String name = "parent";
    static String who() { return "Parent"; }
}
class Child extends Parent {
    String name = "child";                      // przesłania pole, a nie nadpisuje
    static String who() { return "Child"; }     // przesłania metodę statyczną
}

Parent p = new Child();
System.out.println(p.name);     // parent — pole według zadeklarowanego typu
System.out.println(p.who());    // Parent — static według zadeklarowanego typu (tak lepiej nie pisać)
```

## Przeciążanie rozstrzyga się przy kompilacji

```java
static void print(Object o) { System.out.println("Object"); }
static void print(String s) { System.out.println("String"); }

Object x = "hello";
print(x);                       // Object! — wybór według zadeklarowanego typu x, a nie wartości
```

Porównaj: **nadpisywanie** (override) — wybór implementacji w czasie działania według obiektu; **przeciążanie** (overload) — wybór sygnatury przy kompilacji według typów argumentów.

:::tip "@Override — zawsze"
Adnotacja `@Override` zmusza kompilator do sprawdzenia, że metoda naprawdę nadpisuje metodę rodzica. Literówka w nazwie lub parametrach (`equals(Car other)` zamiast `equals(Object o)`) bez niej zamienia się w niezauważalne **przeciążenie** — i `HashSet` przestaje działać.
:::

:::interview "Pytania rekrutacyjne"
**Czym jest wiązanie statyczne i dynamiczne?** — Statyczne — wybór metody/pola przez kompilator według zadeklarowanego typu (metody static, private, final, przeciążanie, pola). Dynamiczne — wybór implementacji nadpisanej metody w czasie działania według faktycznej klasy obiektu.

**Czy można nadpisać metodę statyczną?** — Nie, tylko przesłonić (method hiding): wywołanie zależy od zadeklarowanego typu, polimorfizmu nie ma.
:::

## Zadanie domowe

:::task easy "Override czy hide"
Utwórz `Parent` i `Child` z jednoimiennym polem, metodą statyczną i zwykłą metodą. Wypisz wyniki dla `Parent p = new Child()`, `Child c = new Child()` i `((Parent) c)`. Wypełnij tabelę „co się wywołało” i wyjaśnij.
:::

:::task medium "Pułapka przeciążania"
Są `void log(Object o)`, `void log(Integer i)`, `void log(long l)`. Co wywoła się dla `log(5)`, `log(5L)`, `log((Object) 5)`, `log(null)`? Najpierw przewidź (reguły: dokładne dopasowanie → poszerzenie typu prostego → autoboxing → varargs), potem sprawdź.
:::

:::task hard "Zepsuty equals"
Napisz klasę `Point` z metodą `public boolean equals(Point other)` (bez `@Override`). Pokaż, że `point1.equals(point2)` działa, a `list.contains(point2)` i `HashSet` — nie. Wyjaśnij przez statyczne wiązanie przeciążeń, napraw i dodaj `hashCode`.
:::
