import java.net.URI;
import java.net.http.*;
import java.time.Duration;

class Smoke {
    static final HttpClient client = HttpClient.newHttpClient();
    static HttpResponse<String> request(String method, String body) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://127.0.0.1:8080/api/expenses"))
            .timeout(Duration.ofSeconds(5)).header("Content-Type", "application/json")
            .method(method, HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
    }
    public static void main(String[] args) throws Exception {
        Process server = new ProcessBuilder("java", "-jar", "app.jar").inheritIO().start();
        try {
            boolean ready = false;
            for (int i = 0; i < 120; i++) {
                if (!server.isAlive()) throw new AssertionError("Server exited");
                try { if (request("GET", "").statusCode() == 200) { ready = true; break; } }
                catch (java.io.IOException ignored) { }
                Thread.sleep(250);
            }
            if (!ready) throw new AssertionError("Startup timeout");
            for (String body : new String[]{"{}", "{", "{\"description\":\"x\",\"amount\":-1}", "{\"description\":\"x\",\"amount\":0}", "{\"description\":\"x\",\"amount\":1.001}"}) {
                if (request("POST", body).statusCode() != 400) throw new AssertionError("Invalid input accepted: " + body);
            }
            var created = request("POST", "{\"description\":\"Lunch\",\"amount\":12.50,\"id\":\"spoof\"}");
            if (created.statusCode() != 201 || created.body().contains("spoof")) throw new AssertionError(created.body());
            if (!request("GET", "").body().contains("Lunch")) throw new AssertionError("Expense not stored");
            if (request("DELETE", "").statusCode() != 405) throw new AssertionError("Wrong method status");
            System.out.println("PASS expenses: executable jar, live HTTP, decimal validation, generated ID, malformed JSON, methods");
        } finally { server.destroy(); server.waitFor(); }
    }
}