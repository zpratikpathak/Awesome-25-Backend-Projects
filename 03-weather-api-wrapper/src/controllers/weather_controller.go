package controllers

import (
	"net/http"
	"weather-api-wrapper/src/models"
	"weather-api-wrapper/src/services"
	"weather-api-wrapper/src/utils"

	"github.com/gin-gonic/gin"
)

func GetWeather(c *gin.Context) {
	var req models.WeatherRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		utils.Logger.Warn("Invalid request parameters: " + err.Error())
		c.Error(err) // Let the error handler deal with it
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
