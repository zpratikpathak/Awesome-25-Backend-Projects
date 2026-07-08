package services

import (
	"polling-app/models"
	"sync"
)

var polls = []models.Poll{}
var mu sync.Mutex

func GetAllPolls() []models.Poll {
	mu.Lock()
	defer mu.Unlock()
	result := make([]models.Poll, len(polls))
	for i, p := range polls {
		p.Options = append([]string(nil), p.Options...)
		result[i] = p
	}
	return result
}

func CreatePoll(p models.Poll) models.Poll {
	mu.Lock()
	defer mu.Unlock()
	p.ID = len(polls) + 1
	p.Options = append([]string(nil), p.Options...)
	polls = append(polls, p)
	p.Options = append([]string(nil), p.Options...)
	return p
}
