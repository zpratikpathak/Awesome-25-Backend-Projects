package controllers

import (
	"encoding/json"
	"io"
	"strings"
	"net/http"
	"polling-app/models"
	"polling-app/services"
)

func PollHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(services.GetAllPolls())
	} else if r.Method == http.MethodPost {
		var p models.Poll
		r.Body = http.MaxBytesReader(w, r.Body, 16384)
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()
		if err := decoder.Decode(&p); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		p.Question = strings.TrimSpace(p.Question)
		if decoder.Decode(new(any)) != io.EOF || p.Question == "" || len(p.Question) > 500 || len(p.Options) < 2 || len(p.Options) > 20 {
			http.Error(w, "Invalid poll", http.StatusBadRequest)
			return
		}
		seen := make(map[string]bool)
		for i, option := range p.Options {
			option = strings.TrimSpace(option)
			if option == "" || len(option) > 200 || seen[option] {
				http.Error(w, "Invalid options", http.StatusBadRequest)
				return
			}
			seen[option] = true
			p.Options[i] = option
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(services.CreatePoll(p))
	} else {
		w.Header().Set("Allow", "GET, POST")
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
