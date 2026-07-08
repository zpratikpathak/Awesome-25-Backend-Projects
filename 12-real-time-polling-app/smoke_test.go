package main

import (
    "net/http"
    "net/http/httptest"
    "polling-app/routes"
    "strings"
    "testing"
    "io"
    "sync"
)

func TestSmoke(t *testing.T) {
    server := httptest.NewServer(routes.SetupRouter())
    defer server.Close()
    cases := []struct{ method, body string; status int }{
        {"GET", "", 200},
        {"POST", `{"question":"Pick","options":["A","B"]}`, 201},
        {"POST", `{"question":" ","options":["A","B"]}`, 400},
        {"POST", `{"question":"Pick","options":["A","A"]}`, 400},
        {"POST", `{"question":"Pick","options":["A","B"]} {}`, 400},
        {"POST", `{`, 400},
        {"POST", `{"question":"Pick","options":["A","B"],"extra":1}`, 400},
        {"POST", strings.Repeat("x", 17000), 400},
        {"DELETE", "", 405},
    }
    for _, c := range cases {
        req, _ := http.NewRequest(c.method, server.URL+"/api/polls", strings.NewReader(c.body))
        response, err := http.DefaultClient.Do(req)
        if err != nil { t.Fatal(err) }
        body, _ := io.ReadAll(response.Body)
        response.Body.Close()
        if response.StatusCode != c.status { t.Fatalf("%s: %d %s", c.method, response.StatusCode, body) }
    }
    var group sync.WaitGroup
    for i := 0; i < 20; i++ {
        group.Add(1)
        go func() {
            defer group.Done()
            response, err := http.Post(server.URL+"/api/polls", "application/json", strings.NewReader(`{"question":"Concurrent","options":["A","B"]}`))
            if err != nil { t.Error(err); return }
            io.Copy(io.Discard, response.Body)
            response.Body.Close()
            if response.StatusCode != 201 { t.Errorf("Concurrent status: %d", response.StatusCode) }
            response, err = http.Get(server.URL+"/api/polls")
            if err != nil { t.Error(err); return }
            io.Copy(io.Discard, response.Body)
            response.Body.Close()
        }()
    }
    group.Wait()
    t.Log("PASS polling: live HTTP, JSON/body/options validation, methods, concurrent reads/writes")
}