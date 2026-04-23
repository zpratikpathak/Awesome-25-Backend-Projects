package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
)

type Document struct {
	ID      string `json:"id"`
	Content string `json:"content"`
}

type Indexer struct {
	mu            sync.RWMutex
	invertedIndex map[string][]string // Token -> Document IDs
	documents     map[string]string   // ID -> Content
}

func NewIndexer() *Indexer {
	return &Indexer{
		invertedIndex: make(map[string][]string),
		documents:     make(map[string]string),
	}
}

func (idx *Indexer) Add(doc Document) {
	idx.mu.Lock()
	defer idx.mu.Unlock()

	idx.documents[doc.ID] = doc.Content

	tokens := strings.Fields(strings.ToLower(doc.Content))
	for _, token := range tokens {
		// Avoid duplicates in the same doc
		if !contains(idx.invertedIndex[token], doc.ID) {
			idx.invertedIndex[token] = append(idx.invertedIndex[token], doc.ID)
		}
	}
}

func (idx *Indexer) Search(query string) []Document {
	idx.mu.RLock()
	defer idx.mu.RUnlock()

	query = strings.ToLower(strings.TrimSpace(query))
	if query == "" {
		return nil
	}

	tokens := strings.Fields(query)
	if len(tokens) == 0 {
		return nil
	}

	// Basic search: Find docs containing all tokens (AND logic)
	// We start with the docs containing the first token
	docIDs := idx.invertedIndex[tokens[0]]

	for i := 1; i < len(tokens); i++ {
		docIDs = intersect(docIDs, idx.invertedIndex[tokens[i]])
	}

	var results []Document
	for _, id := range docIDs {
		results = append(results, Document{ID: id, Content: idx.documents[id]})
	}
	return results
}

func contains(slice []string, val string) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}

func intersect(a, b []string) []string {
	m := make(map[string]bool)
	for _, item := range a {
		m[item] = true
	}
	var res []string
	for _, item := range b {
		if m[item] {
			res = append(res, item)
		}
	}
	return res
}

var indexer = NewIndexer()

func main() {
	http.HandleFunc("/index", handleIndex)
	http.HandleFunc("/search", handleSearch)

	fmt.Println("Search engine indexer running on :8024")
	log.Fatal(http.ListenAndServe(":8024", nil))
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var doc Document
	if err := json.NewDecoder(r.Body).Decode(&doc); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	indexer.Add(doc)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Indexed"))
}

func handleSearch(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Missing query parameter 'q'", http.StatusBadRequest)
		return
	}

	results := indexer.Search(query)
	if results == nil {
		results = []Document{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
