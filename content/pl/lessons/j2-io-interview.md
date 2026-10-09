„Rozmowa rekrutacyjna” z wejścia-wyjścia i serializacji. Autor bierze po kilka pytań z każdego poddziału — tak samo robią prawdziwi rekruterzy. Odpowiedzi uzupełniono o współczesne API (NIO.2).

## Znaczniki czasu wideo

- {{t j2 6:51:12}} — początek rozmowy
- {{t j2 6:51:28}} — pliki i foldery
- {{t j2 6:52:07}} — `InputStream`, `OutputStream`, `Reader`, `Writer`
- {{t j2 6:52:52}} — bufory i `RandomAccessFile`
- {{t j2 6:53:13}} — serializacja, `transient`, `Externalizable`
- {{t j2 6:54:44}} — try-with-resources
- {{t j2 6:55:21}} — koniec działu

## Pytania

:::task video "1. Jak utworzyć nowy plik?"
{{t j2 6:51:28}}
??? Odpowiedź
`new File(path).createNewFile()` (folder musi istnieć). Współcześnie: `Files.createFile(Path.of(path))` albo od razu `Files.writeString(path, text)`.
:::

:::task video "2. Jak utworzyć folder?"
{{t j2 6:51:35}}
??? Odpowiedź
`mkdir()` — jeden folder, `mkdirs()` — cały łańcuch. NIO: `Files.createDirectory` / `Files.createDirectories`.
:::

:::task video "3. Jak pobrać listę plików w folderze?"
{{t j2 6:51:46}}
??? Odpowiedź
`list()` — tablica nazw, `listFiles()` — tablica `File`; obie przyjmują filtr. NIO: `Files.list(dir)` (strumień, zamykać) lub `Files.walk` do przechodzenia rekurencyjnego.
:::

:::task video "4. Co łączy i czym różnią się InputStream, OutputStream, Reader, Writer?"
{{t j2 6:52:07}}
??? Odpowiedź
Wszystkie to abstrakcyjne klasy wejścia-wyjścia. `InputStream`/`OutputStream` pracują z **bajtami**, `Reader`/`Writer` — ze **znakami** (uwzględniają kodowanie). `InputStream`/`Reader` to wejście, `OutputStream`/`Writer` — wyjście.
:::

:::task video "5. Jak zamienić dane z pliku w strumień bajtów?"
{{t j2 6:52:33}}
??? Odpowiedź
`new FileInputStream(file)` albo `Files.newInputStream(path)`.
:::

:::task video "6. Jakie klasy przyspieszają odczyt/zapis dzięki buforowi?"
{{t j2 6:52:39}}
??? Odpowiedź
`BufferedInputStream`, `BufferedOutputStream`, `BufferedReader`, `BufferedWriter`.
:::

:::task video "7. Po co jest RandomAccessFile?"
{{t j2 6:52:52}}
??? Odpowiedź
Swobodny dostęp do zawartości pliku: `seek()` przesuwa wskaźnik, można czytać i nadpisywać dane w dowolnej pozycji.
:::

:::task video "8. Czym są serializacja i deserializacja?"
{{t j2 6:53:13}}
??? Odpowiedź
Serializacja — zamiana obiektu (grafu obiektów) w strumień bajtów; deserializacja — utworzenie obiektu ze strumienia bajtów.
:::

:::task video "9. Jakie warunki muszą być spełnione, by obiekt dało się serializować?"
{{t j2 6:53:33}}
??? Odpowiedź
Klasa implementuje `Serializable` lub `Externalizable`; wszystkie niestatyczne pola są serializowalne lub `transient`; pierwszy nieserializowalny przodek ma dostępny konstruktor bezparametrowy.
:::

:::task video "10. Do czego służy słowo kluczowe transient?"
{{t j2 6:53:58}}
??? Odpowiedź
Wyłącza pole z serializacji; po odtworzeniu ma ono wartość domyślną. Stosuje się je do haseł, cache, nieserializowalnych zasobów (połączeń, strumieni).
:::

:::task video "11. Czym różnią się Serializable i Externalizable?"
{{t j2 6:54:03}}
??? Odpowiedź
`Serializable` to znacznik, serializacja jest automatyczna, konstruktor przy odczycie nie jest wywoływany. W `Externalizable` sam implementujesz `writeExternal`/`readExternal`, przy odczycie wywoływany jest public konstruktor bezparametrowy.
:::

:::task video "12. Czym jest try-with-resources?"
{{t j2 6:54:44}}
??? Odpowiedź
Konstrukcja `try (zasoby) { … }`: zasoby (`AutoCloseable`) są zamykane automatycznie w odwrotnej kolejności przy wyjściu z bloku; wyjątki z `close()` dołączane są jako suppressed.
:::

## Dodatkowe pytania (nie z wideo)

:::task easy "Czym jest serialVersionUID?"
Po co deklarować go ręcznie?
??? Odpowiedź
Numer wersji klasy, który JVM porównuje przy deserializacji. Automatyczny zależy od struktury klasy i kompilatora, więc każda zmiana psuje zgodność. Jawna deklaracja (`@Serial private static final long serialVersionUID = 1L;`) daje kontrolę nad zgodnością wersji.
:::

:::task medium "java.io vs java.nio"
Czym się różnią?
??? Odpowiedź
`java.io` — strumieniowe, blokujące API (bajty/znaki po kolei). `java.nio` (Java 1.4) — bufory i kanały, nieblokujące wejście-wyjście z selektorami, pliki mapowane w pamięci. NIO.2 (Java 7, `java.nio.file`) — `Path`, `Files`, przechodzenie drzew, atrybuty, obserwowanie folderów (`WatchService`).
:::

:::task medium "Dlaczego ważne jest podawanie kodowania?"
Podaj przykład błędu.
??? Odpowiedź
Bez jawnego kodowania przed Javą 18 używane było systemowe (w polskim Windows — windows-1250), i plik zapisany na jednej maszynie czytał się krzaczkami na innej. Od Javy 18 domyślnie jest UTF-8, ale jawne `StandardCharsets.UTF_8` czyni kod przenośnym i zrozumiałym.
:::

:::task hard "Dlaczego deserializacja jest niebezpieczna?"
I jak się chronić?
??? Odpowiedź
`readObject()` może utworzyć obiekty dowolnych serializowalnych klas z classpath; spreparowane dane uruchamiają łańcuchy metod (gadget chains) aż do wykonania kodu. Ochrona: nie deserializować niezaufanych danych, używać `ObjectInputFilter` z białą listą klas, przechodzić na jawne formaty (JSON, Protobuf).
:::
