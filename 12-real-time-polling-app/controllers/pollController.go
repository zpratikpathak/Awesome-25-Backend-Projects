package controllers

import (
	"encoding/json"
	"net/http"
	"polling-app/models"
	"polling-app/services"
)

func PollHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(services.GetAllPolls())
	} else if r.Method == http.MethodPost {
		var p models.Poll
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		json.NewEncoder(w).Encode(services.CreatePoll(p))
	}
}
