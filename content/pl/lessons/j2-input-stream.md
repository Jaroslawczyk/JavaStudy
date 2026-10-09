Czytamy dane z pliku. Wszystko w komputerze to bajty, więc podstawowe narzędzie odczytu to **strumień bajtów** `InputStream`. Omawiamy `FileInputStream`, metodę `read()`, obowiązkowe zamykanie zasobów i konstrukcję **try-with-resources**, która robi to automatycznie.

## Znaczniki czasu wideo

- {{t j2 5:31:01}} — odczyt plików: wszystko składa się z bajtów
- {{t j2 5:31:47}} — klasa abstrakcyjna `InputStream` i `FileInputStream`
- {{t j2 5:32:34}} — tworzymy plik z tekstem (na razie tylko alfabet łaciński)
- {{t j2 5:33:27}} — `read()`: bajt 0–255 lub −1 na końcu
- {{t j2 5:34:43}} — czytamy w pętli, rzutujemy na `char`
- {{t j2 5:35:14}} — strumień trzeba zamykać: `close()`
- {{t j2 5:35:57}} — zamykanie w `finally`: niewygodne
- {{t j2 5:37:02}} — try-with-resources
- {{t j2 5:37:40}} — działa z dowolnym `Closeable`/`AutoCloseable`
- {{t j2 5:38:11}} — podsumowanie lekcji
- {{t j2 5:38:36}} — zadanie domowe: plik z imionami
- {{t j2 5:39:05}} — omówienie rozwiązania

## InputStream i FileInputStream

„Strumień” to tu nie `Thread` ani `Stream` ze Stream API, lecz ciąg bajtów czytanych po kolei.

```java
try (InputStream in = new FileInputStream("file1.txt")) {
    int b = in.read();                  // 0..255 albo -1 — dane się skończyły
    while (b != -1) {
        System.out.print((char) b);     // dla alfabetu łacińskiego bajt = znak
        b = in.read();
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

Dlaczego `read()` zwraca `int`, a nie `byte`? Bajt w Javie jest ze znakiem (−128…127), a wtedy nie dałoby się odróżnić prawdziwego bajtu `-1` (`0xFF`) od „końca pliku”. Dlatego wartość zwraca się w zakresie 0–255, a −1 to specjalny sygnał.

## Zamykanie zasobów

Otwarty strumień trzyma zasób systemu operacyjnego (deskryptor pliku). Niezamknięte strumienie to wyciek: pewnego dnia system odmówi otwarcia nowych plików, a w Windows otwartego pliku nie da się usunąć.

Przed Javą 7 pisano tak:

```java
InputStream in = null;
try {
    in = new FileInputStream(file);
    // odczyt…
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (in != null) {
        try { in.close(); } catch (IOException e) { e.printStackTrace(); }
    }
}
```

## try-with-resources (Java 7+)

```java
try (InputStream in = new FileInputStream(file);
     OutputStream out = new FileOutputStream(copy)) {   // kilka zasobów przez ;
    in.transferTo(out);                                  // Java 9: kopiowanie jedną linijką
}
```

- Zasoby są zamykane **automatycznie** przy wyjściu z bloku — zarówno przy normalnym zakończeniu, jak i przy wyjątku.
- Zamykane są **w odwrotnej kolejności** deklaracji.
- Zasób musi implementować **`AutoCloseable`** (wideo mówi `Closeable` — to jego podinterfejs dla I/O; pasują oba).
- Jeśli wyjątek wystąpi i w ciele, i w `close()`, drugi nie ginie — dołączany jest jako **suppressed**: `e.getSuppressed()`.
- Od Javy 9 można wskazać już zadeklarowaną zmienną effectively final: `try (in) { … }`.

:::interview "Pytanie rekrutacyjne"
**Czym jest try-with-resources i po co?** — Konstrukcją, w której zasoby zadeklarowane w nawiasach po `try` są automatycznie zamykane wywołaniem `close()` przy wyjściu z bloku. Działa z dowolnym `AutoCloseable`. Zastępuje niewygodne `finally` ze sprawdzaniem na `null`, poprawnie obsługuje wyjątki przy zamykaniu (suppressed).
:::

## Czego nie ma w wideo

- **`readAllBytes()`** (Java 9) — wczytać cały strumień do tablicy; **`readNBytes(n)`** (11), **`transferTo(out)`** (9).
- **Hierarchia:** `InputStream` ← `FileInputStream`, `ByteArrayInputStream`, `BufferedInputStream`, `ObjectInputStream`, `System.in`… Opakowania (dekoratory) dodają możliwości bazowemu strumieniowi — to wzorzec **Decorator**.
- **Współcześnie dla plików tekstowych:** `Files.readString(path)` lub `Files.readAllLines(path)` — otwarcie, odczyt i zamknięcie w jednej linii.

## Zadanie domowe

:::task video "Plik z imionami — z wideo"
Utwórz folder, a w nim plik, wpisz (ręcznie) kilka imion alfabetem łacińskim. Przeczytaj plik przez `FileInputStream` w try-with-resources i wypisz zawartość w konsoli. {{t j2 5:38:36}}
??? Podpowiedź
`new File(dir, "names.txt")` tworzy plik wewnątrz folderu. Czytaj `read()` do −1. Omówienie: {{t j2 5:39:05}}
:::

:::task easy "Liczenie bajtów"
Policz, ile bajtów ma plik i ile z nich to znaki nowej linii (`'\n'`). Porównaj wynik z `file.length()` / `Files.size(path)`.
:::

:::task medium "Własny zasób"
Napisz klasę `Connection implements AutoCloseable`, która wypisuje „otwarte”/„zamknięte”. Użyj dwóch takich zasobów w jednym try-with-resources i rzuć wyjątek w ciele i w `close()`. Wypisz główny wyjątek i `getSuppressed()`. W jakiej kolejności zamknęły się zasoby?
:::

:::task hard "Kopiowanie pliku"
Napisz `copy(Path src, Path dst)` na trzy sposoby: bajt po bajcie przez `read()`/`write(int)`, przez bufor `byte[8192]`, przez `in.transferTo(out)`. Porównaj czas na pliku 100 MB i sprawdź kopie hashem SHA-256 (`MessageDigest`).
:::
