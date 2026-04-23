package models

type WeatherRequest struct {
	City string `form:"city" binding:"required,min=2,max=100"`
}

type WeatherResponse struct {
	City        string  `json:"city"`
	Temperature float64 `json:"temperature"`
	Description string  `json:"description"`
}

type APIError struct {
	Message string `json:"message"`
}
