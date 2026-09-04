package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"
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
	server := &http.Server{Addr: ":"+port, ReadHeaderTimeout: 5*time.Second, ReadTimeout: 10*time.Second, WriteTimeout: 10*time.Second, IdleTimeout: 60*time.Second}
	log.Fatal(server.ListenAndServe())
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet { http.Error(w, "Method not allowed", 405); return }
	key := r.URL.Query().Get("key")
	if key == "" || len(key) > 128 {
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
	if err := decodePayload(w, r, &payload); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	store.mu.Lock()
	if _, exists := store.data[payload.Key]; !exists && len(store.data) >= 10000 { store.mu.Unlock(); http.Error(w, "Store full", 503); return }
	store.data[payload.Key] = payload.Value
	store.mu.Unlock()

	// Replicate
	for _, peer := range peers {
		go func(p string) {
			body, _ := json.Marshal(payload)
			client := &http.Client{Timeout: 3*time.Second}
			response, err := client.Post(fmt.Sprintf("%s/internal/set", p), "application/json", bytes.NewBuffer(body))
			if err != nil { log.Printf("Replication failed: %v", err); return }
			defer response.Body.Close()
			if response.StatusCode != http.StatusOK { log.Printf("Replication status: %d", response.StatusCode) }
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
	if err := decodePayload(w, r, &payload); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	store.mu.Lock()
	if _, exists := store.data[payload.Key]; !exists && len(store.data) >= 10000 { store.mu.Unlock(); http.Error(w, "Store full", 503); return }
	store.data[payload.Key] = payload.Value
	store.mu.Unlock()

	w.WriteHeader(http.StatusOK)
}

func decodePayload(w http.ResponseWriter, r *http.Request, payload *RequestPayload) error {
	decoder := json.NewDecoder(http.MaxBytesReader(w, r.Body, 65536))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(payload); err != nil { return err }
	if strings.TrimSpace(payload.Key) == "" || len(payload.Key) > 128 || len(payload.Value) > 32768 { return fmt.Errorf("invalid key or value") }
	var extra interface{}
	if decoder.Decode(&extra) != io.EOF { return fmt.Errorf("trailing JSON") }
	return nil
}
