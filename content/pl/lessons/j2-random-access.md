Krótka lekcja: przegląd klas znakowego wejścia-wyjścia (`Reader`/`Writer` i ich podklasy) oraz **`RandomAccessFile`** — plik o dostępie swobodnym, w którym można „przeskoczyć” do dowolnej pozycji, przeczytać lub nadpisać dane. W zadaniu domowym — „czytnik” książki według numeru strony.

## Znaczniki czasu wideo

- {{t j2 6:16:51}} — powtórka: strumienie bajtów i bufory
- {{t j2 6:17:42}} — strumienie znakowe: `Reader`, `Writer`, `FileReader`, `FileWriter`
- {{t j2 6:18:01}} — `BufferedReader`, `BufferedWriter`, `InputStreamReader`, `OutputStreamWriter`
- {{t j2 6:18:30}} — zadanie: przeczytać dane ze środka pliku
- {{t j2 6:19:23}} — `RandomAccessFile` i tryby `"r"`, `"rw"`
- {{t j2 6:20:11}} — `seek()`: przejście do pozycji
- {{t j2 6:20:24}} — `writeBytes()`: gwiazdki w środku pliku
- {{t j2 6:21:19}} — odczyt od pozycji 5000 i powrót na początek
- {{t j2 6:22:43}} — zadanie domowe: strona według numeru
- {{t j2 6:23:39}} — omówienie rozwiązania

## Mapa klas wejścia-wyjścia

| | Wejście | Wyjście |
|---|---|---|
| **Bajty** (abstrakcyjne) | `InputStream` | `OutputStream` |
| Plik | `FileInputStream` | `FileOutputStream` |
| Bufor | `BufferedInputStream` | `BufferedOutputStream` |
| **Znaki** (abstrakcyjne) | `Reader` | `Writer` |
| Plik | `FileReader` | `FileWriter` |
| Bufor | `BufferedReader` (`readLine`) | `BufferedWriter` (`newLine`) |
| Most bajty ↔ znaki | `InputStreamReader` | `OutputStreamWriter` |
| Obiekty | `ObjectInputStream` | `ObjectOutputStream` |

Opakowania zagnieżdża się jedno w drugim (wzorzec Decorator):

```java
try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

:::outdated "FileReader/FileWriter a kodowanie"
Przed Javą 11 w `FileReader`/`FileWriter` nie dało się podać kodowania — brały systemowe (zob. [lekcję o kodowaniach](#/lessons/j2-strings-readers)). Od Javy 11 są konstruktory `new FileReader(file, StandardCharsets.UTF_8)`. Jeszcze prościej — `Files.newBufferedReader(path)` / `Files.newBufferedWriter(path)` (domyślnie UTF-8).
:::

## RandomAccessFile

Zwykłe strumienie czytają ściśle po kolei i nie potrafią wracać. `RandomAccessFile` przechowuje **wskaźnik pozycji**, który można przesuwać:

```java
try (RandomAccessFile raf = new RandomAccessFile(file, "rw")) {   // "r" — tylko odczyt
    raf.seek(10);                    // przejść do bajtu 10
    raf.writeBytes("*****");         // nadpisać 5 bajtów (nie wstawić!)

    raf.seek(5000);
    byte[] buffer = new byte[1024];
    int count = raf.read(buffer);
    System.out.println(new String(buffer, 0, count, StandardCharsets.UTF_8));

    raf.seek(0);                     // znowu na początek
    System.out.println("Długość: " + raf.length() + ", pozycja: " + raf.getFilePointer());
}
```

- Zapis w środek **nadpisuje** bajty, a nie rozsuwa pliku.
- Są metody dla typów prostych: `readInt`, `writeLong`, `readDouble`… — wygodne dla formatów binarnych z rekordami stałej długości (domowa baza danych, indeksy).
- `"rws"`/`"rwd"` — synchroniczny zapis na dysk przy każdej zmianie.

:::interview "Pytanie rekrutacyjne"
**Po co jest `RandomAccessFile`?** — Do swobodnego dostępu do zawartości pliku: `seek()` przesuwa wskaźnik do potrzebnej pozycji, gdzie można czytać i zmieniać dane bez ponownego czytania pliku od początku.
:::

## Czego nie ma w wideo

- **`FileChannel`** (NIO) — współczesna alternatywa: `channel.position(n)`, odczyt do `ByteBuffer`, `transferTo` między kanałami bez kopiowania do pamięci Javy.
- **Pliki mapowane w pamięci:** `channel.map(READ_ONLY, 0, size)` — plik jest odwzorowany w pamięci, system ładuje strony na żądanie. Tak działa wiele baz danych i brokerów komunikatów (np. Kafka mocno opiera się na page cache).
- **Pozycja w bajtach, a nie w znakach.** Dla UTF-8 przejście do „znaku nr 1000” jest niemożliwe bez przeczytania wszystkiego, co przed nim — `seek` może trafić w środek znaku wielobajtowego.

## Zadanie domowe

:::task video "Strona książki — z wideo"
Utwórz duży plik tekstowy. Program pyta o numer strony (strona = 3000 bajtów) i wypisuje jej tekst; po wpisaniu `stop` kończy działanie. Użyj `RandomAccessFile` i `Scanner`. {{t j2 6:22:43}}
??? Podpowiedź
`raf.seek((page - 1) * 3000L)`, czytamy do `byte[3000]`, wypisujemy `new String(buf, 0, count)`. Omówienie: {{t j2 6:23:39}}
:::

:::task easy "Ostatnie 10 wierszy"
Jak `tail`: wypisz ostatnie 10 wierszy dużego pliku, nie czytając go w całości. Przesuwaj się `seek` od końca pliku wstecz blokami po 4 KB, licząc `'\n'`.
:::

:::task medium "Plik rekordów stałej długości"
Zapisz do pliku binarnego 1000 rekordów `(int id, double balance)` — po 12 bajtów. Napisz metody `read(int index)` i `updateBalance(int index, double value)`, które od razu skaczą do właściwego rekordu przez `seek(index * 12L)`. Sprawdź, że zmiana jednego rekordu nie rusza sąsiednich.
:::

:::task hard "Stronicowanie UTF-8"
Rozbuduj „czytnik”: strona = 3000 bajtów, ale granica nie może przecinać wielobajtowego znaku UTF-8. Podpowiedź: bajty kontynuacji UTF-8 mają postać `10xxxxxx` (`(b & 0xC0) == 0x80`) — przesuwaj granicę strony wstecz, aż trafisz na początek znaku. Sprawdź na polskim tekście.
:::
