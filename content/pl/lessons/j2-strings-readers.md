Trzy tematy w jednej lekcji: dlaczego napisów nie wolno sklejać w pętli (`String` jest niezmienny) i co zamiast tego — `StringBuilder`; jak przyspieszyć odczyt dziesiątki razy dzięki buforowi; i dlaczego cyrylica zamienia się w „krzaczki” — **kodowania** i klasy `Reader`.

## Znaczniki czasu wideo

- {{t j2 5:41:34}} — zbieramy przeczytane dane w napis przez `+=`
- {{t j2 5:42:25}} — tak nie wolno: `String` jest niezmienny
- {{t j2 5:43:52}} — `StringBuilder` i `append()`
- {{t j2 5:44:59}} — `StringBuffer` — odpowiednik bezpieczny wątkowo
- {{t j2 5:45:33}} — duży plik z Lorem Ipsum (12 MB)
- {{t j2 5:46:57}} — odczyt bajt po bajcie: prawie 51 sekund
- {{t j2 5:47:27}} — `read(byte[])`: czytamy od razu tablicą
- {{t j2 5:49:12}} — 1,5 sekundy — 30–40 razy szybciej
- {{t j2 5:49:44}} — „śmieci” z poprzedniego odczytu w buforze
- {{t j2 5:51:07}} — `new String(array, 0, count)`
- {{t j2 5:51:45}} — cyrylica psuje się przy odczycie bajtowym
- {{t j2 5:52:43}} — `Reader` czyta znaki, a nie bajty
- {{t j2 5:53:06}} — `InputStreamReader` — opakowanie na `InputStream`
- {{t j2 5:54:13}} — podajemy kodowanie: `StandardCharsets.UTF_8`
- {{t j2 5:54:54}} — podsumowanie lekcji
- {{t j2 5:55:31}} — zadanie domowe: imiona na „A”
- {{t j2 5:56:22}} — omówienie rozwiązania
- {{t j2 5:57:56}} — `split(" ")`

## String jest niezmienny

```java
String s = "Hello";
s = s + " world";     // stary obiekt się nie zmienił — utworzono NOWY "Hello world"
```

Sklejanie w pętli tworzy nowy napis w każdej iteracji i kopiuje do niego wszystko, co się zebrało — dla tekstu długości n to O(n²) operacji i góra śmieci dla GC.

```java
StringBuilder sb = new StringBuilder();
for (…) sb.append((char) b);         // zmienia wewnętrzny bufor
String result = sb.toString();
```

| | `String` | `StringBuilder` | `StringBuffer` |
|---|---|---|---|
| Zmienny | ❌ | ✅ | ✅ |
| Bezpieczny wątkowo | ✅ (niezmienny) | ❌ | ✅ (`synchronized`) |
| Kiedy | prawie zawsze | budowanie napisu w jednym wątku | w praktyce prawie nigdy |

:::interview "Pytanie rekrutacyjne"
**Czym różnią się `StringBuilder` i `StringBuffer`?** — Oba są zmiennymi napisami. Metody `StringBuffer` są synchronizowane (bezpieczny wątkowo, wolniejszy), `StringBuilder` — nie. We współczesnym kodzie używa się `StringBuilder`: budowanie jednego napisu z kilku wątków prawie nie jest potrzebne.
:::

:::note "A `+` poza pętlą?"
`String s = a + ":" + b;` — w porządku. Kompilator optymalizuje pojedyncze sklejenie (od Javy 9 — przez `invokedynamic`/`StringConcatFactory`). Problem jest tylko z akumulowaniem w pętli. Do sklejania kolekcji są `String.join(", ", list)` i `Collectors.joining`.
:::

## Odczyt tablicą

Każde `read()` to wywołanie systemu operacyjnego, a to kosztowne. `read(byte[])` w jednym wywołaniu wypełnia całą tablicę:

```java
try (InputStream in = new FileInputStream(file)) {
    byte[] buffer = new byte[8192];                 // wielokrotność 1024
    StringBuilder sb = new StringBuilder();
    int count;
    while ((count = in.read(buffer)) > 0) {
        sb.append(new String(buffer, 0, count));    // tylko przeczytana część!
    }
}
```

