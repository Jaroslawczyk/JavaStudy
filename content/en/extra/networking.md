A backend constantly talks over the network: it calls other services' REST APIs, accepts HTTP requests, sometimes works with sockets directly. The video doesn't touch networking. Let's look at the standard **`HttpClient`** (Java 11), socket basics and what's used in practice.

## Basics: URI, HTTP, TCP

- **TCP** — a reliable point-to-point connection: bytes arrive without loss and in order.
- **HTTP** — a text (HTTP/1.1) or binary (HTTP/2, HTTP/3 over QUIC/UDP) request–response protocol on top of a transport: method (`GET`, `POST`, `PUT`, `DELETE`), path, headers, body, status code (`200`, `404`, `500`).
- **URI** — a resource address: `https://api.example.com:443/users?page=2`. In Java — the `URI` class (`URL` is outdated as a way to create addresses: its constructors are deprecated since Java 20).

## HttpClient

```java
HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build();                                     // create once and reuse

HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.github.com/users/octocat"))
        .header("Accept", "application/json")
        .timeout(Duration.ofSeconds(10))
        .GET()
        .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.statusCode() + " " + response.body());

// asynchronously
client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
      .thenApply(HttpResponse::body)
      .thenAccept(System.out::println);

// POST with JSON
HttpRequest post = HttpRequest.newBuilder(URI.create("https://httpbin.org/post"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("""
              {"name": "Ann", "age": 25}
              """))
        .build();
```

:::outdated "HttpURLConnection → HttpClient"
The old `HttpURLConnection` (Java 1.1) is awkward: manual streams, no HTTP/2, no asynchrony. Since Java 11 use `java.net.http.HttpClient` — it supports HTTP/2, asynchronous calls, WebSocket, and since **Java 26** also HTTP/3. Since Java 21 `HttpClient` implements `AutoCloseable`.
:::

## Sockets: an echo server

```java
try (var server = new ServerSocket(5000);
     var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    while (true) {
        Socket socket = server.accept();                 // wait for a client
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

Client: `new Socket("localhost", 5000)`. With virtual threads the "thread per connection" model has become practical again.

## A quick HTTP server without a framework

- `jwebserver` (Java 18) serves static files from a folder: `jwebserver -p 8000`.
- `com.sun.net.httpserver.HttpServer` — a built-in minimal server for prototypes and tests.

In production the HTTP server comes from a framework: Spring Boot (Tomcat/Jetty/Netty), Quarkus (Vert.x), Javalin (Jetty) — see [web frameworks](#/extra/web-frameworks).

## What's used in practice

| Task | Tool |
|---|---|
| Calling REST APIs in Spring | `RestClient` (Spring 6.1+), declarative HTTP interfaces `@HttpExchange`, `WebClient` (reactive) |
| Outside Spring | `HttpClient`, OkHttp, Retrofit, Feign |
| Resilience | timeouts, retries, circuit breaker (Resilience4j) |
| Testing external APIs | WireMock, MockServer |

:::warning "Always set timeouts"
Without a timeout a single "hung" external service will occupy all your application's threads. Set `connectTimeout` and a request timeout, and for important integrations — retries with exponential backoff and a circuit breaker.
:::

## Homework

:::task easy "Weather from an API"
Using `HttpClient`, fetch JSON from an open API (e.g. `https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01&current=temperature_2m`) and print the current temperature in Warsaw. Handle status codes ≠ 200.
:::

:::task medium "Parallel requests"
Send 20 asynchronous `sendAsync` requests to `https://httpbin.org/delay/1`, wait for all of them with `CompletableFuture.allOf` and print the total time. Compare with sequential `send`.
:::

:::task hard "A socket chat"
Write a multi-user chat: a server on `ServerSocket` + virtual threads keeps connected clients in a thread-safe collection and broadcasts every message to all. The client is a console app with a separate reading thread. Support the commands `/nick`, `/list`, `/quit` and clean disconnection.
:::
