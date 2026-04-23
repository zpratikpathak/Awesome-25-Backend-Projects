package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

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
	apiKey := os.Getenv("WEATHER_API_KEY")
	baseURL := os.Getenv("WEATHER_API_URL")

	if apiKey == "" || baseURL == "" {
		return nil, errors.New("weather API configuration missing")
	}

	url := fmt.Sprintf("%s?q=%s&appid=%s&units=metric", baseURL, city, apiKey)
	
	client := http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == 404 {
		return nil, errors.New("city not found")
	}

	if resp.StatusCode != 200 {
		return nil, errors.New("failed to fetch weather data")
	}

	var apiResp weatherAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, err
	}

	desc := "N/A"
	if len(apiResp.Weather) > 0 {
		desc = apiResp.Weather[0].Description
	}

	result := &models.WeatherResponse{
		City:        apiResp.Name,
		Temperature: apiResp.Main.Temp,
		Description: desc,
	}

	return result, nil
}
