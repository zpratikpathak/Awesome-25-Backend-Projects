package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"sync"
	"time"
	

	"golang.org/x/time/rate"
)

type visitor struct { limiter *rate.Limiter; seen time.Time }
var clients = make(map[string]visitor)
var mu sync.Mutex

func getVisitor(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	now := time.Now()
	for key, entry := range clients { if now.Sub(entry.seen) > 5*time.Minute { delete(clients, key) } }
	entry, exists := clients[ip]
	if !exists {
		if len(clients) >= 10000 { return nil }
		// 1 request per second, burst of 3
		entry.limiter = rate.NewLimiter(1, 3)
	}
	entry.seen = now
	clients[ip] = entry
	return entry.limiter
}

func rateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil { http.Error(w, "Invalid client address", http.StatusBadRequest); return }
		limiter := getVisitor(ip)
		if limiter == nil { http.Error(w, "Client capacity reached", http.StatusServiceUnavailable); return }
		if !limiter.Allow() {
			w.Header().Set("Retry-After", "1")
			http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, welcome to the API!\n")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", helloHandler)

	log.Println("Server running on :8018")
	server := &http.Server{Addr: ":8018", Handler: rateLimit(mux), ReadHeaderTimeout: 5*time.Second, ReadTimeout: 10*time.Second, WriteTimeout: 10*time.Second, IdleTimeout: 60*time.Second}
	log.Fatal(server.ListenAndServe())
}
