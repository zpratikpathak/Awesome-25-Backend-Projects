package main

import (
 "net/http"
 "net/http/httptest"
 "testing"
 "time"
)

func TestIPLimit(t *testing.T) {
 clients = make(map[string]visitor)
 handler := rateLimit(http.HandlerFunc(helloHandler))
 for i, address := range []string{"192.0.2.1:1000", "192.0.2.1:1001", "192.0.2.1:1002", "192.0.2.1:1003", "192.0.2.2:1000"} {
  request := httptest.NewRequest("GET", "/", nil)
  request.RemoteAddr = address
  request.Header.Set("X-Forwarded-For", "203.0.113.1")
  response := httptest.NewRecorder()
  handler.ServeHTTP(response, request)
  expected := 200
  if i == 3 { expected = 429; if response.Header().Get("Retry-After") != "1" { t.Fatal("missing retry header") } }
  if response.Code != expected { t.Fatalf("request %d: got %d, want %d", i, response.Code, expected) }
 }
 clients["expired"] = visitor{seen: time.Now().Add(-6*time.Minute)}
 getVisitor("new")
 if _, exists := clients["expired"]; exists { t.Fatal("expired client retained") }
 server := httptest.NewServer(handler)
 defer server.Close()
 response, err := http.Get(server.URL)
 if err != nil { t.Fatal(err) }; defer response.Body.Close()
 if response.StatusCode != 200 { t.Fatal(response.StatusCode) }
}