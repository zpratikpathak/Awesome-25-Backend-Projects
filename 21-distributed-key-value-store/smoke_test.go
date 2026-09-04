package main

import (
 "io"
 "net/http"
 "net/http/httptest"
 "strings"
 "testing"
 "time"
)

func TestStoreBoundaryAndReplication(t *testing.T) {
 store = NewStore()
 replicated := make(chan RequestPayload, 1)
 peer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
  var payload RequestPayload
  if err := decodePayload(w, r, &payload); err != nil { t.Error(err); w.WriteHeader(400); return }
  replicated <- payload
 }))
 defer peer.Close()
 peers = []string{peer.URL}
 defer func() { peers = nil }()
 for _, body := range []string{`{}`, `{"key":"","value":"v"}`, `{"key":"k","value":"v"} {}`, `{"key":"k","value":1}`, `{"key":"k","extra":true}`} {
  for _, handler := range []http.HandlerFunc{handleSet, handleInternalSet} {
   response := httptest.NewRecorder()
   handler(response, httptest.NewRequest("POST", "/set", strings.NewReader(body)))
   if response.Code != 400 { t.Fatalf("%s: %d", body, response.Code) }
  }
 }
 mux := http.NewServeMux()
 mux.HandleFunc("/set", handleSet); mux.HandleFunc("/get", handleGet)
 server := httptest.NewServer(mux); defer server.Close()
 response, err := http.Post(server.URL+"/set", "application/json", strings.NewReader(`{"key":"hello","value":"world"}`))
 if err != nil { t.Fatal(err) }; response.Body.Close()
 if response.StatusCode != 200 { t.Fatal(response.StatusCode) }
 select { case payload := <-replicated: if payload.Key != "hello" || payload.Value != "world" { t.Fatal(payload) }; case <-time.After(5*time.Second): t.Fatal("replication timeout") }
 response, err = http.Get(server.URL+"/get?key=hello")
 if err != nil { t.Fatal(err) }; defer response.Body.Close()
 body, _ := io.ReadAll(response.Body)
 if string(body) != "world" { t.Fatal(string(body)) }
}