`read(byte[])` zwraca, **ile bajtów przeczytano** (ostatnim razem — mniej niż rozmiar tablicy, potem −1). Jeśli utworzyć napis z całej tablicy, na końcu znajdą się „śmieci” z poprzedniego odczytu ({{t j2 5:49:44}}).

## Kodowania i Reader

Znak ≠ bajt. W **UTF-8** alfabet łaciński zajmuje 1 bajt, polskie znaki diakrytyczne i cyrylica — 2, emoji — 4. Przy odczycie bajt po bajcie z rzutowaniem `(char) b` każdy bajt takiego znaku staje się osobnym „znakiem” — wychodzą krzaczki.

`Reader` czyta **znaki**: sam dekoduje bajty według kodowania.

```java
try (Reader reader = new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8)) {
    char[] buffer = new char[128];                  // dla Reader — char[], a nie byte[]
    StringBuilder sb = new StringBuilder();
    int count;
    while ((count = reader.read(buffer)) > 0) {
        sb.append(buffer, 0, count);
    }
}
```

`InputStreamReader` to **most** od bajtów do znaków: opakowuje dowolny `InputStream`.

:::outdated "Kodowanie domyślne to UTF-8 dopiero od Javy 18"
W wideo powiedziano, że readery domyślnie używają UTF-8. To prawda **od Javy 18** (JEP 400). Wcześniej domyślne było kodowanie systemowe: w polskim Windows — `windows-1250`, w rosyjskim — `windows-1251`, i ten sam kod dawał krzaczki na jednej maszynie, a działał na innej. Zasada dla każdej wersji: **zawsze podawaj kodowanie jawnie** — `StandardCharsets.UTF_8`.
:::

:::warning "Niebezpieczeństwo new String(buffer, 0, count) dla UTF-8"
Jeśli czytasz plik UTF-8 **bajtami** porcjami i każdą porcję zamieniasz w napis, znak wielobajtowy może zostać przecięty granicą bufora — wyjdzie `�`. Tekst czytaj przez `Reader` (uwzględnia granice znaków) albo cały plik od razu.
:::

## Czego nie ma w wideo

- **`BufferedReader.readLine()`** — klasyka odczytu wierszami; `reader.lines()` — strumień wierszy.
- **Współcześnie:** `Files.readString(path)` (domyślnie UTF-8), `Files.readAllLines`, `Files.lines` (leniwy strumień, zamykać w try-with-resources), `Files.newBufferedReader(path, charset)`.
- **`String.split` przyjmuje wyrażenie regularne:** `split(".")` zwróci pustą tablicę — kropkę trzeba poprzedzić ukośnikiem `split("\\.")`; dla spacji pewniej `split("\\s+")`. Więcej — w artykule [Regex](#/extra/regex).

## Zadanie domowe

:::task video "Imiona na literę A — z wideo"
Utwórz plik z imionami w jednym wierszu oddzielonymi spacją. Przeczytaj go przez `Reader` z odczytem do tablicy `char[]`, zbierz w napis, podziel `split(" ")` na tablicę, przez strumień zostaw imiona na „A” i wypisz. {{t j2 5:55:31}}
??? Podpowiedź
`Arrays.stream(names).filter(n -> n.startsWith("A")).forEach(System.out::println)`. Omówienie: {{t j2 5:56:22}}
:::

:::task easy "Ile kosztuje +="
Zbuduj napis ze 100 000 znaków przez `+=` i przez `StringBuilder`. Zmierz czas `System.nanoTime()`. Potem przez `String.join` i `Collectors.joining`.
:::

:::task medium "Krzaczki własnoręcznie"
Zapisz napis „Zażółć gęślą jaźń” do pliku w `windows-1250` (`Files.writeString(path, s, Charset.forName("windows-1250"))`). Przeczytaj go jako UTF-8, jako windows-1250 i jako ISO-8859-1. Wyjaśnij, co wyszło w każdym przypadku i ile bajtów zajmuje plik w każdym kodowaniu.
:::

:::task hard "Statystyka tekstu"
Przeczytaj duży tekst (UTF-8, po polsku) przez `BufferedReader` wierszami i policz: liczbę wierszy, słów, znaków, najczęstszą literę i 10 najdłuższych słów. Porównaj czas z `Files.readString` + Stream API. Upewnij się, że wynik jest identyczny, a polskie znaki nie sprawiają problemów.
:::
