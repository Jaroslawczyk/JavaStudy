„W Javie obiekty przekazuje się przez referencję, a typy proste przez wartość” — popularne, ale **nieścisłe** stwierdzenie. Poprawnie: **w Javie wszystko przekazuje się przez wartość**. Po prostu dla obiektów wartością jest referencja. Zobaczmy, dlaczego metoda może zmienić obiekt, ale nie może go „podmienić”.

## Typy proste

```java
static void increment(int x) {
    x++;                          // zmieniamy KOPIĘ
}

int a = 5;
increment(a);
System.out.println(a);            // 5
```

## Referencje do obiektów

Zmienna typu referencyjnego przechowuje nie obiekt, lecz **referencję** (adres) do obiektu na stercie. Przy wywołaniu metody kopiowana jest ta referencja.

```java
static void rename(Car car) {
    car.setName("BMW");           // przez kopię referencji zmieniamy TEN SAM obiekt
}

static void replace(Car car) {
    car = new Car("Audi");        // zmieniamy tylko kopię referencji
}

Car myCar = new Car("Fiat");
rename(myCar);
System.out.println(myCar.getName());   // BMW — obiekt się zmienił
replace(myCar);
System.out.println(myCar.getName());   // BMW — podmiany nie widać na zewnątrz
```

```
przed wywołaniem:  myCar ──┐
                           ▼
                      [Car "Fiat"]
w rename:          car ────┘   (dwie referencje do jednego obiektu)

w replace:         car ──▶ [Car "Audi"]    myCar nadal ──▶ [Car "BMW"]
```

## Klasyczny test: swap

```java
static void swap(Integer a, Integer b) {
    Integer tmp = a; a = b; b = tmp;      // zamieniliśmy kopie referencji
}

Integer x = 1, y = 2;
swap(x, y);
System.out.println(x + " " + y);          // 1 2 — nic się nie zmieniło
```

W języku z prawdziwym przekazywaniem przez referencję (C++ `int&`, C# `ref`) `swap` by zadziałał. W Javie takiego `swap` nie da się napisać — i to jest dowód przekazywania przez wartość.

## Obiekty niezmienne

```java
static void append(String s) { s = s + "!"; }

String text = "Hi";
append(text);
System.out.println(text);                  // Hi
```

`String`, `Integer` i inne opakowania są niezmienne: „zmiana” tworzy nowy obiekt, a nowa referencja zostaje w lokalnej kopii.

## Jak zwrócić kilka wartości lub „zmienić” argument

- Zwrócić wynik: `x = increment(x);`
- Zwrócić kilka wartości — `record Result(int min, int max)`.
- Przekazać zmienny pojemnik (tablicę, `AtomicInteger`, własny obiekt) — metoda zmieni jego zawartość.

:::interview "Pytanie rekrutacyjne"
**W Javie przekazywanie jest przez referencję czy przez wartość?** — Zawsze przez wartość. Dla typów referencyjnych kopiowana jest wartość referencji, więc metoda może zmienić stan przekazanego obiektu, ale nie może sprawić, by zmienna w kodzie wywołującym wskazywała na inny obiekt.
:::

## Zadanie domowe

:::task easy "Przewidź wynik"
Napisz trzy metody: zmieniającą `int`, zmieniającą element tablicy `int[]` i przypisującą parametrowi-tablicy nową tablicę. Przewidź wynik po każdym wywołaniu i sprawdź.
:::

:::task medium "Kopia obronna"
Klasa `Team` z polem `List<String> members` i konstruktorem `Team(List<String> members)`. Pokaż, że kod zewnętrzny może zmienić skład zespołu przez oryginalną listę i przez getter. Napraw za pomocą `List.copyOf` w konstruktorze i niemodyfikowalnego widoku w getterze.
:::

:::task hard "Działający swap"
Zaimplementuj trzy „działające” warianty zamiany wartości dwóch zmiennych z metody: przez tablicę-opakowanie `int[2]`, przez zmienną klasę `Holder<T>` i przez zwrócenie `record Pair`. Wyjaśnij, dlaczego żaden z nich nie przeczy temu, że Java przekazuje argumenty przez wartość.
:::
