package services

import "polling-app/models"

var polls []models.Poll

func GetAllPolls() []models.Poll {
	return polls
}

func CreatePoll(p models.Poll) models.Poll {
	p.ID = len(polls) + 1
	polls = append(polls, p)
	return p
}
