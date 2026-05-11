package main

import (
    "errors"
    "net/http"
    "net/http/httptest"
    "strings"
    "testing"
    "weather-api-wrapper/src/routes"
    "weather-api-wrapper/src/utils"

    "github.com/gin-gonic/gin"
)

type mockTransport func(*http.Request) (*http.Response, error)
func (f mockTransport) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }

func TestWeatherHTTP(t *testing.T) {
    utils.InitLogger()
    gin.SetMode(gin.TestMode)
    router := gin.New()
    routes.SetupWeatherRoutes(router)
    original := http.DefaultTransport
    t.Cleanup(func() { http.DefaultTransport = original })
    t.Setenv("OPENWEATHER_API_KEY", "mock-only")
    for _, tc := range []struct { name, body string; providerStatus, want int; unavailable bool }{
        {"success", `{"name":"London","main":{"temp":12.5},"weather":[{"description":"cloudy"}]}`, 200, 200, false},
        {"rejected", `{}`, 401, 502, false},
        {"malformed", `{`, 200, 502, false},
        {"empty", `{"weather":[]}`, 200, 502, false},
        {"network", "", 200, 502, true},
    } {
        t.Run(tc.name, func(t *testing.T) {
            provider := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
                if r.URL.Query().Get("q") != "London" || r.URL.Query().Get("appid") != "mock-only" { t.Error("wrong provider query") }
                w.WriteHeader(tc.providerStatus)
                w.Write([]byte(tc.body))
            }))
            defer provider.Close()
            http.DefaultTransport = mockTransport(func(r *http.Request) (*http.Response, error) {
                if tc.unavailable { return nil, errors.New("mock network failure") }
                request, _ := http.NewRequest(r.Method, provider.URL + "?" + r.URL.RawQuery, nil)
                return original.RoundTrip(request)
            })
            result := httptest.NewRecorder()
            router.ServeHTTP(result, httptest.NewRequest("GET", "/api/v1/weather?city=London", nil))
            if result.Code != tc.want { t.Fatalf("status %d: %s", result.Code, result.Body.String()) }
            if tc.want == 200 && !strings.Contains(result.Body.String(), `"temperature":12.5`) { t.Fatal("incorrect mapping") }
        })
    }
    http.DefaultTransport = mockTransport(func(*http.Request) (*http.Response, error) { t.Fatal("unexpected provider call"); return nil, nil })
    for _, path := range []string{"/api/v1/weather", "/api/v1/weather?city=x", "/api/v1/weather?city=%20%20"} {
        result := httptest.NewRecorder()
        router.ServeHTTP(result, httptest.NewRequest("GET", path, nil))
        if result.Code != 400 { t.Fatalf("invalid city status %d", result.Code) }
    }
    t.Setenv("OPENWEATHER_API_KEY", "")
    result := httptest.NewRecorder()
    router.ServeHTTP(result, httptest.NewRequest("GET", "/api/v1/weather?city=London", nil))
    if result.Code != 502 { t.Fatalf("missing key status %d", result.Code) }
}