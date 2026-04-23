package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
)

type Store struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewStore() *Store {
	return &Store{
		data: make(map[string]string),
	}
}

var (
	store = NewStore()
	peers []string
	port  string
)

type RequestPayload struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func main() {
	var peersStr string
	flag.StringVar(&port, "port", "8080", "Server port")
	flag.StringVar(&peersStr, "peers", "", "Comma separated list of peer URLs (e.g. http://localhost:8081)")
	flag.Parse()

	if peersStr != "" {
		peers = strings.Split(peersStr, ",")
	}

	http.HandleFunc("/get", handleGet)
	http.HandleFunc("/set", handleSet)
	http.HandleFunc("/internal/set", handleInternalSet)

	fmt.Printf("Starting node on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("key")
	if key == "" {
		http.Error(w, "Missing key", http.StatusBadRequest)
		return
	}

	store.mu.RLock()
	val, ok := store.data[key]
	store.mu.RUnlock()

	if !ok {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	w.Write([]byte(val))
}

func handleSet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload RequestPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	store.mu.Lock()
	store.data[payload.Key] = payload.Value
	store.mu.Unlock()

	// Replicate
	for _, peer := range peers {
		go func(p string) {
			body, _ := json.Marshal(payload)
			http.Post(fmt.Sprintf("%s/internal/set", p), "application/json", bytes.NewBuffer(body))
		}(peer)
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func handleInternalSet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload RequestPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	store.mu.Lock()
	store.data[payload.Key] = payload.Value
	store.mu.Unlock()

	w.WriteHeader(http.StatusOK)
}
