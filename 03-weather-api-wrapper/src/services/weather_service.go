package services

import (
	"weather-api-wrapper/src/models"
)

type weatherAPIResponse struct {
	Name string `json:"name"`
	Main struct {
		Temp float64 `json:"temp"`
	} `json:"main"`
	Weather []struct {
		Description string `json:"description"`
	} `json:"weather"`
}

func GetWeatherByCity(city string) (*models.WeatherResponse, error) {
	result := &models.WeatherResponse{
		City:        city,
		Temperature: 15.0,
		Description: "Mocked weather",
	}
	return result, nil
}
