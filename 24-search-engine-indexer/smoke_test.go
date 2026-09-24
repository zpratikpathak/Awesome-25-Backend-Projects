package main

import (
 "net/http"
 "net/http/httptest"
 "strings"
 "testing"
)

func TestReplacementAndBoundaries(t *testing.T) {
 indexer = NewIndexer()
 indexer.Add(Document{ID: "1", Content: "old old common"})
 indexer.Add(Document{ID: "1", Content: "new common"})
 if len(indexer.Search("old")) != 0 { t.Fatal("stale postings") }
 if len(indexer.Search("new common")) != 1 { t.Fatal("AND search failed") }
 bounded := NewIndexer()
 for i := 0; i < 1000; i++ { bounded.documents[strings.Repeat("x", i+1)] = "stored" }
 if bounded.Add(Document{ID: "new", Content: "value"}) { t.Fatal("capacity exceeded") }
 if !bounded.Add(Document{ID: "x", Content: "replacement"}) { t.Fatal("replacement denied at capacity") }
 for _, body := range []string{`{}`, `{"id":"x","content":""}`, `{"id":"x","content":"ok"} {}`, `{"id":"x","content":"ok","extra":true}`} {
  response := httptest.NewRecorder()
  handleIndex(response, httptest.NewRequest("POST", "/index", strings.NewReader(body)))
  if response.Code != 400 { t.Fatalf("%s: %d", body, response.Code) }
 }
 mux := http.NewServeMux(); mux.HandleFunc("/index", handleIndex); mux.HandleFunc("/search", handleSearch)
 server := httptest.NewServer(mux); defer server.Close()
 response, err := http.Post(server.URL+"/index", "application/json", strings.NewReader(`{"id":"2","content":"new item"}`))
 if err != nil { t.Fatal(err) }; response.Body.Close()
 if response.StatusCode != 200 { t.Fatal(response.StatusCode) }
 response, err = http.Get(server.URL+"/search?q=new")
 if err != nil { t.Fatal(err) }; defer response.Body.Close()
 if response.StatusCode != 200 { t.Fatal(response.StatusCode) }
}