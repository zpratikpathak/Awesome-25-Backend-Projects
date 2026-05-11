package services

import (
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestSmoke(t *testing.T) {
    provider := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.URL.Query().Get("q") != "New York & London" || r.URL.Query().Get("units") != "metric" { t.Error("incorrect query encoding") }
        w.Write([]byte(`{"name":"London","main":{"temp":12.5},"weather":[{"description":"cloudy"}]}`))
    }))
    defer provider.Close()
    data, err := fetchWeather("New York & London", "test", provider.URL, provider.Client())
    if err != nil || data.City != "London" || data.Temperature != 12.5 { t.Fatalf("unexpected response: %v %v", data, err) }
    if _, err := fetchWeather("London", "", provider.URL, provider.Client()); err == nil { t.Fatal("missing key accepted") }
    bad := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.Write([]byte(`{"weather":[]}`)) }))
    defer bad.Close()
    if _, err := fetchWeather("London", "test", bad.URL, bad.Client()); err == nil { t.Fatal("invalid response accepted") }
    rejected := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(401) }))
    defer rejected.Close()
    if _, err := fetchWeather("London", "test", rejected.URL, rejected.Client()); err == nil { t.Fatal("provider error accepted") }
}