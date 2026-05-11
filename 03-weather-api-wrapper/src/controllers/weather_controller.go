package controllers

import (
	"net/http"
	"strings"
	"weather-api-wrapper/src/models"
	"weather-api-wrapper/src/services"
	"weather-api-wrapper/src/utils"

	"github.com/gin-gonic/gin"
)

func GetWeather(c *gin.Context) {
	var req models.WeatherRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		utils.Logger.Warn("Invalid request parameters: " + err.Error())
		c.JSON(http.StatusBadRequest, models.APIError{Message: "City must contain 2 to 100 characters"})
		return
	}
	req.City = strings.TrimSpace(req.City)
	if len([]rune(req.City)) < 2 {
		c.JSON(http.StatusBadRequest, models.APIError{Message: "City must contain 2 to 100 characters"})
		return
	}

	utils.Logger.Info("Fetching weather for city: " + req.City)

	weatherInfo, err := services.GetWeatherByCity(req.City)
	if err != nil {
		utils.Logger.Error("Weather fetching failed: " + err.Error())
		c.JSON(http.StatusBadGateway, models.APIError{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, weatherInfo)
}
