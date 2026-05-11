package services

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/url"
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
	return fetchWeather(city, os.Getenv("OPENWEATHER_API_KEY"), "https://api.openweathermap.org/data/2.5/weather", &http.Client{Timeout: 5 * time.Second})
}

func fetchWeather(city, key, endpoint string, client *http.Client) (*models.WeatherResponse, error) {
	if key == "" {
		return nil, errors.New("OPENWEATHER_API_KEY is not configured")
	}
	query := url.Values{"q": {city}, "appid": {key}, "units": {"metric"}}
	response, err := client.Get(endpoint + "?" + query.Encode())
	if err != nil {
		return nil, errors.New("Weather provider unavailable")
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return nil, errors.New("Weather provider rejected request")
	}
	var data weatherAPIResponse
	if err := json.NewDecoder(io.LimitReader(response.Body, 1<<20)).Decode(&data); err != nil || data.Name == "" || len(data.Weather) == 0 {
		return nil, errors.New("Invalid weather provider response")
	}
	return &models.WeatherResponse{City: data.Name, Temperature: data.Main.Temp, Description: data.Weather[0].Description}, nil
}
