package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	

	"golang.org/x/time/rate"
)

var clients = make(map[string]*rate.Limiter)
var mu sync.Mutex

func getVisitor(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	limiter, exists := clients[ip]
	if !exists {
		// 1 request per second, burst of 3
		limiter = rate.NewLimiter(1, 3)
		clients[ip] = limiter
	}

	return limiter
}

func rateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		limiter := getVisitor(r.RemoteAddr)
		if !limiter.Allow() {
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
	log.Fatal(http.ListenAndServe(":8018", rateLimit(mux)))
}
