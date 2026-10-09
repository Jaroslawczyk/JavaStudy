Backend stale komunikuje się przez sieć: wywołuje cudze REST API, przyjmuje żądania HTTP, czasem pracuje bezpośrednio z gniazdami. Wideo nie porusza tematu sieci. Omówmy standardowy **`HttpClient`** (Java 11), podstawy gniazd i to, czego używa się w praktyce.

## Podstawy: URI, HTTP, TCP

- **TCP** — niezawodne połączenie „punkt-punkt”: bajty docierają bez strat i w kolejności.
- **HTTP** — tekstowy (HTTP/1.1) lub binarny (HTTP/2, HTTP/3 przez QUIC/UDP) protokół „żądanie–odpowiedź” nad transportem: metoda (`GET`, `POST`, `PUT`, `DELETE`), ścieżka, nagłówki, ciało, kod odpowiedzi (`200`, `404`, `500`).
- **URI** — adres zasobu: `https://api.example.com:443/users?page=2`. W Javie — klasa `URI` (`URL` jest przestarzały jako sposób tworzenia adresów: jego konstruktory są deprecated od Javy 20).

## HttpClient

```java
HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build();                                     // utwórz raz i używaj ponownie

HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.github.com/users/octocat"))
        .header("Accept", "application/json")
        .timeout(Duration.ofSeconds(10))
        .GET()
        .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.statusCode() + " " + response.body());

// asynchronicznie
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
      .thenApply(HttpResponse::body)
      .thenAccept(System.out::println);

// POST z JSON
HttpRequest post = HttpRequest.newBuilder(URI.create("https://httpbin.org/post"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("""
              {"name": "Ann", "age": 25}
              """))
        .build();
```

:::outdated "HttpURLConnection → HttpClient"
Stary `HttpURLConnection` (Java 1.1) jest niewygodny: ręczne strumienie, brak HTTP/2, brak asynchroniczności. Od Javy 11 używaj `java.net.http.HttpClient` — obsługuje HTTP/2, wywołania asynchroniczne, WebSocket, a od **Javy 26** — także HTTP/3. Od Javy 21 `HttpClient` implementuje `AutoCloseable`.
:::

## Gniazda: serwer echo

```java
try (var server = new ServerSocket(5000);
     var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    while (true) {
        Socket socket = server.accept();                 // czekamy na klienta
        executor.submit(() -> {
            try (socket;
                 var in = new BufferedReader(new InputStreamReader(socket.getInputStream(), UTF_8));
                 var out = new PrintWriter(socket.getOutputStream(), true, UTF_8)) {
                String line;
                while ((line = in.readLine()) != null) out.println("echo: " + line);
            }
            return null;
        });
    }
}
```

Klient: `new Socket("localhost", 5000)`. Z wątkami wirtualnymi model „wątek na połączenie” znów stał się praktyczny.

## Szybki serwer HTTP bez frameworka

- `jwebserver` (Java 18) — udostępnia pliki statyczne z folderu: `jwebserver -p 8000`.
- `com.sun.net.httpserver.HttpServer` — wbudowany minimalny serwer do prototypów i testów.

Na produkcji serwer HTTP daje framework: Spring Boot (Tomcat/Jetty/Netty), Quarkus (Vert.x), Javalin (Jetty) — zob. [frameworki webowe](#/extra/web-frameworks).

## Czego używa się w praktyce

| Zadanie | Narzędzie |
|---|---|
| Wywołanie REST API w Springu | `RestClient` (Spring 6.1+), deklaratywne interfejsy HTTP `@HttpExchange`, `WebClient` (reaktywny) |
| Poza Springiem | `HttpClient`, OkHttp, Retrofit, Feign |
| Odporność | limity czasu, ponowienia, circuit breaker (Resilience4j) |
| Testowanie zewnętrznych API | WireMock, MockServer |

:::warning "Zawsze ustawiaj limity czasu"
Bez limitu czasu jeden „zawieszony” zewnętrzny serwis zajmie wszystkie wątki twojej aplikacji. Ustawiaj `connectTimeout` i limit czasu żądania, a dla ważnych integracji — ponowienia z wykładniczym opóźnieniem i circuit breaker.
:::

## Zadanie domowe

:::task easy "Pogoda z API"
Za pomocą `HttpClient` pobierz JSON z otwartego API (np. `https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01&current=temperature_2m`) i wypisz bieżącą temperaturę w Warszawie. Obsłuż kody odpowiedzi ≠ 200.
:::

:::task medium "Równoległe żądania"
Wyślij 20 asynchronicznych żądań `sendAsync` do `https://httpbin.org/delay/1`, poczekaj na wszystkie przez `CompletableFuture.allOf` i wypisz łączny czas. Porównaj z sekwencyjnym `send`.
:::

:::task hard "Czat na gniazdach"
Napisz czat dla wielu użytkowników: serwer na `ServerSocket` + wątki wirtualne trzyma podłączonych klientów w kolekcji bezpiecznej wątkowo i rozsyła każdą wiadomość do wszystkich. Klient — aplikacja konsolowa z osobnym wątkiem do czytania. Obsłuż polecenia `/nick`, `/list`, `/quit` i poprawne rozłączenie.
:::
