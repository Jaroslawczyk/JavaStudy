Pośrednia „rozmowa rekrutacyjna” z podstaw wielowątkowości. Jak zwykle: przeczytaj pytanie, **odpowiedz na głos**, potem otwórz odpowiedź. Odpowiedzi uzupełniono o współczesne szczegóły — na rozmowie dadzą ci plus.

## Znaczniki czasu wideo

- {{t j2 2:18:10}} — format rozmowy
- {{t j2 2:18:23}} — pytania 1–5: wielowątkowość, zatrzymanie wątku, `join`
- {{t j2 2:19:53}} — pytania 6–7: referencja do wątku głównego, `InterruptedException`
- {{t j2 2:20:32}} — pytania 8–10: synchronizacja i monitory
- {{t j2 2:21:49}} — pytania 11–14: demony, tworzenie wątków, `run` i `start`
- {{t j2 2:23:04}} — zakończenie

## Pytania

:::task video "1. Czym jest wielowątkowość?"
{{t j2 2:18:23}}
??? Odpowiedź
Zdolnością programu do wykonywania kilku zadań jednocześnie w różnych wątkach. Wątki jednego procesu dzielą wspólną pamięć (stertę), ale każdy ma własny stos.
:::

:::task video "2. Czy można zatrzymać wątek po uruchomieniu? Jak?"
{{t j2 2:18:36}}
??? Odpowiedź
Przez `interrupt()` — kooperacyjnie: wątek sam sprawdza flagę lub dostaje `InterruptedException`. Przestarzały `stop()` od Javy 20 rzuca `UnsupportedOperationException` (w wideo jest jeszcze wspomniany jako działający, ale niezalecany).
:::

:::task video "3. Dlaczego nie wolno zatrzymywać wątku przez stop()?"
{{t j2 2:18:57}}
??? Odpowiedź
Wątek zostaje przerwany w dowolnym miejscu: dane (plik, rekord w bazie, obiekt pod monitorem) zostają w niespójnym stanie.
:::

:::task video "4. Co się dzieje po wywołaniu interrupt()? Dlaczego to bezpieczniejsze?"
{{t j2 2:19:17}}
??? Odpowiedź
Ustawiana jest flaga przerwania; jeśli wątek śpi/czeka — dostaje `InterruptedException`. Wątek sam decyduje, jak poprawnie się zakończyć, więc dane pozostają całe.
:::

:::task video "5. Co robi join()?"
{{t j2 2:19:40}}
??? Odpowiedź
Wstrzymuje wątek, w którym go wywołano, do zakończenia wątku, na którym go wywołano. Jest wariant z limitem czasu.
:::

:::task video "6. Jak zdobyć referencję do wątku głównego?"
{{t j2 2:19:53}}
??? Odpowiedź
Wywołać w wątku głównym `Thread.currentThread()` (metoda statyczna zwraca bieżący wątek). Referencję można zapisać i przekazać innym wątkom.
:::

:::task video "7. Dlaczego sleep() i join() trzeba obejmować try-catch?"
{{t j2 2:20:14}}
??? Odpowiedź
Rzucają sprawdzany `InterruptedException`, jeśli wątek przerwano podczas oczekiwania. Obsługa: zakończyć pracę albo przywrócić flagę `Thread.currentThread().interrupt()`.
:::

:::task video "8. Jakie znasz sposoby synchronizacji?"
{{t j2 2:20:32}}
??? Odpowiedź
`synchronized` w sygnaturze metody i blok `synchronized` z obiektem-monitorem. Dodatkowo (nie z wideo): `ReentrantLock`/`ReadWriteLock`, atomiki, kolekcje bezpieczne wątkowo, `volatile` dla widoczności.
:::

:::task video "9. Co jest monitorem metody synchronized?"
{{t j2 2:21:00}}
??? Odpowiedź
`this` — obiekt, na którym wywołano metodę. Dla `static synchronized` — obiekt klasy (`MyClass.class`).
:::

:::task video "10. Jeden wątek jest w metodzie synchronized. Czy inny może wywołać inną synchronized lub zwykłą metodę?"
{{t j2 2:21:11}}
??? Odpowiedź
Zwykłą — tak, ile razy chce. Inną `synchronized` na **tym samym** monitorze — nie, wątek będzie czekał. Na innym monitorze — tak.
:::

:::task video "11. Czym jest wątek demon?"
{{t j2 2:21:49}}
??? Odpowiedź
Wątkiem w tle, który kończy się automatycznie, gdy zakończą się wszystkie wątki główne (nie-demony). Ustawia się go przez `setDaemon(true)` przed `start()`.
:::

:::task video "12. Jakie znasz sposoby tworzenia wątku?"
{{t j2 2:22:04}}
??? Odpowiedź
Dziedziczyć po `Thread` lub zaimplementować `Runnable`. Współcześnie: `ExecutorService` z `Runnable`/`Callable`, `CompletableFuture`, `Thread.ofVirtual()` (Java 21).
:::

:::task video "13. Który sposób jest lepszy i dlaczego?"
{{t j2 2:22:15}}
??? Odpowiedź
`Runnable`: klasa pozostaje wolna do dziedziczenia, zadanie jest oddzielone od mechanizmu wykonania (można je oddać puli lub wątkowi wirtualnemu).
:::

:::task video "14. Czym różnią się run() i start()?"
{{t j2 2:22:30}}
??? Odpowiedź
`start()` tworzy nowy wątek i wywołuje w nim `run()`. Bezpośrednie wywołanie `run()` wykona kod w bieżącym wątku. Ponowny `start()` rzuci `IllegalThreadStateException`.
:::

## Dodatkowe pytania (nie z wideo, ale częste)

:::task easy "Jakie stany może mieć wątek?"
Wymień wartości `Thread.State`.
??? Odpowiedź
`NEW`, `RUNNABLE`, `BLOCKED`, `WAITING`, `TIMED_WAITING`, `TERMINATED`.
:::

:::task medium "volatile vs synchronized"
Czym się różnią i czy jedno może zastąpić drugie?
??? Odpowiedź
`volatile` daje widoczność i uporządkowanie, ale nie wzajemne wykluczanie i nie atomowość operacji złożonych. `synchronized` daje i wzajemne wykluczanie, i widoczność. Zastąpić `synchronized` przez `volatile` można tylko, gdy operacja to pojedynczy zapis/odczyt (flaga).
:::

:::task medium "Czym jest happens-before?"
Wyjaśnij na przykładzie.
??? Odpowiedź
Gwarancja modelu pamięci Javy: jeśli akcja A happens-before B, to wyniki A są widoczne dla B. Przykłady: wyjście z `synchronized` → wejście na tym samym monitorze; zapis do `volatile` → późniejszy odczyt; `start()` → pierwsza akcja w wątku; ostatnia akcja wątku → powrót z `join()`.
:::

:::task hard "Dlaczego wait() wywołuje się w pętli?"
Wyjaśnij (temat kolejnych lekcji).
??? Odpowiedź
Zdarzają się „fałszywe przebudzenia” (spurious wakeups), a gdy wątek się budził, warunek mógł zmienić inny wątek. Dlatego warunek sprawdza się ponownie: `while (!condition) lock.wait();`.
:::
