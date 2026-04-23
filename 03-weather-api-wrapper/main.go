package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type WeatherResponse struct {
	CurrentWeather struct {
		Temperature float64 `json:"temperature"`
		Windspeed   float64 `json:"windspeed"`
		Winddirection float64 `json:"winddirection"`
		Weathercode int     `json:"weathercode"`
		Time        string  `json:"time"`
	} `json:"current_weather"`
}

func weatherHandler(w http.ResponseWriter, r *http.Request) {
	latitude := r.URL.Query().Get("lat")
	longitude := r.URL.Query().Get("lon")

	if latitude == "" || longitude == "" {
		http.Error(w, "lat and lon query parameters are required", http.StatusBadRequest)
		return
	}

	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&current_weather=true", latitude, longitude)
	
	client := http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch weather data", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "Error from upstream weather API", http.StatusBadGateway)
		return
	}

	var weatherData WeatherResponse
	if err := json.NewDecoder(resp.Body).Decode(&weatherData); err != nil {
		http.Error(w, "Failed to parse weather data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(weatherData.CurrentWeather)
}

func main() {
	http.HandleFunc("/api/weather", weatherHandler)
	port := "8080"
	fmt.Printf("Weather API Wrapper running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
