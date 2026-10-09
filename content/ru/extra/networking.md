Бэкенд постоянно общается по сети: вызывает чужие REST API, принимает HTTP-запросы, иногда работает с сокетами напрямую. В видео сеть не затрагивается. Разберём стандартный **`HttpClient`** (Java 11), основы сокетов и что используют на практике.

## Основы: URI, HTTP, TCP

- **TCP** — надёжное соединение «точка-точка»: байты доходят без потерь и по порядку.
- **HTTP** — текстовый (HTTP/1.1) или бинарный (HTTP/2, HTTP/3 поверх QUIC/UDP) протокол «запрос–ответ» поверх транспорта: метод (`GET`, `POST`, `PUT`, `DELETE`), путь, заголовки, тело, код ответа (`200`, `404`, `500`).
- **URI** — адрес ресурса: `https://api.example.com:443/users?page=2`. В Java — класс `URI` (`URL` устарел как способ создания адресов: его конструкторы deprecated с Java 20).

## HttpClient

```java
HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build();                                     // создайте один раз и переиспользуйте

HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.github.com/users/octocat"))
        .header("Accept", "application/json")
        .timeout(Duration.ofSeconds(10))
        .GET()
        .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.statusCode() + " " + response.body());

// асинхронно
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
      .thenApply(HttpResponse::body)
      .thenAccept(System.out::println);

// POST с JSON
HttpRequest post = HttpRequest.newBuilder(URI.create("https://httpbin.org/post"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("""
              {"name": "Ann", "age": 25}
              """))
        .build();
```

:::outdated "HttpURLConnection → HttpClient"
Старый `HttpURLConnection` (Java 1.1) неудобен: ручные потоки, нет HTTP/2, нет асинхронности. С Java 11 используйте `java.net.http.HttpClient` — поддерживает HTTP/2, асинхронные вызовы, WebSocket, а с **Java 26** — и HTTP/3. С Java 21 `HttpClient` реализует `AutoCloseable`.
:::

## Сокеты: эхо-сервер

```java
try (var server = new ServerSocket(5000);
     var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    while (true) {
        Socket socket = server.accept();                 // ждём клиента
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

Клиент: `new Socket("localhost", 5000)`. С виртуальными потоками модель «поток на соединение» снова стала практичной.

## Быстрый HTTP-сервер без фреймворка

- `jwebserver` (Java 18) — раздаёт статические файлы из папки: `jwebserver -p 8000`.
- `com.sun.net.httpserver.HttpServer` — встроенный минимальный сервер для прототипов и тестов.

В продакшене HTTP-сервер даёт фреймворк: Spring Boot (Tomcat/Jetty/Netty), Quarkus (Vert.x), Javalin (Jetty) — см. [веб-фреймворки](#/extra/web-frameworks).

## Что используют на практике

| Задача | Инструмент |
|---|---|
| Вызов REST API в Spring | `RestClient` (Spring 6.1+), декларативные HTTP-интерфейсы `@HttpExchange`, `WebClient` (реактивный) |
| Вне Spring | `HttpClient`, OkHttp, Retrofit, Feign |
| Устойчивость | таймауты, ретраи, circuit breaker (Resilience4j) |
| Тестирование внешних API | WireMock, MockServer |

:::warning "Всегда ставьте таймауты"
Без таймаута один «зависший» внешний сервис займёт все потоки вашего приложения. Задавайте `connectTimeout` и таймаут запроса, а для важных интеграций — ретраи с экспоненциальной задержкой и circuit breaker.
:::

## Домашнее задание

:::task easy "Погода из API"
С помощью `HttpClient` получите JSON из открытого API (например, `https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01&current=temperature_2m`) и выведите текущую температуру в Варшаве. Обработайте коды ответа ≠ 200.
:::

:::task medium "Параллельные запросы"
Отправьте 20 асинхронных запросов `sendAsync` к `https://httpbin.org/delay/1`, дождитесь всех через `CompletableFuture.allOf` и выведите общее время. Сравните с последовательным `send`.
:::

:::task hard "Чат на сокетах"
Напишите многопользовательский чат: сервер на `ServerSocket` + виртуальные потоки, хранит подключённых клиентов в потокобезопасной коллекции и рассылает каждое сообщение всем. Клиент — консольное приложение с отдельным потоком для чтения. Поддержите команды `/nick`, `/list`, `/quit` и корректное отключение.
:::
